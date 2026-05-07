variable "aws_region" {
  description = "AWS region for production resources."
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name."
  type        = string
  default     = "ccnl-dashboard"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "prod"
}

variable "resource_prefix" {
  description = "Prefix used for naming AWS resources."
  type        = string
  default     = "ccnl-prod"
}

variable "site_bucket_name" {
  description = "Globally unique S3 bucket name for static site assets and current data artifacts."
  type        = string
}

variable "public_hostname" {
  description = "Public hostname served by CloudFront. DNS is managed outside Terraform."
  type        = string
}

variable "enable_custom_domain" {
  description = "Whether to attach the ACM-backed custom hostname to CloudFront."
  type        = bool
  default     = false
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days."
  type        = number
  default     = 30
}

variable "site_build_source_type" {
  description = "CodeBuild source provider type. Use GITHUB for a GitHub repository configured in CodeBuild, or another CodeBuild-supported source type."
  type        = string
  default     = "GITHUB"
}

variable "site_build_source_location" {
  description = "CodeBuild source location, such as a GitHub repository URL."
  type        = string
}

variable "site_build_source_version" {
  description = "Source version for scheduled builds, such as a branch name, tag, or commit. Leave empty to use the provider default."
  type        = string
  default     = "master"
}

variable "site_build_buildspec_path" {
  description = "Path to the buildspec file inside the source repository."
  type        = string
  default     = "infra/main/buildspec.yml"
}

variable "site_build_image" {
  description = "CodeBuild managed image used for the scheduled site build."
  type        = string
  default     = "aws/codebuild/standard:7.0"
}

variable "site_build_compute_type" {
  description = "CodeBuild compute type for the scheduled site build."
  type        = string
  default     = "BUILD_GENERAL1_SMALL"
}

variable "site_build_timeout_minutes" {
  description = "Maximum CodeBuild runtime in minutes."
  type        = number
  default     = 30
}

variable "site_build_schedule_expression" {
  description = "EventBridge Scheduler cron expression for full site rebuilds."
  type        = string
  default     = "cron(0 7 ? * MON *)"
}

variable "site_build_schedule_timezone" {
  description = "Timezone for the scheduled site build."
  type        = string
  default     = "Europe/Rome"
}

variable "site_build_schedule_state" {
  description = "Whether the scheduled site build is enabled or disabled."
  type        = string
  default     = "ENABLED"

  validation {
    condition     = contains(["ENABLED", "DISABLED"], var.site_build_schedule_state)
    error_message = "site_build_schedule_state must be ENABLED or DISABLED."
  }
}

variable "monthly_budget_limit_usd" {
  description = "Monthly account-level AWS budget in USD."
  type        = string
  default     = "30"
}

variable "notification_email" {
  description = "Email address for budget and runtime notifications."
  type        = string
}

variable "tags" {
  description = "Tags applied to production resources."
  type        = map(string)
  default     = {}
}
