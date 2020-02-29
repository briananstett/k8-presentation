provider "google" {
  project     = "g-1575-internal-projects"
  region      = "us-central1"
  zone        = "us-central1-c"
}

resource "google_compute_instance" "docker_instance" {
  name         = "ou-2020-docker"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"

  tags = ["docker", "ou-2020"]

  boot_disk {
    initialize_params {
      image = "ubuntu-1804-bionic-v20200218"
    }
  }

  // Local SSD disk
  scratch_disk {
    interface = "SCSI"
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral IP
    }
  }

  metadata_startup_script = "apt-get install unzip -y && curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs"

  service_account {
    scopes = ["userinfo-email", "compute-ro", "storage-ro"]
  }
}

resource "google_compute_firewall" "http-server" {
  name    = "default-allow-http"
  network = "default"

  allow {
    protocol = "tcp"
  }

  // Allow traffic from everywhere to instances with an http-server tag
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ou-2020"]
}
