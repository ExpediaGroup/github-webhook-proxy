resource "aws_api_gateway_base_path_mapping" "dns_mapping" {
  count       = local.api_gateway_domain_count
  api_id      = aws_api_gateway_rest_api.ingress_api.id
  stage_name  = aws_api_gateway_stage.ingress.stage_name
  domain_name = aws_api_gateway_domain_name.proxy[0].domain_name
}

resource "aws_api_gateway_domain_name" "proxy" {
  count                    = local.api_gateway_domain_count
  domain_name              = var.api_gateway_domain_name
  regional_certificate_arn = var.certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "proxy" {
  count   = local.api_gateway_domain_count
  name    = var.route_53_record_name
  type    = "A"
  zone_id = var.zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.proxy[0].regional_domain_name
    zone_id                = aws_api_gateway_domain_name.proxy[0].regional_zone_id
  }
}
