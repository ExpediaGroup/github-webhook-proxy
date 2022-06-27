resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.proxy.function_name}"
  retention_in_days = var.log_retention_days
  tags              = var.custom_tags
}

data "aws_iam_policy_document" "lambda_logging" {
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    effect    = "Allow"
    resources = [aws_cloudwatch_log_group.lambda.arn]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name   = "${var.resource_prefix}-lambda-logging"
  role   = aws_iam_role.proxy.name
  policy = data.aws_iam_policy_document.lambda_logging.json
}

data "aws_iam_policy_document" "apigw_logging" {
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    effect    = "Allow"
    resources = [aws_cloudwatch_log_group.apigw.arn]
  }
}

resource "aws_cloudwatch_log_group" "apigw" {
  name              = "/aws/apigateway/${aws_api_gateway_rest_api.ingress_api.name}"
  retention_in_days = var.log_retention_days
  tags              = var.custom_tags
}

resource "aws_iam_role_policy" "apigw_logging" {
  name   = "${var.resource_prefix}-apigw-logging"
  role   = aws_iam_role.proxy.name
  policy = data.aws_iam_policy_document.apigw_logging.json
}

resource "aws_cloudwatch_dashboard" "metrics" {
  dashboard_name = "${local.module_name}-metrics"
  dashboard_body = file("${path.module}/dashboard.json")
}
