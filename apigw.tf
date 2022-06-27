resource "aws_api_gateway_rest_api" "ingress_api" {
  name                         = "${var.resource_prefix}-ingress"
  description                  = "Github Enterprise Cloud Webhook proxy."
  disable_execute_api_endpoint = local.api_gateway_domain_count > 0 ? true : false
  tags                         = var.custom_tags

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "webhook" {
  parent_id   = aws_api_gateway_rest_api.ingress_api.root_resource_id
  path_part   = "webhook"
  rest_api_id = aws_api_gateway_rest_api.ingress_api.id
}

resource "aws_api_gateway_resource" "lambda_endpoint" {
  parent_id   = aws_api_gateway_resource.webhook.id
  path_part   = "{endpointId}"
  rest_api_id = aws_api_gateway_rest_api.ingress_api.id
}

resource "aws_api_gateway_method" "lambda_method" {
  rest_api_id   = aws_api_gateway_rest_api.ingress_api.id
  resource_id   = aws_api_gateway_resource.lambda_endpoint.id
  authorization = "NONE"
  http_method   = "POST"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.ingress_api.id
  resource_id             = aws_api_gateway_resource.lambda_endpoint.id
  http_method             = aws_api_gateway_method.lambda_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.proxy.invoke_arn
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.proxy.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.ingress_api.execution_arn}/*/${aws_api_gateway_method.lambda_method.http_method}${aws_api_gateway_resource.lambda_endpoint.path}"
}

resource "aws_api_gateway_deployment" "ingress" {
  rest_api_id = aws_api_gateway_rest_api.ingress_api.id

  triggers = {
    # Terraform does not trigger a redeploy when dependent resources change
    # All resources that require a new deployment on change need to be added to this list
    # Apply needs to run twice, first run fails with `Error: Provider produced inconsistent final plan`
    redeployment = sha1(jsonencode([
      aws_lambda_function.proxy,
      aws_api_gateway_resource.lambda_endpoint,
      aws_api_gateway_method.lambda_method,
      aws_api_gateway_integration.lambda,
      aws_api_gateway_rest_api_policy.allow_list
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "ingress" {
  depends_on = [
    aws_api_gateway_deployment.ingress,
    aws_cloudwatch_log_group.apigw
  ]

  rest_api_id          = aws_api_gateway_rest_api.ingress_api.id
  stage_name           = "v1"
  deployment_id        = aws_api_gateway_deployment.ingress.id
  tags                 = var.custom_tags
  xray_tracing_enabled = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.apigw.arn
    format = jsonencode({
      "requestId" : "$context.requestId",
      "extendedRequestId" : "$context.extendedRequestId",
      "ip" : "$context.identity.sourceIp",
      "caller" : "$context.identity.caller",
      "user" : "$context.identity.user",
      "requestTime" : "$context.requestTime",
      "httpMethod" : "$context.httpMethod",
      "resourcePath" : "$context.resourcePath",
      "status" : "$context.status",
      "protocol" : "$context.protocol",
      "responseLength" : "$context.responseLength"
    })
  }
}

resource "aws_api_gateway_method_settings" "log_settings" {
  rest_api_id = aws_api_gateway_rest_api.ingress_api.id
  stage_name  = aws_api_gateway_stage.ingress.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

data "aws_iam_policy_document" "allow_list" {
  statement {
    effect    = "Allow"
    actions   = ["execute-api:Invoke"]
    resources = ["*"]
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
  }

  statement {
    effect    = "Deny"
    actions   = ["execute-api:Invoke"]
    resources = ["*"]
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
    condition {
      test     = "NotIpAddress"
      variable = "aws:SourceIp"
      values   = local.github_hooks_ip_ranges
    }
  }
}

resource "aws_api_gateway_rest_api_policy" "allow_list" {
  rest_api_id = aws_api_gateway_rest_api.ingress_api.id
  policy      = data.aws_iam_policy_document.allow_list.json
}
