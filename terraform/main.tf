provider "aws" {
  region = var.aws_region
}

data "aws_secretsmanager_secret" "host_region" {
  name = "host-region"
}

data "aws_secretsmanager_secret_version" "host_region" {
  secret_id = data.aws_secretsmanager_secret.host_region.id
}

data "aws_secretsmanager_secret" "cluster_name" {
  name = "cluster_name"
}

data "aws_secretsmanager_secret_version" "cluster_name" {
  secret_id = data.aws_secretsmanager_secret.cluster_name.id
}

data "aws_secretsmanager_secret" "vpc_cidr" {
  name = "vpc_cidr"
}

data "aws_secretsmanager_secret_version" "vpc_cidr" {
  secret_id = data.aws_secretsmanager_secret.vpc_cidr.id
}

data "aws_secretsmanager_secret" "db_name" {
  name = "db_name"
}

data "aws_secretsmanager_secret_version" "db_name" {
  secret_id = data.aws_secretsmanager_secret.db_name.id
}

data "aws_secretsmanager_secret" "db_username" {
  name = "db_username"
}

data "aws_secretsmanager_secret_version" "db_username" {
  secret_id = data.aws_secretsmanager_secret.db_username.id
}

data "aws_secretsmanager_secret" "db_password" {
  name = "db_password"
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = data.aws_secretsmanager_secret.db_password.id
}

data "aws_secretsmanager_secret" "eks_instance_type" {
  name = "eks_instance_type"
}

data "aws_secretsmanager_secret_version" "eks_instance_type" {
  secret_id = data.aws_secretsmanager_secret.eks_instance_type.id
}

data "aws_secretsmanager_secret" "rds_engine" {
  name = "rds_engine"
}

data "aws_secretsmanager_secret_version" "rds_engine" {
  secret_id = data.aws_secretsmanager_secret.rds_engine.id
}

data "aws_secretsmanager_secret" "rds_instance_class" {
  name = "rds_instance_class"
}

data "aws_secretsmanager_secret_version" "rds_instance_class" {
  secret_id = data.aws_secretsmanager_secret.rds_instance_class.id
}

data "aws_secretsmanager_secret" "rds_allocated_storage" {
  name = "rds_allocated_storage"
}

data "aws_secretsmanager_secret_version" "rds_allocated_storage" {
  secret_id = data.aws_secretsmanager_secret.rds_allocated_storage.id
}

data "aws_secretsmanager_secret" "eks_cluster_version" {
  name = "eks_cluster_version"
}

data "aws_secretsmanager_secret_version" "eks_cluster_version" {
  secret_id = data.aws_secretsmanager_secret.eks_cluster_version.id
}

data "aws_secretsmanager_secret" "azs" {
  name = "azs"
}

data "aws_secretsmanager_secret_version" "azs" {
  secret_id = data.aws_secretsmanager_secret.azs.id
}

data "aws_secretsmanager_secret" "public_subnets" {
  name = "public_subnets"
}

data "aws_secretsmanager_secret_version" "public_subnets" {
  secret_id = data.aws_secretsmanager_secret.public_subnets.id
}

data "aws_secretsmanager_secret" "private_subnets" {
  name = "private_subnets"
}

data "aws_secretsmanager_secret_version" "private_subnets" {
  secret_id = data.aws_secretsmanager_secret.private_subnets.id
}

data "aws_secretsmanager_secret" "db_family" {
  name = "db_family"
}

data "aws_secretsmanager_secret_version" "db_family" {
  secret_id = data.aws_secretsmanager_secret.db_family.id
}

data "aws_secretsmanager_secret" "db_engine_version" {
  name = "db_engine_version"
}

data "aws_secretsmanager_secret_version" "db_engine_version" {
  secret_id = data.aws_secretsmanager_secret.db_engine_version.id
}

data "aws_ssm_parameter" "eks_ami_id" {
  name = "/aws/service/eks/optimized-ami/1.31/amazon-linux-2/recommended/image_id"
}

# Create VPC
module "vpc" {
  source = "./modules/vpc"
  cidr   = data.aws_secretsmanager_secret_version.vpc_cidr.secret_string

  azs             = jsondecode(data.aws_secretsmanager_secret_version.azs.secret_string)
  public_subnets  = jsondecode(data.aws_secretsmanager_secret_version.public_subnets.secret_string)
  private_subnets = jsondecode(data.aws_secretsmanager_secret_version.private_subnets.secret_string)
}

# Create EKS Cluster
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = data.aws_secretsmanager_secret_version.cluster_name.secret_string
  cluster_version = data.aws_secretsmanager_secret_version.eks_cluster_version.secret_string
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = jsondecode(data.aws_secretsmanager_secret_version.public_subnets.secret_string)

  self_managed_node_groups = {
    eks_nodes = {
      desired_capacity = 2
      max_capacity     = 3
      min_capacity     = 1

      instance_type = data.aws_secretsmanager_secret_version.eks_instance_type.secret_string
      ami_id        = data.aws_ssm_parameter.eks_ami_id.value
    }
  }
}

# RDS Instance
module "rds" {
  source                 = "terraform-aws-modules/rds/aws"
  identifier             = data.aws_secretsmanager_secret_version.db_name.secret_string
  engine                 = data.aws_secretsmanager_secret_version.rds_engine.secret_string
  instance_class         = data.aws_secretsmanager_secret_version.rds_instance_class.secret_string
  allocated_storage      = tonumber(data.aws_secretsmanager_secret_version.rds_allocated_storage.secret_string)
  username               = data.aws_secretsmanager_secret_version.db_username.secret_string
  password               = data.aws_secretsmanager_secret_version.db_password.secret_string
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  db_subnet_group_name   = module.vpc.db_subnet_group_name
  engine_version         = data.aws_secretsmanager_secret_version.db_engine_version.secret_string
  family                 = data.aws_secretsmanager_secret_version.db_family.secret_string
}

# ECR Repositories
resource "aws_ecr_repository" "client" {
  name = "client"
}

resource "aws_ecr_repository" "api" {
  name = "api"
}