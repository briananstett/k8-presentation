# 1. Kubernetes 

[Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/) is a production grade container orchesteration system. 

There are many ways to running Kubernetes. Self managed on your "on-prem" servers (or cloud servers) or through a managed service from a cloud provider. At 24G, we use Google's and AWS's managed kubernetes service, [GKE](https://cloud.google.com/kubernetes-engine/), [EKS](https://aws.amazon.com/eks/) respectively. 

---
#### Table of contents
* [Prerequisites](../README.md)
* [pods](#Pods)
* [service](#Services)
* [deployment](#Deployments)
* [hpa](#Horizontal-Pod-Autoscaler)
----
*This section of the workshop uses the `2_Kubernetes` sub-directory.*

Please create and use your own `namespace` so not to effect other people's workshop.

```
2_Kubernetes$ kubectl create namespace <name>
2_Kubernetes$ kubectl config set-context --current --namespace <your namespace>
```

## Pods
*To follow these examples, use section 1_Pods*

A [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) is the smallest unit of compute in Kubernetes. Pods can encapsulate one or more containers. All containers within a Pod share the same storage resources, network and lifecycle. Like all objects in Kubernetes, we can define them through a *manifest* (yaml file). 


```
apiVersion: v1
kind: Pod
metadata:
  name: jeff-manual-pod
  labels:
    name: jeff-manual-pod
    environment: development
spec:
  containers:
  - name: jeff-manual-container
    image: us.gcr.io/g-1575-k8-workshop/jeff
    ports:
      - containerPort: 80
    resources:
      limits:
        cpu: 64m
        memory: 64Mi
      requests:
        cpu: 32m
        memory: 32Mi
```

Let's create our first pod
```
If you didn't clone the repo
2_Kubernetes/1_Pods$ kubectl apply -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/66e539947a51e645474a635cbf1603c209a591fc/2_Kubernetes/1_Pods/pod.yml

If you cloned the repo
2_Kubernetes/1_Pods$ kubectl apply -f pod.yml
```

We can see our pod running by using the [get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command.
```
2_Kubernetes/1_Pods$ kubectl get pods
NAME              READY     STATUS    RESTARTS   AGE
jeff-manual-pod   2/2       Running   0          2m
```
We can see all of the details about our pod with the [describe](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command.

```
2_Kubernetes/1_Pods$ kubectl describe pod jeff-manual-pod

Name:               jeff-manual-pod
Namespace:          default
Priority:           0
PriorityClassName:  <none>
Node:               gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp/10.128.0.3
Start Time:         Tue, 21 May 2019 17:57:40 -0400
Labels:             environment=development
                    name=jeff-manual-pod
Annotations:        <none>
Status:             Running
IP:                 10.8.1.8
Containers:
  jeff-manual-container:
    Container ID:   docker://f6d6144409830834e473dcf83f1f3724c3f98a0fde7ffc777a82f763aef6e179
    Image:          us.gcr.io/g-1575-k8-workshop/jeff
    Image ID:       docker-pullable://us.gcr.io/g-1575-k8-workshop/jeff@sha256:c4474b556510566746e2cd790e8b84e5186c525436e4203dc1b819ee821a778d
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Tue, 21 May 2019 17:57:54 -0400
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     64m
      memory:  64Mi
    Requests:
      cpu:        32m
      memory:     32Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-ttt4f (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  default-token-ttt4f:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-ttt4f
    Optional:    false
QoS Class:       Burstable
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason     Age   From                                                      Message
  ----    ------     ----  ----                                                      -------
  Normal  Scheduled  31s   default-scheduler                                         Successfully assigned default/jeff-manual-pod to gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp
  Normal  Pulling    30s   kubelet, gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp  pulling image "us.gcr.io/g-1575-k8-workshop/jeff"
  Normal  Pulled     21s   kubelet, gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp  Successfully pulled image "us.gcr.io/g-1575-k8-workshop/jeff"
  Normal  Created    18s   kubelet, gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp  Created container
  Normal  Started    17s   kubelet, gke-gke-24g-workshop-default-pool-2d9d42c6-1vxp  Started container
```
Notice the IP address of the pod, we'll need that for later.

We have one contianers running in our pod, a single webserver dishing our Jeff application. The pod is given an IP address from the cluster's internal network therefore We are currently unable to access this pod over the internet. If we create another Pod in the cluster and attach to it, we will be able to reach our Jeff pod.

```
2_Kubernetes/1_Pods$ kubectl run -it --image=centos --restart=Never deleteme /bin/bash
[root@deleteme /]#
```
Now let's curl the Jeff Pod. Notice we can use the pod's IP as both container share the same network.
```
[root@myfirstpod /]# curl 10.8.1.8
```

*We could have also create tunnel from our local machines to the Pod with [port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) but creating a new pod illustrates how be default, all pods are on the same network and can talk to eachother.*

*Clean up from this exercise.*
```
If you didn't clone the repo
2_Kubernetes/1_Pods$ kubectl delete -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/66e539947a51e645474a635cbf1603c209a591fc/2_Kubernetes/1_Pods/pod.yml

If you cloned the repo
2_Kubernetes/1_Pods$ kubectl delete -f pod.yml
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
  name: jeff-service
spec:
  selector:
    name: jeff-pod
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

Let's create a new Jeff pod and expose it via a service
```
// If you didnt' clone the repo
$ kubectl apply -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/546d70c0cd106d61297ece2a809b98e2f4b3618a/2_Kubernetes/2_Services/podAndService.yml

// If you did clone the repo
2_Kubernetes/2_Services$ kubectl apply -f podAndService.yml
pod/jeff-pod created
service/jeff-service created
```
We can see that our pod is running/getting created
```
2_Kubernetes/2_Services$ kubectl get pods
NAME           READY     STATUS              RESTARTS   AGE
jeff-pod       0/1       ContainerCreating   0          3s
```
and our service's creation status
```
2_Kubernetes/2_Services$ kubectl get services
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
jeff-service    LoadBalancer   10.72.14.186    35.202.238.249   80:30098/TCP     2m24s

```

If we navigate to the EXTERNAL-IP, we'll see our Jeff application's home page. Would could also go to any one of our cluster's node's IP at port 30098 and get the same results.


*Clean up from this exercise.*
```
2_Kubernetes/2_Services$ kubectl delete -f podAndService.yml
```
---

## Deployments
*To follow these examples, please use section 3_Deployments*
[Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) maintain maintain a desired state of your pods (image, number of replicas, etc.)

Lets create our deployment and service.
```
// If you didn't clone the repo
$ kubectl apply -f https://bitbucket.org/briananstett/k8-24g-workshop/raw/a9ef1116888b259f5aec0ba490ed3b882eca4e29/2_Kubernetes/3_Deployments/podDeploymentService.yml

// If you did clone the repo
2_Kubernetes/3_Deployments$ kubectl apply -f 3_Deployments/podDeploymentService.yml
deployment.extensions/jeff-deployment created
service/jeff-service created
```

We can see our deployment by running
```
2_Kubernetes/3_Deployments$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
jeff-deployment    1         1         1            1           5m
```

and pods

```
2_Kubernetes/3_Deployments$ kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
jeff-deployment-f94c77886-8sg2r   1/1     Running   0          40s
```
and our service
```
2_Kubernetes/3_Deployments$ kubectl get services
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
jeff-service    LoadBalancer   10.19.246.10    35.226.239.84   80:31694/TCP     6m
```

If we where to "accidently" delete one of our pods, our deployment would notice the state has changed quickly create a new pod for us.
```
2_Kubernetes/3_Deployments$ kubectl delete pod httpd-deployment-6754855469-6x5lb
pod "jeff-deployment-f94c77886-8sg2r" deleted

NAME                                READY     STATUS        RESTARTS   AGE
jeff-deployment-f94c77886-8sg2r     0/1       Terminating   0          3m5s
jeff-deployment-f94c77886-fsfcs     1/1       Running       0          14s
```

We change edit the state of our deployment with the [edit](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#edit) command.

Let's manually scale our application by adding more replicas

```
2_Kubernetes/3_Deployments$ kubectl edit deployment jeff-deployment
// Will open up your editor. Go to lines with * on it

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
  creationTimestamp: "2019-05-21T22:23:34Z"
  generation: 2
  labels:
    environmnet: development
    name: jeff-deployment
  name: jeff-deployment
  namespace: default
  resourceVersion: "1404184"
  selfLink: /apis/extensions/v1beta1/namespaces/default/deployments/jeff-deployment
  uid: 1209410d-7c17-11e9-ba40-42010a80000b
spec:
  progressDeadlineSeconds: 2147483647
* replicas: 10 // changed from 1 to 5
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      name: jeff-pod
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
        name: jeff-pod
      name: jeff-pod
    spec:
      containers:
      - image: us.gcr.io/g-1575-k8-workshop/jeff
        imagePullPolicy: Always
        name: jeff-container
        ports:
        - containerPort: 80
          protocol: TCP
        resources:
          limits:
            cpu: 64m
            memory: 64Mi
          requests:
            cpu: 32m
            memory: 32Mi
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
```

We can see the state of our deployment startchange

```
2_Kubernetes/3_Deployments$ kubectl get pods
NAME                                      READY     STATUS              RESTARTS   AGE
jeff-deployment-6754855469-dsmtz         1/1       Running             0          14m
jeff-deployment-6754855469-g64df         1/1       Running             0          23m
jeff-deployment-6754855469-lknql         0/1       ContainerCreating   0          3s
jeff-deployment-6754855469-n9hjq         0/1       ContainerCreating   0          3s
jeff-deployment-6754855469-xsnpn         1/1       Running             0          23m
jeff-deployment-6bfb858dd5-g66vj         0/1       ContainerCreating   0          3s
```

Let's deploy a new image. We can do this by, again, using the *edit* command

```
2_Kubernetes/3_Deployments$ kubectl edit deployment jeff-deployment
// Edit the lines with *

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
  creationTimestamp: "2019-05-21T22:23:34Z"
  generation: 2
  labels:
    environmnet: development
    name: jeff-deployment
  name: jeff-deployment
  namespace: default
  resourceVersion: "1404184"
  selfLink: /apis/extensions/v1beta1/namespaces/default/deployments/jeff-deployment
  uid: 1209410d-7c17-11e9-ba40-42010a80000b
spec:
  progressDeadlineSeconds: 2147483647
  replicas: 5
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      name: jeff-pod
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
        name: jeff-pod
      name: jeff-pod
    spec:
      containers:
*     - image: us.gcr.io/g-1575-k8-workshop/jeff:tomato
        imagePullPolicy: Always
        name: jeff-container
        ports:
        - containerPort: 80
          protocol: TCP
        resources:
          limits:
            cpu: 64m
            memory: 64Mi
          requests:
            cpu: 32m
            memory: 32Mi
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
```

and watch as the deployment gradually rolls out the new image, never completely taking our deployment down. This is called *rolling update*.

```
2_Kubernetes/3_Deployments$ kubectl get pods --watch
NAME                                      READY     STATUS              RESTARTS   AGE
jeff-deployment-6754855469-7zbl2         1/1       Terminating         0          3m
jeff-deployment-6754855469-bpv64         1/1       Running             0          3m
jeff-deployment-6754855469-hrp29         1/1       Running             0          3m
jeff-deployment-6754855469-kw4b2         1/1       Running             0          3m
jeff-deployment-6754855469-xc7hp         1/1       Running             0          3m
jeff-deployment-6bfb858dd5-2dd7k         0/1       ContainerCreating   0          1s
jeff-deployment-6bfb858dd5-ljh5h         1/1       Running             0          4s
```

Like any time you introduce new code into your environment, there are situations in which you might want to *rollback* to a previous state in your application. We can use the [rollout](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment) command to undo our latest revision.

```
2_Kubernetes/3_Deployments$ rollout undo deployment jeff-deployment
NAME                              READY   STATUS        RESTARTS   AGE
jeff-deployment-56dd76b96-cq4vb   1/1     Terminating   0          20m
jeff-deployment-f94c77886-jjj9w   1/1     Running       0          4s
jeff-deployment-56dd76b96-cq4vc   1/1     Terminating   0          20m
jeff-deployment-56dd76b96-cq4ve   1/1     Terminating   0          20m
jeff-deployment-f94c77886-jjj97   1/1     Running       0          4s
jeff-deployment-f94c77886-jjj90   1/1     Running       0          4s
```

---
## Horizontal Pod Autoscaler
*To follow these examples, please use section 4_AutoScaling*

[Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) automatically scales the number of pods in a replication controller, deployment or replica set based on observed CPU utilization (or, with beta support, on some other, application-provided metrics).

We can specify which resource to watch, min/max replicas, and our target average utilization.

```
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  labels:
    name: jeff-hpa
  name: jeff-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: jeff-deployment
  minReplicas: 1
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 5
```

Create our deployment, service, and HPA by

```
// If you didn't clone the repo
2_Kubernetes/4_AutoScaling$ kubectl apply -f https://bitbucket.org/briananstett/k8-24g-workshop/src/master/2_Kubernetes/4_AutoScaling/deploymentServiceHPA.yml

// If you cloned the repo
2_Kubernetes/4_AutoScaling$ kubectl apply -f 4_AutoScaling/deploymentServiceHPA.yml
```

We can see the status of our HPA by running

```
2_Kubernetes/4_AutoScaling$ kubectl get hpa
NAME       REFERENCE                    TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
jeff-hpa   Deployment/jeff-deployment   3%/50%    1         8         2          2m5s
```

Grab our service's external IP again

```
2_Kubernetes/4_AutoScaling$ kubectl get services
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
jeff-service    LoadBalancer   10.19.246.107   35.226.239.84   80:30823/TCP     16m
```

Now let's try to simulate high traffic by navigating to the `/scale.php` script on out site. This script performs a semi intensive computing and should raise the CPU consumption of the pod. In a seperate shell run the following command.

```
$ while true; do curl http://35.226.239.84/scale.php; done
```

After about a minute, we see the hpa reporting higher CPU utilization and begin to scale the deployment for us.

```
2_Kubernetes/4_AutoScaling$ kubectl get hpa
NAME       REFERENCE                      TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
jeff-hpa   Deployment/jeff-deployment     107%/50%   2         10        4         13m

$kubectl get pods
NAME                                      READY     STATUS    RESTARTS   AGE
jeff-deployment-79769b55c5-jxb4n        1/1       Running   0          14m
jeff-deployment-79769b55c5-t5cgk        1/1       Running   0          14m
jeff-deployment-79769b55c5-x6ccl        1/1       Running   0          42s
jeff-deployment-79769b55c5-au34g        1/1       Running   0          42s
```

## Cleaning up
If you are all done with the workshop, please delete your namespace. This will subsequently delete all resources inside the namespace.

```
$ kubectl delete namespace <your namespace you created>
```
