# provider "google" {
#   project     = "g-1573-training"
#   region      = "us-central1"
#   zone        = "us-central1-c"
# }

resource "google_container_cluster" "primary" {
  name               = "workshop-cluster"
  location           = "us-central1-a"
  initial_node_count = 2

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]

    metadata = {
      disable-legacy-endpoints = "true"
    }
    tags = ["kubernetes-workshop"]
  }

  timeouts {
    create = "30m"
    update = "40m"
  }
}

resource "google_compute_firewall" "k8-allow-all" {
  name    = "k8-workshop-allow-all"
  network = "default"

  allow {
    protocol = "tcp"
  }

  // Allow traffic from everywhere to instances with an http-server tag
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["kubernetes-workshop"]
}
