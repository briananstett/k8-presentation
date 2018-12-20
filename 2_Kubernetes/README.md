# 1. Kubernetes  <img src="./images/k8Logo.png" width=100 align="right">

[Kubernetes](https://kubernetes.io/) is a production grade container orchesteration system.

There are many ways to running Kubernetes. Self managed on your own servers (or cloud servers) or through a managed service from a cloud provider. At 24G, we use Google's managed kubernetes service, [GKE](https://cloud.google.com/kubernetes-engine/). 

[What is Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

---
#### Table of contents
* Installation
----
## Installation
Developers at 24G will not create the actual Kubernetes clusters but will still need to install and configure Kubernete's management tool, [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/). [Reference Docs](https://cloud.google.com/kubernetes-engine/docs/quickstart).

Developers can get access to kubectl either through the GCP console or locally on their machine.

1. [GCP's console](https://console.cloud.google.com/) > Cloud Shell 
2. Install locally
    1. [Install the GCP SDK](https://cloud.google.com/sdk/docs/quickstarts)
    2. After installing the GCP SDK, install the `kubectl`
    ```
    gcloud components install kubectl
    ```
    3. Retrieve authentication credentials to interact with the cluster.
    ```
    gcloud container clusters get-credentials <cluster_name>
    ```
