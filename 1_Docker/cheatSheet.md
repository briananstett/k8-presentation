# Docker Commands Cheat Sheet

Build an image from a `Dockerfile`
```Bash
docker build -t myimage:v1 .
```

Show Docker image on our host.
```bash
docker images
```

Delete a image
```bash
docker rmi <image name or id>
```

Run a container in the foreground.
```bash
docker run -it  myimage:v1
```

Run a container in `detached` mode.
```bash
docker run -d myimage:v1
```

Run a container and map a host port to a container port
```bash
docker run -d -p 80:3000 myimage:v1
```

Show running containers.
```bash
docker ps
```

Show all containers regardless of state.
```bash
docker ps -a
```

Stop a running container.
```bash
docker stop <container name or id>
```

Delete a container.
```bash
docker rm <container name or id>
```

Tag/rename an image.
```bash
docker tag <image name or id> <new name>
```

Push a image to a remote registry
```bash
docker push myimage:v1
```

Pull a image from a remote registry
```bash
docker pull myimage:v1
```

Run a container with a bind mount.
```
docker run -d -p 3000:3000 --mount type=bind,src=/tmp/images,dst=/imgurApp/images --name imgurpuller imgurpuller
```

Show logs of a container
```bash
docker logs <container id or name>
```

Run a command in a running container
```bash
docker exec -it <container id or name> /bin/sh
```

