locals {
  module_name = "github-webhook-proxy"
  api_gateway_domain_count = (
    var.api_gateway_domain_name != null &&
    var.route_53_record_name != null &&
    var.certificate_arn != null &&
    var.zone_id != null
  ) ? 1 : 0
}
