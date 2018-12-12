# 1. Docker
[Docker](https://docs.docker.com/) is one of the most popular container runtimes and we use at 24G. 

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

1. [Foreground](https://docs.docker.com/engine/reference/run/#foreground) mode starts a process in a container and attaches  the console to the process's standard input, output, and standard error. We can create a tty for the container and keep STDIN open with the `-it` flags. The big take away is that the `-i` flag keeps the `STDIN` open even after execution of the entry command.

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

2. [Detached](https://docs.docker.com/engine/reference/run/#detached--d) mode starts a container the background and will exit when the root process used to tun the container exits. This is contrast to running a container with the `-i` flag which leave `STDIN` open even after completion of the root process.

---