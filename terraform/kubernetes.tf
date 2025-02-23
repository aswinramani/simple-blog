provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  token                  = data.aws_eks_cluster_auth.cluster.token
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
}

data "aws_eks_cluster" "cluster" {
  depends_on = [module.eks]
  name       = data.aws_secretsmanager_secret_version.cluster_name.secret_string
}

data "aws_eks_cluster_auth" "cluster" {
  depends_on = [module.eks]
  name       = data.aws_secretsmanager_secret_version.cluster_name.secret_string
}

resource "kubernetes_deployment" "client" {
  metadata {
    name      = "client"
    namespace = "default"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "client"
      }
    }

    template {
      metadata {
        labels = {
          app = "client"
        }
      }

      spec {
        container {
          image = "${aws_ecr_repository.client.repository_url}:latest"
          name  = "client"

          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_deployment" "api" {
  metadata {
    name      = "api"
    namespace = "default"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "api"
      }
    }

    template {
      metadata {
        labels = {
          app = "api"
        }
      }

      spec {
        container {
          image = "${aws_ecr_repository.api.repository_url}:latest"
          name  = "api"

          port {
            container_port = 3100
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "client" {
  metadata {
    name      = "client"
    namespace = "default"
  }

  spec {
    selector = {
      app = "client"
    }

    port {
      port        = 80
      target_port = 80
    }

    type = "LoadBalancer"
  }
}

resource "kubernetes_service" "api" {
  metadata {
    name      = "api"
    namespace = "default"
  }

  spec {
    selector = {
      app = "api"
    }

    port {
      port        = 3100
      target_port = 3100
    }

    type = "LoadBalancer"
  }
}