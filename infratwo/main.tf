provider "aws" {
  region = var.aws_region
}

# Fetch sensitive values from AWS Secrets Manager
data "aws_secretsmanager_secret_version" "vpc_cidr" {
  secret_id = "vpc_cidr"
}

data "aws_secretsmanager_secret_version" "azs" {
  secret_id = "azs"
}

data "aws_secretsmanager_secret_version" "public_subnets" {
  secret_id = "public_subnets"
}

data "aws_secretsmanager_secret_version" "private_subnets" {
  secret_id = "private_subnets"
}

data "aws_secretsmanager_secret_version" "cluster_name" {
  secret_id = "cluster_name"
}

data "aws_secretsmanager_secret_version" "eks_cluster_version" {
  secret_id = "eks_cluster_version"
}

data "aws_secretsmanager_secret_version" "rds_allocated_storage" {
  secret_id = "rds_allocated_storage"
}

data "aws_secretsmanager_secret_version" "db_name" {
  secret_id = "db_name"
}

data "aws_secretsmanager_secret_version" "db_username" {
  secret_id = "db_username"
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "db_password"
}

data "aws_secretsmanager_secret_version" "rds_engine" {
  secret_id = "rds_engine"
}

data "aws_secretsmanager_secret_version" "rds_instance_class" {
  secret_id = "rds_instance_class"
}

data "aws_secretsmanager_secret_version" "db_engine_version" {
  secret_id = "db_engine_version"
}

data "aws_secretsmanager_secret_version" "db_family" {
  secret_id = "db_family"
}

# VPC Module
module "vpc" {
  source          = "terraform-aws-modules/vpc/aws"
  name            = "eks-vpc"
  cidr            = jsondecode(data.aws_secretsmanager_secret_version.vpc_cidr.secret_string)
  azs             = jsondecode(data.aws_secretsmanager_secret_version.azs.secret_string)
  public_subnets  = jsondecode(data.aws_secretsmanager_secret_version.public_subnets.secret_string)
  private_subnets = jsondecode(data.aws_secretsmanager_secret_version.private_subnets.secret_string)
  enable_nat_gateway = true
}

# EKS Cluster with Managed Node Groups
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = data.aws_secretsmanager_secret_version.cluster_name.secret_string
  cluster_version = data.aws_secretsmanager_secret_version.eks_cluster_version.secret_string
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    managed_nodes = {
      min_size     = 1
      max_size     = 3
      desired_size = 2
    }
  }
}

# RDS Instance
module "rds" {
  source                 = "terraform-aws-modules/rds/aws"
  identifier             = data.aws_secretsmanager_secret_version.db_name.secret_string
  allocated_storage      = tonumber(data.aws_secretsmanager_secret_version.rds_allocated_storage.secret_string)
  username               = data.aws_secretsmanager_secret_version.db_username.secret_string
  password               = data.aws_secretsmanager_secret_version.db_password.secret_string
  manage_master_user_password = false
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  publicly_accessible    = false

  engine            = data.aws_secretsmanager_secret_version.rds_engine.secret_string
  major_engine_version   = data.aws_secretsmanager_secret_version.db_engine_version.secret_string
  family                = data.aws_secretsmanager_secret_version.db_family.secret_string
  instance_class         = data.aws_secretsmanager_secret_version.rds_instance_class.secret_string
}

# ECR Repositories
resource "aws_ecr_repository" "client" {
  name = "client"
}

resource "aws_ecr_repository" "api" {
  name = "api"
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

# Outputs
output "eks_cluster_name" {
  value = module.eks.cluster_name
  sensitive = true
}

output "rds_endpoint" {
  value = module.rds.db_instance_endpoint
  sensitive  = true
}
