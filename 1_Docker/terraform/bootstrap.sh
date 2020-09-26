#!/bin/bash
curl -fsSL https://raw.githubusercontent.com/briananstett/k8-presentation/master/1_Docker/terraform/main.tf \
  -o ~/docker-terraform/main.tf --create-dirs
cd ~/docker-terraform
terraform init
terraform apply -auto-approve
cd ~/