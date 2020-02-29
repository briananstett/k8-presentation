resource "google_compute_instance" "default" {
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

  metadata_startup_script = "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - && sudo apt-get install -y nodejs"

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
