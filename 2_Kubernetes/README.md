# 1. Kubernetes 

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

Create a fierewall rule for your load balancer

1. Compute Engine > VM Instances
2. Select one of your instances
3. Search for a `network tag` and keep that for latter
4. Create a new firewall rule (VPC Networking -> Firewall Rules)
5. Set `Target tags` to the tag your copied before
6. Allow allow source IPs ranges of `130.211.0.0/22` and `35.191.0.0/16`

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

```
kind: Service
apiVersion: v1
metadata:
  name: httpd-service
spec:
  selector:
    name: httpd-pod
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

Let's create a new httpd pod and expose it via a service
```
// If you didnt' clone the repo
$ kubectl create -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/546d70c0cd106d61297ece2a809b98e2f4b3618a/2_Kubernetes/2_Services/podAndService.yml

// If you did clone the repo
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

Lets create our deployment and service.
```
// If you didn't clone the repo
$ kubectl create -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/a9ef1116888b259f5aec0ba490ed3b882eca4e29/2_Kubernetes/3_Deployments/podDeploymentService.yml

// If you did clone the repo
$ kubectl create -f 3_Deployments/podDeploymentService.yml
deployment.extensions "httpd-deployment" created
service "httpd-service" created
```

We can see our deployment has build by
```
$ kubectl get deployments
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
httpd-deployment         3         3         3            3           5m
```

and pods

```
$ kubectl get pods
NAME                                      READY     STATUS    RESTARTS   AGE
httpd-deployment-6754855469-6x5lb         1/1       Running   0          6m
httpd-deployment-6754855469-g64df         1/1       Running   0          6m
httpd-deployment-6754855469-xsnpn         1/1       Running   0          6m
```
and our service
```
$ kubectl get services
NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
httpd-service         LoadBalancer   10.19.246.10    35.226.239.84   80:31694/TCP     6m
```

If we where to "accidently" delete one of our pods, our deployment would notice the state has changed quickly create a new pod for us.
```
$ kubectl delete pod httpd-deployment-6754855469-6x5lb
pod "httpd-deployment-6754855469-6x5lb" deleted

$ NAME                                      READY     STATUS              RESTARTS   AGE
httpd-deployment-6754855469-6x5lb         0/1       Terminating         0          8m
httpd-deployment-6754855469-dsmtz         0/1       ContainerCreating   0          2s
httpd-deployment-6754855469-g64df         1/1       Running             0          8m
httpd-deployment-6754855469-xsnpn         1/1       Running             0          8m
```

We change edit the state of our deployment with the [edit](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#edit) command.

```
$ kube edit deployment httpd-deployment
// Will open up your editor. Go to lines with * on it

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
  creationTimestamp: 2019-01-24T15:44:37Z
  generation: 1
  labels:
*   environmnet: development // change this to production
    name: httpd-deployment
  name: httpd-deployment
  namespace: bowling-development
  resourceVersion: "40751785"
  selfLink: /apis/extensions/v1beta1/namespaces/bowling-development/deployments/httpd-deployment
  uid: f4654cff-1fee-11e9-9b10-42010a80016f
spec:
  progressDeadlineSeconds: 600
* replicas: 10
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      name: httpd-pod
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        environment: development
        name: httpd-pod
      name: httpd-pod
    spec:
      containers:
     - image: nginx
        imagePullPolicy: Always
        name: httpd-container
        ports:
        - containerPort: 80
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
```

We can see the state of our deployment start to change

```
$ kubectl get pods
NAME                                      READY     STATUS              RESTARTS   AGE
httpd-deployment-6754855469-dsmtz         1/1       Running             0          14m
httpd-deployment-6754855469-g64df         1/1       Running             0          23m
httpd-deployment-6754855469-lknql         0/1       ContainerCreating   0          3s
httpd-deployment-6754855469-n9hjq         0/1       ContainerCreating   0          3s
httpd-deployment-6754855469-xsnpn         1/1       Running             0          23m
httpd-deployment-6bfb858dd5-g66vj         0/1       ContainerCreating   0          3s
```

Let's deploy a new image. We can do this by, again, using the *edit* command

```
$ kubectl edit deployment httpd-deployment
// Edit the lines with *

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "3"
  creationTimestamp: 2019-01-24T15:44:37Z
  generation: 3
  labels:
    environmnet: production
    name: httpd-deployment
  name: httpd-deployment
  namespace: bowling-development
  resourceVersion: "40755675"
  selfLink: /apis/extensions/v1beta1/namespaces/bowling-development/deployments/httpd-deployment
  uid: f4654cff-1fee-11e9-9b10-42010a80016f
spec:
  progressDeadlineSeconds: 600
  replicas: 5
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      name: httpd-pod
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        environment: development
        name: httpd-pod
      name: httpd-pod
    spec:
      containers:
      - image: nginx
        imagePullPolicy: Always
        name: httpd-container
        ports:
        - containerPort: 80
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
```

and watch as the deployment gradually rolls out the new image, never completely taking our  deployment down. This is called *rolling update*.

```
$ kubectl get pods --watch
NAME                                      READY     STATUS              RESTARTS   AGE
httpd-deployment-6754855469-7zbl2         1/1       Terminating         0          3m
httpd-deployment-6754855469-bpv64         1/1       Running             0          3m
httpd-deployment-6754855469-hrp29         1/1       Running             0          3m
httpd-deployment-6754855469-kw4b2         1/1       Running             0          3m
httpd-deployment-6754855469-xc7hp         1/1       Running             0          3m
httpd-deployment-6bfb858dd5-2dd7k         0/1       ContainerCreating   0          1s
httpd-deployment-6bfb858dd5-ljh5h         1/1       Running             0          4s

...
```

---
## Horizontal Pod Autoscaler

[Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) automatically scales the number of pods in a replication controller, deployment or replica set based on observed CPU utilization (or, with beta support, on some other, application-provided metrics).

We can specify which resource to watch, min/max replicas, and our target average utilization.

```
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  labels:
    name: apache-hpa
  name: apache-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: apache-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 50
```

Create our deployment, service, and HPA by

```
// If you didn't clone the repo
<>

// If you cloned the repo
$ kubectl create -f 4_AutoScaling/deploymentServiceHPA.yml
```

We can see the status of our HPA by

```
$ kubectl get hpa
NAME         REFERENCE                      TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
apache-hpa   Deployment/apache-deployment   0%/50%    2         10        2          18m

```

Get the external IP for this example

```
$ kubectl get services
NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
apache-service        LoadBalancer   10.19.246.107   35.226.239.84   80:30823/TCP     16m
```

Now let's start to send some traffic its way. In a seperate shell run the following command.

```
$ while true; do curl 35.226.239.84; done
```

After about a minute, we see the hpa reporting higher CPU utilization and begin to scale the deployment for us.

```
$ kubectl get hpa
NAME         REFERENCE                      TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
apache-hpa   Deployment/apache-deployment   107%/50%   2         10        3         13m

$kubectl get pods
NAME                                      READY     STATUS    RESTARTS   AGE
apache-deployment-79769b55c5-jxb4n        1/1       Running   0          14m
apache-deployment-79769b55c5-t5cgk        1/1       Running   0          14m
apache-deployment-79769b55c5-x6ccl        1/1       Running   0          42s
```

