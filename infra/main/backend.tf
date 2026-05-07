terraform {
  backend "s3" {
    bucket       = "ccnl-dashboard-prod-tfstate-us-east-1"
    key          = "prod/main/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
