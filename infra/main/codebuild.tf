data "aws_partition" "current" {}

resource "aws_cloudwatch_log_group" "site_build" {
  name              = "/aws/codebuild/${var.resource_prefix}-site-build"
  retention_in_days = var.log_retention_days

  tags = local.common_tags
}

data "aws_iam_policy_document" "codebuild_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"
      values   = ["arn:${data.aws_partition.current.partition}:codebuild:${var.aws_region}:${data.aws_caller_identity.current.account_id}:project/${var.resource_prefix}-site-build"]
    }
  }
}

resource "aws_iam_role" "codebuild" {
  name               = "${var.resource_prefix}-codebuild"
  assume_role_policy = data.aws_iam_policy_document.codebuild_assume_role.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "codebuild" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "${aws_cloudwatch_log_group.site_build.arn}:*",
    ]
  }

  statement {
    actions = [
      "s3:GetBucketLocation",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.site.arn,
    ]
  }

  statement {
    actions = [
      "s3:DeleteObject",
      "s3:PutObject",
    ]

    resources = [
      "${aws_s3_bucket.site.arn}/*",
    ]
  }

  statement {
    actions = [
      "cloudfront:CreateInvalidation",
    ]

    resources = [
      aws_cloudfront_distribution.site.arn,
    ]
  }
}

resource "aws_iam_role_policy" "codebuild" {
  name   = "${var.resource_prefix}-codebuild"
  role   = aws_iam_role.codebuild.id
  policy = data.aws_iam_policy_document.codebuild.json
}

resource "aws_codebuild_project" "site_build" {
  name           = "${var.resource_prefix}-site-build"
  description    = "Build and publish the ${var.project} static site."
  service_role   = aws_iam_role.codebuild.arn
  build_timeout  = var.site_build_timeout_minutes
  source_version = trimspace(var.site_build_source_version) != "" ? var.site_build_source_version : null

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = var.site_build_compute_type
    image                       = var.site_build_image
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "SITE_BUCKET"
      value = aws_s3_bucket.site.bucket
    }

    environment_variable {
      name  = "CLOUDFRONT_DISTRIBUTION_ID"
      value = aws_cloudfront_distribution.site.id
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name = aws_cloudwatch_log_group.site_build.name
      status     = "ENABLED"
    }
  }

  source {
    type      = var.site_build_source_type
    location  = var.site_build_source_location
    buildspec = var.site_build_buildspec_path
  }

  tags = local.common_tags
}

data "aws_iam_policy_document" "scheduler_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"
      values   = ["arn:${data.aws_partition.current.partition}:scheduler:${var.aws_region}:${data.aws_caller_identity.current.account_id}:schedule/${var.resource_prefix}-schedules/${var.resource_prefix}-site-build"]
    }
  }
}

resource "aws_iam_role" "scheduler" {
  name               = "${var.resource_prefix}-scheduler"
  assume_role_policy = data.aws_iam_policy_document.scheduler_assume_role.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "scheduler" {
  statement {
    actions = ["codebuild:StartBuild"]

    resources = [
      aws_codebuild_project.site_build.arn,
    ]
  }
}

resource "aws_iam_role_policy" "scheduler" {
  name   = "${var.resource_prefix}-scheduler"
  role   = aws_iam_role.scheduler.id
  policy = data.aws_iam_policy_document.scheduler.json
}

resource "aws_scheduler_schedule_group" "site_build" {
  name = "${var.resource_prefix}-schedules"

  tags = local.common_tags
}

resource "aws_scheduler_schedule" "site_build" {
  name                         = "${var.resource_prefix}-site-build"
  group_name                   = aws_scheduler_schedule_group.site_build.name
  schedule_expression          = var.site_build_schedule_expression
  schedule_expression_timezone = var.site_build_schedule_timezone
  state                        = var.site_build_schedule_state

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = aws_codebuild_project.site_build.arn
    role_arn = aws_iam_role.scheduler.arn

    retry_policy {
      maximum_event_age_in_seconds = 3600
      maximum_retry_attempts       = 0
    }
  }
}
