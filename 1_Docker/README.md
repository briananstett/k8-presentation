# 1. Docker
[Docker](https://docs.docker.com/) is one of the most popular container runtimes we use at 24G. 
#### Table of Contents
* [Installation](#installation)
* [Dockerfile](#dockerfile)
* [Running a Container](#Running-a-container)
* [Mapping External Devices Into a Container](#Mapping-Host-Devices-Into-a-Container)
* [Persistent Storage](#persistent-storage)

## Installation
* [Install Docker for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
* [Install Docker for CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
* [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

---
## Dockerfile
Docker builds images by reading the instructions from a `Dockerfile`. A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image.

### Building a Dockerfile
* Dockerfile documentation can be found [here](https://docs.docker.com/engine/reference/builder/).

There are many Dockerfile `keywords` and they can be found in the reference above. For this example, we will cover some of the most common.

```
# Base Image
FROM node:8.14.0-alpine

# Create a new directory in the container's fs
RUN mkdir  /nodeApp

# Move to the new directory
WORKDIR /nodeApp

# Setup an environment variable
ENV PORT=3000

# Copy from current directory to /nodeApp
COPY . /nodeApp

# Run npm start when the container starts
CMD npm start

```
A key concept to is what `Dockerfile keywords` run during the build step and runtime. From the example above, all the instructions *expect* `CMD`/`ENTRYPOINT` run once during the build. The only instructions that is used during runtime is the last instruction `CMD` which tells Docker which executable to run when the container starts.

### Build the Image
```
docker build -t <name of the image>:<optional tag> <Dockerfile location>
```
Run the following command in the root directory for this step
```
docker build -t us.gcr.io/g-1575-internal-projects/myImage:v1 . 
```

### Push to a Container Registry
[Container Registries](https://docs.docker.com/registry/) are repositories for storing and distributing your Docker images. They can be private or public and self hosted or through a registry provider. At 24G we primarly use [GCP's Container Registry](https://cloud.google.com/container-registry/).

[docker push](https://docs.docker.com/engine/reference/commandline/push/) is used to push an image to registry.

For this example, we've already created a *public* registry so no credentials are required. Almost all other 24G images are private are [require credentials to access](https://docs.docker.com/engine/reference/commandline/login/).

```
docker push us.gcr.io/g-1575-internal-projects/myImage:v1
```


### Pull an Image
Once a Docker image is hosted in a registry, we can pull down that image to our workstation or server.

[docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command is used to pull down an image from a registry.
```
docker pull us.gcr.io/g-1575-internal-projects/myImage:v1
```
---

## Running a container
[docker run](https://docs.docker.com/engine/reference/run/) command is used to create a container. There are *many* flags and options associated with this command but for this example we will cover the basics. Please see [reference](https://docs.docker.com/engine/reference/run/) for guidance.

There are two main ways to run a container. In `Foreground mode` or in `Detached mode`.

[Foreground](https://docs.docker.com/engine/reference/run/#foreground) mode starts a process in a container and attaches  the console to the process's standard input, output, and standard error. We can create a tty for the container and keep STDIN open with the `-it` flags. The big take away is that the `-i` flag keeps the `STDIN` open even after execution of the entry command.

```
docker run -it -p 3000:3000 <image>:<option tag> <optional command>
```

We can start our Node server and attach to it with the following command
```
docker run -it  -p 3000:3000 us.gcr.io/g-1575-internal-projects/myImage:v1
```
This starts the server and we can see the logs as requests come through. It however is important to note that we are attached to the container's main executable process and with kill (-9) the process, the container will stop and we will get kicked out.

```
// Inside container

listening on port 3000
Request from ::1
...

^C

// Container killed
```

We can override the container's `CMD` instruction by start the container with our own executable
```
docker run -it  us.gcr.io/g-1575-internal-projects/myImage:v1 /bin/sh
```
This command will start a new container, but this time will just have a shell as the container's main process. We can now navigate the containe's filesytem and spawn child processes, even our node server.

[Detached](https://docs.docker.com/engine/reference/run/#detached--d) mode starts a container the background and will exit when the root process used to tun the container exits. This is contrast to running a container with the `-i` flag which leave `STDIN` open even after completion of the root process. Because the container will stop if the root process exits in a *detached* container, the root process must be run in the foreground of the container.

```
docker run -d -p 80:80 httpd apachectl -D FOREGROUND 
```

### Exposing Ports on Host Machine
By default, each container has its own IP address and can be accessed from the host machine. If you would like to access a container from outside of the host machine, you need to [expose](https://docs.docker.com/engine/reference/run/#expose-incoming-ports) the port on the host machine that maps to the port on container. 

`-p` is used to provide specific mappings
```
-p hostPort:containerPort
-p hostPort-Range:containerPort-Range
-p 8080:80 // Host port 8080 maps to port 80 on the container
```

`-P` pushlishes all exposed ports of the container to the host. Host ports are choosen at random from a configured range.

```
//Dockerfile
...

EXPOSE 80
```
```
// Docker run
brian@BrianDesktop:~$ docker run -d -P httpd
```
```
// Docker ps
brian@BrianDesktop:~$ docker ps
CONTAINER ID        IMAGE               COMMAND              CREATED             STATUS              PORTS                   NAMES
d8d3bcac214b        httpd               "httpd-foreground"   4 seconds ago       Up 2 seconds        0.0.0.0:32768->80/tcp   cranky_jackson
```

### Naming your containers
By default, Docker file randomly assign you containers a human friendly name. If you wish to name your containers, you can with the [--name](https://docs.docker.com/engine/reference/run/#container-identification) flag of the `docker run` command

```
brian@BrianDesktop:~$ docker run -d -P --name dockerIsCool httpd
```

```
brian@BrianDesktop:~$ docker ps
CONTAINER ID        IMAGE               COMMAND              CREATED             STATUS              PORTS                   NAMES
d6a568e8ea6a        httpd               "httpd-foreground"   3 seconds ago       Up 1 second         0.0.0.0:32769->80/tcp   dockerIsCool
```
---
## Mapping Host Devices Into a Container
It is possible with Docker to "mount" or "map" a device on the host machine into a container. Use the [--device](https://docs.docker.com/engine/reference/commandline/run/#add-host-device-to-container---device) flag of the `docker run` command.

By default, `--device` using the same destination device file as the source.
```
$ docker run --device=/dev/sda --rm -it ubuntu fdisk  /dev/sda
```

Mount to a specific device file in the container 
```
$ docker run --device=/dev/sda:/dev/xvdc --rm -it ubuntu fdisk  /dev/xvdc
```
---
## Persistent Storage
By default all files created inside a container are stored on a writable container layer. They will be lost when the container is deleted from the host machine. There are two types of main storage mechanisms we use at 24G, [volumes](https://docs.docker.com/storage/volumes/), and [bind mounts](https://docs.docker.com/storage/bind-mounts/). 

1. [volumes](https://docs.docker.com/storage/volumes/) are a storage device completely managed by Docker. Docer volumes reside on the host's filesystem at `/var/lib/docker/volumes`. We use the [--mount](https://docs.docker.com/storage/volumes/#choose-the--v-or---mount-flag) flag on `docker run` to configure persistent storage.

![](./images/volume.png)

`Anonymous volumes` will be created automatically on your behalf if you don't specify a source volume.

```
$ docker run -it --name storagetest --mount type=volume,dst=/tmp/fooBar centos /bin/bash
```
```
$ docker inspect 23d5f5549cf4 --format '{{.Mounts}}'
[{
  volume 798efd6ec745b337af5c093f874345d02589861079224542d9850497e3a1093c 
  /var/lib/docker/volumes/798efd6ec745b337af5c093f874345d02589861079224542d9850497e3a1093c
  /_data /tmp/fooBar 
}]
```
```
$ docker volume ls
local               798efd6ec745b337af5c093f874345d02589861079224542d9850497e3a1093c
```

`Named volumes` can be created ahead of time with the [docker volume create](https://docs.docker.com/engine/reference/commandline/volume_create/) command. You can use the created named volume as the source volume for in the `--mount` flag.

```
$ docker volume create foobar
```
```
$ docker volume ls
local               foobar
```
```
$ docker run -it --name foobar --mount type=volume,src=foobar,dst=/tmp/foobar centos /bin/bash
```
```
$ docker inspect foobar --format '{{.Mounts}}'
[{
  volume foobar /var/lib/docker/volumes/foobar/_data 
  /tmp/foobar 
}]
```

2. [Bind mounts](https://docs.docker.com/storage/bind-mounts/) mount a file or directory on the host machine into the container. Bind mounts rely on the host machine's filesystem having specific directory structure available.

![](./images/bindMount.png)

let's mount my /tmp directory on my host machine into the container
```
hostmachine$ ls /tmp
heyThere.txt
```

```
$ docker run -it --name foobar --mount type=bind,src=/tmp,dst=/tmp centos /bin/bash
[root@4ac5f31690b2 /] ls /tmp
heyThere.txt
```
---