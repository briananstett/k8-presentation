# 24G Container Workshop
In the era of cloud and cluster computing, [Containers](https://www.docker.com/resources/what-container) have become the standard unit of compute. All major Cloud providers offer some sort of managed container service, not to mention all the services that use containers underneath the hood (App Engine, GCE, etc.). The consistent environment, "run anywhere", context isolation characteristics of containers make them a perfect choice for [Cloud Native](https://pivotal.io/cloud-native) applications. Containers have also fueled the CI/CD fire, [allowing enterprises to safely iterate](https://cloud.google.com/kubernetes-engine/kubernetes-comic/) their production software at extremely high velocity. 

--- 
## Kubernetes at 24G
* We have been running Kubernetes in production for over a year now. We have multiple clusters on multiple clouds and on average have between 200 and 300 containers running at any given moment. 
* We have CI/CD pipelines that automatically create new Docker images and deploy them to the correct cluster. Kubernetes then performs a [Rolling Update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) to safely delete old instances of the code, replacing them with the new. Kubernetes performs constant health checks and will rollback to the previous version if there are issues. This all done while guaranteeing high availability (no down time). 
* We've implemented multiple [operators](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) on top of Kubernetes that automate tasks such as [SSL certification registration](https://github.com/jetstack/cert-manager) and the creation of [DNS entries](https://github.com/helm/charts/tree/master/stable/external-dns).

--- 
## Next workshop
* Wed May 22, 2019 12:00pm - 1:30pm (EDT) - Thunderbird 3

---
## Table of Contents
1. [Prerequisites](#prerequisites)
1. [Slides](#slides)
1. [Docker](./1_Docker/README.md)
1. [Kubernetes](./2_Kubernetes/README.md)


## Prerequisites
---

### Install and config GCP's CLI SDK. 
#### If you don't have `gcloud` installed on your machine

[Linux, Windows, Mac installation documentation](https://cloud.google.com/sdk/docs/quickstarts)

Initialize the client
```
$ gcloud init
```

```
To continue, you must log in. Would you like to log in (Y/n)? Y
```
(Optinal) if at any time you are prompted to specify a default region, use `us-central1-a`

Select your project. Please use project `g-1575-k8-workshop` 
```
Pick cloud project to use: 
[1] project-1
[2] project-2
Please enter numeric choice
```

#### If you already have `gcloud` installed on your machine
Initialize the client
```
$ gcloud init
```
(Optinal) if at any time you are prompted to specify a default region, use `us-central1-a`
Add a new configuration
```
Pick configuration to use:
[1] Re-initialize this configuration [default] with new settings 
[2] Create a new configuration
Please enter your numeric choice:  
```
Enter a name of the new configuration
```
Enter configuration name. Names start with a lower case letter and 
contain only lower case letters a-z, digits 0-9, and hyphens '-':
```
Select your project. Please use project `g-1575-k8-workshop` 
```
Choose the account you would like to use to perform operations for 
this configuration:
[1] 477597344109-compute@developer.gserviceaccount.com
[2] john.smith@24g.com
[3] Log in with a new account
Please enter your numeric choice:  
```

### Install Docker
* [Linux](https://docs.docker.com/install/linux/docker-ce/centos/)
    * You may need to add the `docker` group to your user in order to interact with the `/var/run/docker.sock` file. 
* [Mac](https://docs.docker.com/docker-for-mac/install/)
* [Windows](https://docs.docker.com/docker-for-windows/install/)

Confirm Docker is working on your machine
```
$ docker version
  Client:
  Version:           18.09.1
  API version:       1.39
  Go version:        go1.10.6
  Git commit:        4c52b90
  Built:             Wed Jan  9 19:35:31 2019
  OS/Arch:           linux/amd64
  Experimental:      false

  Server: Docker Engine - Community
  Engine:
    Version:          18.09.1
    API version:      1.39 (minimum version 1.12)
    Go version:       go1.10.6
    Git commit:       4c52b90
    Built:            Wed Jan  9 19:02:44 2019
    OS/Arch:          linux/amd64
    Experimental:     false
```

### Setup Authentication to Google Container Registry
Add a Docker credential helper
```
$ gcloud auth configure-docker

gcloud's Docker credential helper can be configured but it will not work until this is corrected.
The following settings will be added to your Docker config file 
located at [/root/.docker/config.json]:
{
  "credHelpers": {
    "gcr.io": "gcloud", 
    "us.gcr.io": "gcloud", 
    "eu.gcr.io": "gcloud", 
    "asia.gcr.io": "gcloud", 
    "staging-k8s.gcr.io": "gcloud", 
    "marketplace.gcr.io": "gcloud"
  }
}

Do you want to continue (Y/n)?  
```

### Set up `kubectl`
#### Install `kubectl`
* [Linux Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
* [Mac Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos)
* [Windows Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)

#### Configure `kubectl`

List the Kubernetes clusters in your project
```
gcloud container clusters list
NAME              LOCATION       MASTER_VERSION  MASTER_IP      MACHINE_TYPE   NODE_VERSION   NUM_NODES  STATUS
gke-24g-workshop  us-central1-a  1.12.7-gke.10   35.184.96.245  n1-standard-4  1.12.7-gke.10  2          RUNNING
```
Get your token and certificate authority for your user
```
gcloud container clusters get-credentials gke-24g-workshop --region us-central1-a
```

confirm set up was successful
```
kubectl get nodes
NAME                                              STATUS   ROLES    AGE     VERSION
gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp   Ready    <none>   3m41s   v1.12.7-gke.10
gke-gke-24g-workshop-default-pool-a4b67bed-zxhb   Ready    <none>   3m37s   v1.12.7-gke.10
```

### Install Node.js
* [Linux installation](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages)
* [Mac installation](https://nodejs.org/en/download/)
* [Windows installation](https://nodejs.org/en/download/)

## Slides
* Feel free to follow along with the [slides](https://docs.google.com/presentation/d/1OQYcl3PwPM9NJ3AbExLV9A8AWbCEzbxj0VceIOhPnyY/edit#slide=id.p).