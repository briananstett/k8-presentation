# Kubernetes Commands Cheat Sheet

List all nodes in the cluster
```
kubectl get nodes
```

List all namespaces in the cluster
```
kubectl get namespaces
```

Change namespace
```
kube config set-context --current --namespace <namespace>
// OR
kubens <namespace>
```

List all pods
```
kubectl get pods
// All namespaces
kubectl get pod --all-namespaces
```

List all deployments
```
kubectl get deployments
// All namespaces
kubectl get deployments --all-namespaces
```

List all services
```
kubectl get services
// All namespaces
kubectl get services --all-namespaces
```

List all HPAs
```
kubectl get hpa
// All namespaces
kubectl get hpa --all-namespaces
```

Change the image of a pod/deployment
```
kubectl set image pod/<name of pod> <containername>=<new image name>
kubectl set image deployment/<name of deployment> <containername>=<new image name>
```

Scale a deployment
```
kubectl scale --replicas= 3 deployment <deployment name>
```

Get logs of a pod
```
kubectl logs <pod name>
```

Exec into a pod
```
kubectl exec -it <pod name> /bin/sh
```

[More commands](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)