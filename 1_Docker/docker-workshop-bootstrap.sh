#!/bin/bash
# This bash script is meant to be called from INSIDE the GCP instance for the Docker workshop
sudo usermod -aG docker $USER
sudo su $USER --login
curl -fsSL https://github.com/briananstett/k8-presentation/archive/master.zip -o workshop.zip
unzip workshop.zip
rm workshop.zip