variable "aws_region" {
  description = "AWS region for Terraform backend resources."
  type        = string
  default     = "us-east-1"
}

variable "project" {
  type        = string
  description = "Project name."
  default     = "ccnl-dashboard"
}

variable "environment" {
  type        = string
  description = "Deployment environment."
  default     = "prod"
}

variable "terraform_state_bucket_name" {
  description = "Globally unique S3 bucket name for Terraform remote state."
  type        = string
}

variable "tags" {
  description = "Tags applied to bootstrap resources."
  type        = map(string)
  default     = {}
}
