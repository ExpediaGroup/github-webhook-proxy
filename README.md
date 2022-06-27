# github-webhook-proxy

`github-webhook-proxy` is a request forwarder
for [GitHub webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) from github.com
to internal enterprise destinations, designed for use in Github Enterprise Cloud.

## Usage

To use this Terraform module, you will need an S3 bucket containing a `proxy-lambda.zip` asset attached to each release of this repository.
This zip file can be uploaded using the following script:

```shell
# Upload Lambda to s3_destination
file="proxy-lambda.zip"
curl -o "${file}" -fL https://github.com/ExpediaGroup/github-webhook-proxy/releases/download/"${version}"/"${file}"
aws s3 cp "${file}" "${s3_destination}/${file}"
```

Optionally, you may create a Lambda layer which optionally contains the following files:
* `allowed-github-orgs.json`: An array of GitHub organizations which webhooks are allowed to originate from. If omitted, all organizations will be allowed.
* `allowed-destination-hosts.json`: An array of destination hosts that the proxy can forward to. If omitted, all destinations will be allowed.
* `ca.pem`: A root CA certificate for forwarding to internal destinations with self-signed certs
* `cert.pem`: A chain certificate for forwarding to internal destinations with self-signed certs

These files must be in a zipped `layer` directory, and this can be uploaded using the following script:
```shell
# Zip and Upload Lambda Layer to s3_destination
file="proxy-lambda-layer.zip"
zip -r -qq "${file}" layer
aws s3 cp "${file}" "${s3_destination}/${file}"
```

If the layer is used, its ARN must be passed to the `lambda_layer_arn` Terraform variable.

### Example Terraform Module Usage
```hcl
module "github-webhook-proxy" {
  source     = "git::https://github.com/ExpediaGroup/github-webhook-proxy.git?ref=v1"
  aws_region = var.aws_region

  vpc_id     = data.aws_vpc.vpc.id
  subnet_ids = data.aws_subnets.subnets.ids

  lambda_bucket_name = local.lambda_bucket_name
  lambda_layer_arn   = aws_lambda_layer_version.proxy_layer.arn

  custom_tags = {
    "Application" = "github-webhook-proxy"
  }
}

data "aws_s3_object" "proxy_lambda_layer" {
  bucket = local.lambda_bucket_name
  key    = "path/to/proxy-lambda-layer.zip"
}

resource "aws_lambda_layer_version" "proxy_layer" {
  layer_name        = "github-webhook-proxy-layer"
  s3_bucket         = data.aws_s3_object.proxy_lambda_layer.bucket
  s3_key            = data.aws_s3_object.proxy_lambda_layer.key
  s3_object_version = data.aws_s3_object.proxy_lambda_layer.version_id
}

locals {
  lambda_bucket_name = "proxy-lambda-bucket"
}
```

### Adding a New Webhook

1. **Create the webhook proxy URL**
    1. Obtain your desired destination URL, i.e. the internal endpoint where you want to send webhooks.
    2. Encode your destination URL! An easy way to do this is to use `jq` in your terminal
       (install it [here](https://stedolan.github.io/jq/download/) if you don't have it already): `jq -rn --arg x 'YOUR_DESTINATION_URL_HERE' '$x|@uri'`
    3. Paste the encoded URL at the end of the webhook proxy base URL (`https://YOUR_API_URL/webhook`).
2. **Add the webhook to your repository**
    1. As an administrator, navigate to your repository settings -> Webhooks -> Add webhook
    2. Paste your webhook proxy URL in the "Payload URL" box. You do not need to worry about "Content type".
    3. By default, GitHub will only send requests on the "push" event, but you may configure it to send on other events as well.
    4. Click "Add webhook"

### Example Webhook Proxy URL Creation

Destination URL: `https://my-destination.url/endpoint`

:arrow_down:

Encoded destination URL: `https%3A%2F%2Fmy-destination.url%2Fendpoint%2F`

:arrow_down:

Webhook URL: `https://YOUR_API_URL/webhook/https%3A%2F%2Fmy-destination.url%2Fendpoint%2F`

## Technical Overview

### Incoming Request

When a webhook from github.com is sent to https://YOUR_API_URL/webhook, it is routed
to the API Gateway resource
via [DNS mapping](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html).
The API Gateway has an [IP allowlist](https://github.com/ExpediaGroup/github-webhook-proxy/blob/main/github-hooks-ip-ranges.tf) which only accepts requests originating
from [GitHub Hooks IP ranges](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses).
This ensures that the proxy endpoint can only be accessed by webhook requests from github.com.

### Request Parsing

The API Gateway then invokes the Lambda function, which parses the request body from the
[supported content types](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks#content-type)
.
Each request to the webhook proxy must adhere to the following format:
`https://YOUR_API_URL/webhook/${endpointId}`
where `endpointId` is an [encoded](https://www.w3schools.com/tags/ref_urlencode.asp) destination URL. The Lambda decodes
the `endpointId` to make it a valid URL.

### Request Validation

The Lambda then performs the following validations:

* The request must have originated from a GitHub repository with an approved GitHub organization, OR the request must
  come from a personal repository where the username ends in the enterprise managed user suffix (if provided).
  The list of allowed GitHub orgs is read from `allowed-github-orgs.json` in the Lambda layer,
  and the user suffix is passed via the `enterprise_managed_user_suffix` Terraform variable.
* The request host must have an approved destination URL host, which is the decoded `endpointId` specified in the request
  URL. The list of allowed destination hosts is read from `allowed-destination-hosts.json` in the Lambda layer.

### TLS Support
If a root and chain certificate are not provided in the Lambda layer, the runtime environment will supply certificates for requests.
If these certificates are provided, however, the proxy will forward each request with `ca.pem` and `cert.pem` as the
root and chain, respectively, with the root certificate appended to the [Mozilla CA certificate store](https://curl.se/docs/caextract.html).

### Webhook Proxy Responses

If any of these validations fail, the webhook proxy will return a 403 unauthorized error. If all validations pass, the
request payload and headers are forwarded to the specified destination URL, and the proxy will return the response it
receives from the destination. If an unexpected error occurs, the webhook proxy will return a 500 internal server error.

## Repository Overview

### Terraform Module
This repository contains Terraform (`*.tf`) files which are intended to be consumed as a Terraform module.
The files are generally organized by resource type. See the "Resources" section in [USAGE.md](https://github.com/ExpediaGroup/github-webhook-proxy/tree/main/USAGE.md) for more infrastructure details.

### Lambda Function
The Lambda function is a Node.js Lambda compiled from Typescript, and lives in the ["lambda" directory](https://github.com/ExpediaGroup/github-webhook-proxy/tree/main/lambda).

### GitHub IP Range Allowlist
This repo has a GitHub Actions [workflow](https://github.com/ExpediaGroup/github-webhook-proxy/tree/main/.github/workflows/github-ip-ranges.yml) which checks that the [GitHub Hooks IP Ranges file](https://github.com/ExpediaGroup/github-webhook-proxy/tree/main/github-hooks-ip-ranges.tf) is up to date.
It runs a script once a day which calls https://api.github.com/meta and ensures the IP ranges in "hooks" match our current IP allowlist in the API Gateway.
If the list is out of date, it will create a PR to update it.

