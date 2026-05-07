output "site_bucket_name" {
  description = "S3 bucket containing static site files and current data artifacts."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID to use for invalidations."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name to configure as the Cloudflare DNS target."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "public_hostname" {
  description = "Configured public site hostname."
  value       = local.custom_domain_requested ? var.public_hostname : null
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN for the public hostname when one is requested."
  value       = local.custom_domain_requested ? aws_acm_certificate.site[0].arn : null
}

output "acm_certificate_validation_records" {
  description = "DNS validation records to create in Cloudflare before enabling the custom domain."
  value = local.custom_domain_requested ? [
    for option in aws_acm_certificate.site[0].domain_validation_options : {
      name  = option.resource_record_name
      type  = option.resource_record_type
      value = option.resource_record_value
    }
  ] : []
}

output "site_build_project_name" {
  description = "CodeBuild project that rebuilds and publishes the static site."
  value       = aws_codebuild_project.site_build.name
}

output "site_build_schedule_name" {
  description = "EventBridge Scheduler schedule that starts the weekly site build."
  value       = aws_scheduler_schedule.site_build.name
}
