resource "aws_security_group" "lambda" {
  description = "Allow outbound from GitHub Webhook Proxy Lambda"
  vpc_id      = var.vpc_id
  tags        = var.custom_tags

  egress {
    cidr_blocks = ["0.0.0.0/0"] #tfsec:ignore:AWS009
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}
