provider "google" {
  region      = "us-central1"
  zone        = "us-central1-c"
}

resource "google_compute_instance" "docker_instance" {
  name         = "docker-workshop"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"

  tags = ["docker-workshop"]

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
  }

  metadata_startup_script = "apt-get install unzip -y && curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs"

  service_account {
    scopes = ["userinfo-email", "compute-ro", "storage-ro"]
  }
}

resource "google_compute_firewall" "docker-allow-all" {
  name    = "docker-workshop-allow-all"
  network = "default"

  allow {
    protocol = "tcp"
  }

  // Allow traffic from everywhere to instances with an http-server tag
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["docker-workshop"]
}
