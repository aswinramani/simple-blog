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

data "aws_ssm_parameter" "amazon_linux_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
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

resource "aws_instance" "bastion" {
  ami           = data.aws_ssm_parameter.amazon_linux_ami.value
  instance_type = "t3.micro"
  subnet_id     = module.vpc.public_subnets[0]
  security_groups = [aws_security_group.bastion_sg.id]
  key_name      = var.bastion_key_name

  tags = {
    Name = "bastion-host"
  }
}

resource "aws_security_group" "bastion_sg" {
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.bastion_cidr]
  }
}

# EKS Cluster with Managed Node Groups
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = data.aws_secretsmanager_secret_version.cluster_name.secret_string
  cluster_version = data.aws_secretsmanager_secret_version.eks_cluster_version.secret_string
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  cluster_endpoint_public_access = var.cluster_public_access
  cluster_endpoint_private_access = var.cluster_private_access

  eks_managed_node_groups = {
    managed_nodes = {
      min_size     = 1
      max_size     = 3
      desired_size = 2
    }
  }
}

# RDS Security Group
resource "aws_security_group" "rds_sg" {
  vpc_id = module.vpc.vpc_id
}

resource "aws_security_group_rule" "rds_from_eks" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = module.eks.cluster_security_group_id
}

resource "aws_security_group_rule" "rds_from_bastion" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.bastion_sg.id
}

# RDS Instance with Parameter Group
resource "aws_db_parameter_group" "rds_params" {
  name   = "rds-params"
  family = data.aws_secretsmanager_secret_version.db_family.secret_string

  parameter {
    name  = var.rds_param_key
    value = var.rds_param_value
  }
}

module "rds" {
  source                 = "terraform-aws-modules/rds/aws"
  identifier             = data.aws_secretsmanager_secret_version.db_name.secret_string
  allocated_storage      = tonumber(data.aws_secretsmanager_secret_version.rds_allocated_storage.secret_string)
  username               = data.aws_secretsmanager_secret_version.db_username.secret_string
  password               = data.aws_secretsmanager_secret_version.db_password.secret_string
  manage_master_user_password = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  publicly_accessible    = false
  parameter_group_name   = aws_db_parameter_group.rds_params.name

  engine            = data.aws_secretsmanager_secret_version.rds_engine.secret_string
  major_engine_version   = data.aws_secretsmanager_secret_version.db_engine_version.secret_string
  family                = data.aws_secretsmanager_secret_version.db_family.secret_string
  instance_class         = data.aws_secretsmanager_secret_version.rds_instance_class.secret_string
}

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

resource "aws_eip" "bastion_eip" {
  instance = aws_instance.bastion.id
  domain   = "vpc"
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
  sensitive = true
}

output "rds_endpoint" {
  value = module.rds.db_instance_endpoint
  sensitive  = true
}

output "bastion_public_ip" {
  value = aws_eip.bastion_eip.public_ip
  sensitive  = true
}
