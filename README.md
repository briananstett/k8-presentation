# 24G Container Workshop
In the era of cloud and cluster computing, [Containers](https://www.docker.com/resources/what-container) have become the standard unit of compute. All major Cloud providers offer some sort of managed container service, not to mention all the services that use containers underneath the hood (App Engine, GCE, etc.). The consistent environment, "run anywhere", context isolation characteristics of containers make them a perfect choice for [Cloud Native](https://pivotal.io/cloud-native) applications. Containers have also fueled the CI/CD fire, [allowing enterprises to safely iterate](https://cloud.google.com/kubernetes-engine/kubernetes-comic/) their production software at extremely high velocity. 

--- 
## Kubernetes at 24G
* We have been running Kubernetes in production for almost two years now. We have multiple clusters on multiple clouds and on average have between 300 and 400 containers running at any given moment. 
* We have CI/CD pipelines that automatically create new Docker images and deploy them to the correct cluster. Kubernetes then performs a [Rolling Update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) to safely delete old instances of the code, replacing them with the new. Kubernetes performs constant health checks and will rollback to the previous version if there are issues. This all done while guaranteeing high availability (no down time). 
* We've implemented multiple [operators](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) on top of Kubernetes that automate tasks such as [SSL certification registration](https://github.com/jetstack/cert-manager) and the creation of [DNS entries](https://github.com/helm/charts/tree/master/stable/external-dns).

--- 
## Next workshop
* Tues March 3, 2020 3:00pm (EDT) - Oakland University

---
## Table of Contents
1. [Prerequisites](#prerequisites)
1. [Slides](#slides)
1. [Docker](./1_Docker/README.md)
1. [Kubernetes](./2_Kubernetes/README.md)


## Prerequisites
---
### Setup for the Docker workshop
In order to complete the Docker workshop you will need Docker and Nodejs installed. You can install these things manually or if you have a [GCP](http://cloud.google.com/) account, you can run the following command in the GCP Cloud Shell to provision 

* cloud.google.com > sign into your account > open your "Cloud Shell" by clicking the "Activate Cloud Shell" button in the upper right of the console. > RUn the following command.
![](https://cloud.google.com/shell/docs/images/start-cloud-shell-session.gif)

```bash
 curl -fsSL https://raw.githubusercontent.com/briananstett/k8-presentation/master/1_Docker/terraform/main.tf -o ~/docker-workshop/main.tf \
  && terraform apply -auto-approve ~/k8-workshop

```
This command will create a Compute Engine instance and a firewall rule opening the VM to the internet. If you navigate to the Compute Engine console, you should see your newly created instance. SSH into the instance using the "SSH" button. Once inside the instance, run the following command to finish setup.

```bash
sudo usermod -aG docker $USER
sudo su $USER --login
curl -fsSL https://github.com/briananstett/k8-presentation/archive/master.zip -o workshop.zip \
 && unzip workshop.zip  
```

### Setup for the Kubernetes workshop
In order to complete the Kubernetes workshop you will need a Kubernetes cluster. If you already have access to a cluster feel free to use it. If not, the following instructions will help you setup a cluster on GCP. Run the following command in the GCP Cloud Shell of your project. Not it will take a few minutes to provision your cluster.

```bash
curl -fsSL https://raw.githubusercontent.com/briananstett/k8-presentation/master/1_Kubernetes/terraform/main.tf -o ~/k8-workshop/main.tf \
  && terraform apply -auto-approve ~/k8-workshop \
  gcloud container clusters get-credentials workshop-cluster --region us-central1-a \
  alias kube=kubectl
```



## Slides
* Feel free to follow along with the [slides](https://docs.google.com/presentation/d/1OQYcl3PwPM9NJ3AbExLV9A8AWbCEzbxj0VceIOhPnyY/edit#slide=id.p).
