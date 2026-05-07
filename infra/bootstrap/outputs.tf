output "state_bucket_name" {
  description = "S3 bucket name to use in the production Terraform backend."
  value       = aws_s3_bucket.terraform_state.bucket
}

output "backend_region" {
  description = "AWS region to use in the production Terraform backend."
  value       = var.aws_region
}
