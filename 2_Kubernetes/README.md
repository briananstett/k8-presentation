# 1. Kubernetes  <img src="./images/k8Logo.png" width=100 align="right">

[Kubernetes](https://kubernetes.io/) is a production grade container orchesteration system.

There are many ways to running Kubernetes. Self managed on your own servers (or cloud servers) or through a managed service from a cloud provider. At 24G, we use Google's managed kubernetes service, [GKE](https://cloud.google.com/kubernetes-engine/). 

[What is Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

---
#### Table of contents
* [Installation](#Installation)
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
```
$ kube get nodes
NAME                                                 STATUS    ROLES     AGE       VERSION
gke-internal-24g-cluster-high-memory-bdc98794-g23n   Ready     <none>    20d       v1.11.5-gke.5
gke-internal-24g-cluster-high-memory-bdc98794-gjh9   Ready     <none>    20d       v1.11.5-gke.5
gke-internal-24g-cluster-high-memory-d13e8c99-0scz   Ready     <none>    20d       v1.11.5-gke.5
```

## Pods
*To follow these examples, use section 1_Pods*
A [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) is smallest unit of compute in Kubernetes. Pods can encapsulate one or more containers. All containers within a Pod share the same storage resources, network and lifecycle. Like all objects in Kubernetes, we can define them through a *manifest* (yaml file). 


```
apiVersion: v1
kind: Pod
metadata:
  name: myfirstpod
  labels:
    name: myfirstpod
    environment: development
spec:
  containers:
  - name: webserver
    image: httpd
    ports:
      - containerPort: 80
  - name: spectator
    image: centos
    command: ['tail']
    args: ['-f', '/etc/hosts']
```

Let's create our first pod
```
If you didn't clone the repo
$ kubectl create -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/66e539947a51e645474a635cbf1603c209a591fc/2_Kubernetes/1_Pods/pod.yml

If you cloned the repo
$ kubectl create -f 1_Pods/pod.yml
```

We can see our pod running by using the [get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command.
```
$ kubectl get pods
NAME         READY     STATUS    RESTARTS   AGE
myfirstpod   2/2       Running   0          2m
```
We can see all of the details about our pod with the [describe](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command.
```
$ kubectl describe pod myfirstpod

Name:               myfirstpod
Namespace:          default
Priority:           0
PriorityClassName:  <none>
Node:               gke-internal-24g-cluster-high-memory-d13e8c99-0scz/10.128.0.5
Start Time:         Thu, 24 Jan 2019 09:34:57 -0500
Labels:             environment=development
                    name=myfirstpod
Annotations:        <none>
Status:             Running
IP:                 10.16.1.236
Containers:
  webserver:
    Container ID:   docker://2f7374113ff6dd123d771e5d8e86b93b32383290e7db9962300b5f501024f67c
    Image:          httpd
    Image ID:       docker-pullable://httpd@sha256:0a5f9902e916ea3eb873a3886e0dea4048c0fd229e168c9c1f198307085e6b18
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 24 Jan 2019 09:35:00 -0500
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-2w4g5 (ro)
  spectator:
    Container ID:  docker://9b70c501af326a18d0d01260f46e022d8e026d165e06226f3cfc585457de5716
    Image:         centos
    Image ID:      docker-pullable://centos@sha256:365fc7f33107869dfcf2b3ba220ce0aa42e16d3f8e8b3c21d72af1ee622f0cf0
    Port:          <none>
    Host Port:     <none>
    Command:
      tail
    Args:
      -f
      /etc/hosts
    State:          Running
      Started:      Thu, 24 Jan 2019 09:35:00 -0500
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-2w4g5 (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  default-token-2w4g5:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-2w4g5
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason     Age   From                                                         Message
  ----    ------     ----  ----                                                         -------
  Normal  Scheduled  5m    default-scheduler                                            Successfully assigned bowling-development/myfirstpod to gke-internal-24g-cluster-high-memory-d13e8c99-0scz
  Normal  Pulling    5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  pulling image "httpd"
  Normal  Pulled     5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  Successfully pulled image "httpd"
  Normal  Created    5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  Created container
  Normal  Started    5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  Started container
  Normal  Pulling    5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  pulling image "centos"
  Normal  Pulled     5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  Successfully pulled image "centos"
  Normal  Created    5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  Created container
  Normal  Started    5m    kubelet, gke-internal-24g-cluster-high-memory-d13e8c99-0scz  Started container
  ```
Notice the IP address of the pod, we'll need that for later.

We have two contianers running in our pod, one of them is a webserver but this pod isn't exposed to the internet yet so we need the other *spectator* container to view the web page. Let's get a shell in the spectator container

```
$ kubectl exec -it myfirstpod -c spectator /bin/bash
[root@myfirstpod /]#
```
Now let's grab the default webpage from httpd. Notice we can use the pod'
s IP or localhost as both container share the same network.
```
[root@myfirstpod /]# curl 10.16.1.236
<html><body><h1>It works!</h1></body></html>

[root@myfirstpod /]# curl localhost
<html><body><h1>It works!</h1></body></html>
```

---
## Services
*To follow these examples, please use section 2_Services*

Pods are mortal and can stop and start at any time resulting in different IP addresses. This can be a problem if there are other resources connecting to a pod via that IP address. Services [Services](https://kubernetes.io/docs/concepts/services-networking/service/)  offer an abstraction layer above pods that will forwards traffic to pods based on label selectors, not IP address.

There are [three main types of services](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)

1. ClusterIP: Exposes the service on a clluster-internal IP
2. NodePort: Exposes the service on each Node's IP at a static port
3. LoadBalancer: Exposes the service externally using a cloud provider's load balancer


Let's create a new httpd pod and expose it via a service
```
// If you didnt' clone the repo
<>

// if you did clone the repo
$ kubectl create -f 2_Services/podAndService.yml
pod "httpd-pod" created
service "httpd-service" created
```
We can see that our pod is running/getting created
```
$ kubectl get pods
NAME           READY     STATUS              RESTARTS   AGE
httpd-pod      0/1       ContainerCreating   0          3s
```
and our service's creation status
```
NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
httpd-service         LoadBalancer   10.19.252.85    35.226.239.84   80:32732/TCP     3m
```


If we navigate to the EXTERNAL-IP, we'll see our httpd default page. Would could also go to any one of our cluster's node's IP at port 32732 and get the same results.

---

## Deployments
[Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) maintain maintain a desired state of your pods (image, number of replicas, etc.)

