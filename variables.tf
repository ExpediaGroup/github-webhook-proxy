# Global terraform vars
variable "aws_region" {
  description = "The AWS region to deploy to (e.g. us-east-1)"
  type        = string
}

variable "resource_prefix" {
  description = "Prefix of webhook proxy resources"
  type        = string
  default     = "gwp"
}

variable "custom_tags" {
  type        = map(string)
  description = "Additional tags to be applied to all resources applied by this module."
  default     = {}
}

variable "log_retention_days" {
  description = "Number of days CloudWatch will retain logs"
  type        = number
  default     = 7
}

variable "lambda_timeout_seconds" {
  description = "Number of seconds until lambda times out"
  type        = number
  default     = 10
}

// https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-and-saml-for-iam/about-enterprise-managed-users
variable "enterprise_managed_user_suffix" {
  description = "Managed user suffix used for central identity management on GHEC"
  type        = string
  default     = ""
}

variable "enterprise_slug" {
  description = "The name (slug) of the enterprise on GHEC"
  type        = string
}

variable "lambda_bucket_name" {
  description = "S3 bucket with lambda and layer archives"
  type        = string
}

variable "lambda_layer_arn" {
  description = "Lambda layer ARN for data store"
  type        = string
}

variable "extra_role_policy" {
  description = "jsonencoded string policy to include in the proxy lambda role"
  type        = string
  default     = null
}

variable "vpc_id" {
  description = "VPC id for Lambda VPC config"
  type        = string
}

variable "subnet_ids" {
  description = "subnet_ids for Lambda VPC config"
  type        = list(string)
}

variable "api_gateway_domain_name" {
  description = "Domain name for API gateway domain mapping"
  type        = string
  default     = null
}

variable "route_53_record_name" {
  description = "Record name for Route 53 record creation"
  type        = string
  default     = null
}

variable "certificate_arn" {
  description = "Certificate ARN for API gateway domain name"
  type        = string
  default     = null
}

variable "zone_id" {
  description = "Zone id for Route53 record"
  type        = string
  default     = null
}
