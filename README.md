# 24G Container Workshop
In the era of cloud and cluster computing, [Containers](https://www.docker.com/resources/what-container) have become the standard unit of compute. All major Cloud providers offer some sort of managed container service, not to mention all the services that use containers underneath the hood (App Engine, GCE, etc.). The consistent environment, "run anywhere", context isolation characteristics of containers make them a perfect choice for [Cloud Native](https://pivotal.io/cloud-native) applications. Containers have also fueled to the CI/CD fire, [allowing enterprises to safely iterate](https://cloud.google.com/kubernetes-engine/kubernetes-comic/) their prodcution software at extreme high velocity. 


## Kubernetes at 24G
* We have been running Kubernetes in production for over a year now. We have multiple clusters on multiple clouds and on average have between 200 and 300 containers running at any given momment. 
* We have CI/CD pipelines that automatically create new Docker images and deploy them to correct cluster. Kubernetes then performs a [Rolling Update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) to safely delete old instances of the code, replacing them with the new. Kubernetes performs constent health checks and will rollback the previous version if there are issues.
* We've implemented multiple [operators](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) on top of Kubernetes that automate tasks such as [SSL certification registrion](https://github.com/jetstack/cert-manager) and the creation of [DNS entries](https://github.com/helm/charts/tree/master/stable/external-dns).

## Next workshop
* Mon May 20, 2019 12:30pm - 2pm (EDT) - Thunderbird 2

## Table of Contents
1. [Prerequisites](#prerequisites)
1. [Slides](#slides)
1. [Docker](./1_Docker/README.md)
1. [Kubernetes](./2_Kubernetes/README.md)


## Prerequisites
---

### Install and config GCP's CLI SDK. 
*If you don't have `gcloud` installed on your machine*
1. [Linux, Windows, Mac installation docs](https://cloud.google.com/sdk/docs/quickstarts)

1. Init

```
$ gcloud init
```
3. Authenticate `gcloud`

```
To continue, you must log in. Would you like to log in (Y/n)? Y
```
4. (Optinal) if at any time you are prompted to specify a default region, use `us-central1-a`

5. Select your project. Please use project `g-1575-k8-workshop` 
```
Pick cloud project to use: 
[1] analog-button-209715
[2] analog-memento-238217
Please enter numeric choice
```

*If you already have `gcloud` installed on your machine*
1. Init
```
$ gcloud init
```
2. (Optinal) if at any time you are prompted to specify a default region, use `us-central1-a`
3. Add a new configuration
```
Pick configuration to use:
[1] Re-initialize this configuration [default] with new settings 
[2] Create a new configuration
Please enter your numeric choice:  
```
4. Enter a name of the new configuration
```
Enter configuration name. Names start with a lower case letter and 
contain only lower case letters a-z, digits 0-9, and hyphens '-':
```
5. Select your project. Please use project `g-1575-k8-workshop` 
```
Choose the account you would like to use to perform operations for 
this configuration:
[1] 477597344109-compute@developer.gserviceaccount.com
[2] brian.anstett@24g.com
[3] Log in with a new account
Please enter your numeric choice:  
```

### Install Docker
1. [Linux](https://docs.docker.com/install/linux/docker-ce/centos/)
1. [Mac](https://docs.docker.com/docker-for-mac/install/)
1. [Windows](https://docs.docker.com/docker-for-windows/install/)
1. Confirm Docker is working on your machine
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
#### Docker Trouble Shooting
* Is the Docker Daemon running?
  * Linux
      ```
      $ systemctl start docker
      ```
  * Windows
    * Launch `Docker Desktop`

### Setup Authentication to Google Container Registry
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
1. Install `kubectl`
    1. [Linux Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
    1. [Mac Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos)
    1. [Windows Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)

1. Configure `kubectl`
  1. List the Kubernetes clusters in your project
```
gcloud container clusters list
NAME              LOCATION       MASTER_VERSION  MASTER_IP      MACHINE_TYPE   NODE_VERSION   NUM_NODES  STATUS
gke-24g-workshop  us-central1-a  1.12.7-gke.10   35.184.96.245  n1-standard-4  1.12.7-gke.10  2          RUNNING
```
    1. Get your token and certificate authority for your user
```
gcloud container clusters get-credentials gke-24g-workshop
```

    1. confirm set up was
```
kubectl get nodes
NAME                                              STATUS   ROLES    AGE     VERSION
gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp   Ready    <none>   3m41s   v1.12.7-gke.10
gke-gke-24g-workshop-default-pool-a4b67bed-zxhb   Ready    <none>   3m37s   v1.12.7-gke.10
```
## Slides
* Feel free to follow along with [the slides](https://docs.google.com/presentation/d/1OQYcl3PwPM9NJ3AbExLV9A8AWbCEzbxj0VceIOhPnyY/edit#slide=id.p).