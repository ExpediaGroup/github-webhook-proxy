output "apigateway_invoke_url" {
  value = aws_api_gateway_stage.ingress.invoke_url
}

output "apigateway_ingress_id" {
  value = aws_api_gateway_deployment.ingress.id
}
