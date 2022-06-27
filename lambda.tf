data "aws_s3_object" "proxy_lambda" {
  bucket = var.lambda_bucket_name
  key    = "${local.module_name}/proxy-lambda.zip"
}

resource "aws_lambda_function" "proxy" {
  handler           = "build/proxy.handler"
  function_name     = "${var.resource_prefix}-proxy"
  memory_size       = 128
  role              = aws_iam_role.proxy.arn
  runtime           = "nodejs14.x"
  s3_bucket         = data.aws_s3_object.proxy_lambda.bucket
  s3_key            = data.aws_s3_object.proxy_lambda.key
  s3_object_version = data.aws_s3_object.proxy_lambda.version_id
  tags              = var.custom_tags
  timeout           = var.lambda_timeout_seconds
  layers            = [var.lambda_layer_arn]
  environment {
    variables = {
      ENTERPRISE_MANAGED_USER_SUFFIX = var.enterprise_managed_user_suffix
    }
  }

  tracing_config {
    mode = "Active"
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }
}

data "aws_iam_policy_document" "proxy_service" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "proxy" {
  name               = "${var.resource_prefix}-proxy-role"
  assume_role_policy = data.aws_iam_policy_document.proxy_service.json
  tags               = var.custom_tags
}

resource "aws_iam_role_policy" "extra_policy" {
  count  = var.extra_role_policy != null ? 1 : 0
  role   = aws_iam_role.proxy.name
  policy = jsondecode(var.extra_role_policy)
}

resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.proxy.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "vpc_execution" {
  role       = aws_iam_role.proxy.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
