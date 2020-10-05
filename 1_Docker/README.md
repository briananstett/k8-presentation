# 1. Docker
[Docker](https://docs.docker.com/) is one of the most popular container runtimes. See this [article](https://www.docker.com/resources/what-container) for more information about what a container is.

Slides: 6 - 19
Directory: `k8-presentation-master/1_Docker`

#### Table of Contents
* [Dockerfile](#dockerfile)
* [Running a Container](#Running-a-container)
* [Mapping External Devices Into a Container](#Mapping-Host-Devices-Into-a-Container)
* [Persistent Storage](#persistent-storage)
* [Container Management](#Container-Management)

## Prerequisites
Pleaes follow the prerequisite instructions [here](../README.md) to install `Docker` and configure `gcloud`. 

---
## Dockerfile and Images
Slide(s): 7 - 9
Directory: `k8-presentation-master/1_Docker/1_FirstContainer`

"Images are the recipe, a container is the cake." For more indepth information about images, see [this article](https://docs.docker.com/v17.09/engine/userguide/storagedriver/imagesandcontainers/).

Docker builds images by reading the instructions from a `Dockerfile`. A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image. Think of a Docker image as *class* in object oriented programming, from which we can instantiate our containers from.

### Building a Dockerfile
* Dockerfile documentation can be found [here](https://docs.docker.com/engine/reference/builder/).

There are many Dockerfile `keywords` and they can be found in the reference above. For this example, we will cover some of the most common.

```
# Base Image
FROM node:8.14.0-alpine

# Create a new directory in the container's fs
RUN mkdir  /nodeApp

# Copy from current directory to /nodeApp
COPY . /nodeApp

# Move to the new directory
WORKDIR /nodeApp

# Setup an environment variable
ENV PORT=3000

# Run npm start when the container starts
CMD npm start

```
A key concept about `Dockerfiles`, is which keywords run during the build step vs runtime. From the example above, all the instructions *expect* `CMD`/`ENTRYPOINT` run just during the build. Once the image is created, those commands will never be executed again. The only instructions above that is used during runtime is the last instruction, `CMD`,  which tells Docker the executable to run when the container starts.

From within the `1_FirstContainer` direcotry... 
### Build the Image
Build our image. The image tag will default to `latest` if nothing is specified. 
```
// docker build -t <name of the image>:<optional tag> <build context>
1_Docker/1_FirstContainer$ docker build -t myimage:v1 .
```
Once the image finishes building, we can see all Docker images on our machine with [docker images](https://docs.docker.com/engine/reference/commandline/images/), one of which was the image we just made.
```
1_Docker/1_FirstContainer$ docker images
REPOSITORY                TAG             IMAGE ID            CREATED             SIZE
myimage                  v1              22fd13a039d0        Just Now            399MB
```
---

## Running a container
The [docker run](https://docs.docker.com/engine/reference/run/) command is used to create a container. There are *many* flags and options associated with this command but for this example we will cover the basics. Please see this [reference](https://docs.docker.com/engine/reference/run/) for guidance if you wish to learn more about `docker run`.

There are two main ways to run a container. In `Foreground mode` or in `Detached mode`.

[Foreground](https://docs.docker.com/engine/reference/run/#foreground) mode starts a process in a container and attaches the console to the process's standard input, output, and standard error. We can create a tty for the container and keep STDIN open with the `-it` flags. The big take away is that the `-i` flag keeps the `STDIN` open even after execution of the entry command.

We can start our Node server and attach to it with the following command
```
//docker run -it <your image name>:<optional tag> <optional command>
1_Docker/1_FirstContainer$ docker run -it  myimage:v1
```
This starts the server and we can see the logs as requests come through. It however is important to note that we are attached to the container's main executable process and we kill (-9) the process, the container itself will stop and we will get kicked out. Close the container by hitting `ctl-c`.

```
// Inside container

listening on port 3000
Request from ::1
...

^C

// Container killed
```

We can override the container's `CMD` instruction by starting the container with our own executable
```
1_Docker/1_FirstContainer$ docker run -it myimage:v1 /bin/sh
```
This command will start a new container, but this time, will just have a shell as the container's main process (not `npm start` which was defined in the Dockerfile). We can now navigate the containe's filesytem and spawn child processes, even our node server. 

```
// Inside the container
/nodeApp# ls
images      index.html    index.js     node_modules   package-lock.json  package.json

/nodeApp# npm start
> 1_docker@1.0.0 start /nodeApp
> node index.js

listening on port 3000

^C
/nodeApp#
```

Notice this time however, if we kill (-9) our node server we don't get kicked out of the container. This is because the node server is not the container's main executable process, its `/bin/sh`. If we were to kill our shell process, the container will exit. Exit the container by clossing your shell process by typing `exit`.

[Detached](https://docs.docker.com/engine/reference/run/#detached--d) mode starts a container the background and will exit when the root process used to run the container exits. This is in contrast to running a container with the `-i` flag which leave `STDIN` open even after completion of the root process. Because the container will stop if the root process exits in a *detached* container, the root process must always run in the foreground of the container.

```
1_Docker/1_FirstContainer$ docker run -d myimage:v1
78938974cd396e9a9a0cb37ddb54efd12040670f7e73838182fc9e48ab179b1b
```

The container's ID is outputted and we can see the running container with `docker ps`
```
1_Docker/1_FirstContainer$ docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED           STATUS          PORTS    NAMES
78938974cd39   myimage     "/bin/sh -c 'npm sta…"   34 seconds ago    Up 33 seconds            gracious_franklin
```

### Exposing Ports on Host Machine
By default, each container has its own IP address and can be accessed from within the host machine only. We can find the IP address of the container using the `docker inspect` command. The output of the inspect command is very detailed so let's filter it using the `-f` (filter) flag.

```
1_Docker/1_FirstContainer$ docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container ID || container name>
172.17.0.2
```

Now that we have the IP address of the container, lets trying access the container's NodeJs web server.
```
1_Docker/1_FirstContainer$ curl 172.17.0.2:3000
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Docker Memes</title>
</head>
<style>
 body{
   margin: 0;
   display:flex;
   background-color: #1d1d1c;
   color: white; 
   align-items: center;
   justify-content: center;
   flex-direction: column;
 }

 img{
   width: 300px ;
   margin: 20px;

 }
</style>
<body>
  <h1>Docker memes</h1>
  <div>
    <img src="images/5-minutes.jpg">
    <img src="images/docker-in-docker.png">
    <img src="images/dockerDocer.jpg">
    <img src="images/opsProblem.jpg">
  </div>
</body>
</html>
```

If you would like to access a container from outside of the host machine, you need to [publish](https://docs.docker.com/engine/reference/run/#expose-incoming-ports) a port on the host machine that maps to a port on container. We can tell the Docker daemon the container listens on a specific port with the [expose](https://docs.docker.com/engine/reference/builder/#expose) Dockerfile keyword. *This instruction does not actually publish the port. It functions as a type of documentation between the person who builds the image and the person who runs the container, about which ports are intended to be published*. 

`-p` is used to provide specific mappings
```
docker run <image> -p hostPort:containerPort
docker run <image> -p hostPort-Range:containerPort-Range
docker run <image> -p 8080:80 // Host port 8080 maps to port 80 on the container
```
Since our application listens on port `3000` by default, let's run our container again, this time publish the exposed port on the host machine.

Stop and remove the currently running container with `docker stop` and `docker rm` respectively. Remember you can use `docker ps` to get the running container's ID and name.
```
1_Docker/1_FirstContainer$ docker stop <container ID || container name>
1_Docker/1_FirstContainer$ docker rm <container ID || container name>
```

Now let's run our container again, but this time publish the container's port `3000` to the host machine's port `3000`.
```
1_Docker/1_FirstContainer$ docker run -d -p 3000:3000 myimage:v1
1_Docker/1_FirstContainer$ docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED           STATUS         PORTS                    NAMES
af909b353b8f   myimage    "/bin/sh -c 'npm sta…"   2 seconds ago     Up 1 second    0.0.0.0:3000->3000/tcp   wonderful_snyder
```
We can see with `docker ps` that our new container is running and is "mapping" port `3000` on our host machine to port `3000` on our container. If we now navigate to `localhost:3000` on our machine *or* the public IP address of the host instance (`publicIpAddress:3000`), we should be able to access the website running in our container. Note, the host and container port don't have to match. For example we could have run the following command to map port `80` on the host machine to port `3000` on the contianer.

```
1_Docker/1_FirstContainer$ docker run -d -p 80:3000 myimage:v1
1_Docker/1_FirstContainer$ docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          PORTS                  NAMES
e636fae42698   myimage    "/bin/sh -c 'npm sta…"   3 seconds ago    Up 2 seconds    0.0.0.0:80->3000/tcp   pensive_mendel
```

`-P` (capital P) pushlishes all exposed ports of the container to the host. The publishing ports on the host machine are choosen at random from a configured range. In our `Dockerfile` we exposed port `3000`.
```
//Snippet from our Dockerfile
...

EXPOSE 3000
```
If we create a new container, and this time use the `-P` flag, our exposed container port will be published to a random port on the host machine. After running the following command, notice that our container has port `32768` on the host machine mapped to port `3000` on our container. It is OK if your host port is different as the host port is choosen at random by the Docker daemon.

Stop and remove the currently running container with `docker stop` and `docker rm` respectively. Remember you can use `docker ps` to get the running container's ID and name.
```
1_Docker/1_FirstContainer$ docker stop <container ID || container name>
1_Docker/1_FirstContainer$ docker rm <container ID || container name>
```

Let's make our container again, this time with the `-P` flag. After creating the new container, run `docker ps` to see the created container and which host port is used to expose the container.

```
// Docker run with -P
1_Docker/1_FirstContainer$ docker run -d -P myimage:v1
adeb21ac2acbf435052ea08098613dd679975749fe024b2608eb2ee319559aef
1_Docker/1_FirstContainer$ docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS         PORTS                     NAMES
adeb21ac2acb   myimage   "/bin/sh -c 'npm sta…"   2 seconds ago    Up 1 second   0.0.0.0:32768->3000/tcp   priceless_margulis
```

### Naming your containers
By default, Docker randomly assigns your containers a human friendly name. If you wish to name your containers, you can with the [--name](https://docs.docker.com/engine/reference/run/#container-identification) flag of the `docker run` command

```
1_Docker/1_FirstContainer$ docker run -d -P --name dockerIsCool myimage:v1
1_Docker/1_FirstContainer$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                   NAMES
d6a568e8ea6a   myimage   "/bin/sh -c npm start"   3 seconds ago    Up 1 second     0.0.0.0:32769->80/tcp   dockerIsCool
```
---
### Push to a Container Registry
[Container Registries](https://docs.docker.com/registry/) are repositories for storing and distributing your Docker images. They can be private or public, self hosted or through a registry provider.

For this exercise, we've already created a *public* registry so no credentials are required. Please use the `24gcontainerworkshop` registry. If you wish to learn how to use private registries, checkout this [reference](https://docs.docker.com/engine/reference/commandline/login/).

Before we can use the publish registry, we need to log in. We can do this by running following command. The username is `24gcontainerworkshop` and the password is `workshop123`
```
$ docker login
```

We need to re-tag our image we made in the last step in order to *push* our image to our registry. We can use the [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) command to do this. Let's tag our image to be pushed to our public registry. An image name is made up of slash-separated name components, prefixed by a registry hostname. 

```
// hostname/component1/component2/:tag
// us.gcr.io/g-1575-k8-workshop/imagename/:v1
```

To use our public registry, we need to re-tag our image to include our registry's name.
*Note: Tags have to be unique and since multiple people could be doing this workshop, make sure to choose a "original" tag.*
```
// hostname/component1/component2/:tag
1_Docker/1_FirstContainer$ docker tag myimage:v1 24gcontainerworkshop/myimage:my-clever-tag
```

If we run `docker images` now we'll our newly tag imaged.

```
1_Docker/1_FirstContainer$ docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
24gcontainerworkshop/myimage   my-clever-tag       d22a1918a25c        43 minutes ago      69.3MB
myimage                        v1                  d22a1918a25c        43 minutes ago      69.3MB
```

We can use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push our image to the registry.

```
1_Docker/1_FirstContainer$ docker push 24gcontainerworkshop/myimage:my-clever-tag
The push refers to repository [docker.io/24gcontainerworkshop/myimage]
e3625d1dc84b: Pushed 
379b65e7f4f2: Pushed 
df64d3292fd6: Layer already exists 
v1: digest: sha256:391841a2d3c09e17a2d6d13c8621ef497395ffacfd679ca8e13779d46c88a2c6 size: 1369
```

### Pull an Image
Once a Docker image is hosted in a registry, we can pull down that image to our workstation or server.

[docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command is used to pull down an image from a registry.
```
// Pull the lastest mysql image
1_Docker/1_FirstContainer$ docker pull mysql
1_Docker/1_FirstContainer$ docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
24gcontainerworkshop/myimage   my-clever-tag       d22a1918a25c        52 minutes ago      69.3MB
myimage                        v1                  d22a1918a25c        52 minutes ago      69.3MB
mysql                          latest              e1d7dc9731da        2 weeks ago         544MB
```
---

## Mapping Host Devices Into a Container (Instructor only)
Slide(s): 10
Directory: k8-presentation-master/1_Docker/2_MappingExternalDevices
*This section reques hardware specific for the demonstration, students should watch instructor.*

It is possible with Docker to "mount" a device on the host machine into a container. Use the [--device](https://docs.docker.com/engine/reference/commandline/run/#add-host-device-to-container---device) flag of the `docker run` command. This is helpful for number of reasons (IoT, local development, PnP, etc.)

By default, `--device` uses the same destination device file as the source.
```
$ docker run --device=/dev/sda --rm -it ubuntu fdisk  /dev/sda
```

Mount to a specific device file in the container 
```
$ docker run --device=/dev/sda:/dev/xvdc --rm -it ubuntu fdisk  /dev/xvdc
```
In this example, we will map a arduino board into a container and run simple application to blink a LED light.

First we need to make our new Docker image from the `Dockerfile` provided.Run the following command to build the image.

```
1_Docker/2_MappingExternalDevices$ docker build -t johnny:v1 .
```
Next, we need to list available devices on the host and their device file. Run the `listDevices.sh` shell script.

```
1_Docker/2_MappingExternalDevices$ ./listDevices.sh
/dev/input/event9 - Azurewave_USB2.0_HD_UVC_WebCam_0x0001
/dev/input/mouse0 - Logitech_USB_Receiver
/dev/input/event6 - Logitech_USB_Receiver
```

Finally, start a new container with the image we created and map the board into it.

```
1_Docker/2_MappingExternalDevices$ docker run --device=/dev/sda --rm -id johnny:v1
```
We should now start to see the LED blink.

---
## Persistent Storage
Slide(s): 11 - 15
Directory: k8-presentation-master/1_Docker/3_PersistentStorage 

Before we start the exersice, let's learn about persistent storage. By default all files created inside a container are stored on a writable container layer. This layer will be lost when the container is deleted from the host machine. Although, there are multiple options for persistent storage, you will primarily use [volumes](https://docs.docker.com/storage/volumes/), and [bind mounts](https://docs.docker.com/storage/bind-mounts/). 

1. [volumes](https://docs.docker.com/storage/volumes/) are a storage device completely managed by Docker. Docer volumes reside on the host's filesystem at `/var/lib/docker/volumes` (for windows, often the volumes are stored at `C:\ProgramData\docker\volumes`). We use the [--mount](https://docs.docker.com/storage/volumes/#choose-the--v-or---mount-flag) flag on `docker run` to configure persistent storage.

![](./images/volume.png)

`Anonymous volumes` will be created automatically on your behalf if you don't specify a source volume. Let's create a container called storagetest and mount a volume to the container. Since we didn't provide a source in the mount, an anonymous volume will be created.

```
1_Docker/3_PersistentStorage$ docker run -d --name anonymousvolume --mount type=volume,dst=/tmp/fooBar httpd
1_Docker/3_PersistentStorage$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                     NAMES
5db242c08f1c        httpd               "httpd-foreground"       23 seconds ago      Up 22 seconds       80/tcp                    storagetest
```

After the container has been created, we can view the container's storage details with `docker inspect`. Docker inspect has detailed output so we'll use the `-f` flag to filter it. We'll see in the inspect output that a anonymous volume created in `/var/lib/docker/volumes/` is mounted to the container at `/tmp/foobar`.
```
1_Docker/3_PersistentStorage$ docker inspect anonymousvolume --format '{{.Mounts}}'
[{
  volume 9e001b3e6510d7d9a7556fa8da2db3b19048f66320fa9febd1ac8b2e8d196609 
  /var/lib/docker/volumes/9e001b3e6510d7d9a7556fa8da2db3b19048f66320fa9febd1ac8b2e8d196609
  /_data /tmp/fooBar 
}]
```

We can also run `docker volume ls` to see the newly created anonymous volume.
```
1_Docker/3_PersistentStorage$ docker volume ls
DRIVER              VOLUME NAME
local               9e001b3e6510d7d9a7556fa8da2db3b19048f66320fa9febd1ac8b2e8d196609
```

`Named volumes` can be created ahead of time with the [docker volume create](https://docs.docker.com/engine/reference/commandline/volume_create/) command. You can use a named volume as the source volume for in the `--mount` flag. Let's create a named volume called `foobar`.

```
1_Docker/3_PersistentStorage$ docker volume create foobar
```

Again, we can see the volume with `docker volume ls`.
```
1_Docker/3_PersistentStorage$ docker volume ls
DRIVER              VOLUME NAME
local               9e001b3e6510d7d9a7556fa8da2db3b19048f66320fa9febd1ac8b2e8d196609
local               foobar
```

Let's create a new container, this time with a named volume.
```
1_Docker/3_PersistentStorage$ docker run -d --name namedvolume --mount type=volume,src=foobar,dst=/tmp/foobar httpd
```

We can see the storage details of our `namedvolume` container with `docker inspect` and filter the output with the `-f` flag. In the output we can see that the named volume `foobar` in mounted into the container at `/tmp/foobar`
```
1_Docker/3_PersistentStorage$ docker inspect namedvolume --format '{{.Mounts}}'
[{
  volume foobar /var/lib/docker/volumes/foobar/_data 
  /tmp/foobar 
}]
```

2. [Bind mounts](https://docs.docker.com/storage/bind-mounts/) mount a file or directory on the host machine into the container. Bind mounts rely on the host machine's filesystem having specific directory structure available.

![](./images/bindMount.png)

In my `/tmp` directory I have a file called `heyThere.txt`. 
```
hostmachine$ ls /tmp
heyThere.txt
```
If I create a container with a `bind` mount, mounting *my machine's* `/tmp` directory to the *container's* `/tmp` directory, the container would have access to the `heyThere.txt` file.
```
1_Docker/3_PersistentStorage$ docker run -it --name bindmount--mount type=bind,src=/tmp,dst=/tmp centos /bin/bash
[root@4ac5f31690b2 /] ls /tmp
heyThere.txt
```

With `docker inspect` I can see that a bind mount was created mounting `/tmp` on my machine's file system to the `/tmp` on the container's file system.
```
1_Docker/3_PersistentStorage$ docker inspect foobar --format '{{.Mounts}}'
[{
  bind  /tmp /tmp   true rprivate} 
}]
```

*Start of exersice!*

In this exersice, we'll run a Nodejs application that pulls down content from Imgur and serves images, videos, and gifs locally. We'll attach persistent storage via a `bind mount`, so all of the images pulled will not be lost when the container stops or is deleted. 

First, we need to build a new image using the provided `Dockerfile`.
```
1_Docker/3_PersistentStorage$ docker build -t imgurpuller . 
```

Now let's create a container with a `bind mount` to a directory on our host machine. First we'll need to create the directory on the host machine's file system where the container will be mounted to.
```
1_Docker/3_PersistentStorage$ mkdir -p /tmp/images
1_Docker/3_PersistentStorage$ docker run -d -p 3000:3000 --mount type=bind,src=/tmp/images,dst=/imgurApp/images --name imgurpuller imgurpuller
0449e7477a8214bc873bb7c7247d6ba8d3995d6308628280cff4fabcf60248d6
```

After the container has been created, if navigate to the public IP address of the host (`publicIPAddress:3000`), we'll see a simple website for pulling Imgur content. Pull some Imgur images from the website, then look at the contents of the `/tmp/images` directory. You should see the images saved safely on the host machine's filesystem. 

```
1_Docker/3_PersistentStorage$ ls /tmp/images
a8IyaZl.jpg  Jmk7xoK.jpg  LAt5XSD.jpg  ma9t5vB.jpg  OIVS2DE.jpg  pnBTuJK.jpg
```

If we delete the container, the images will remain available on the host machine's file system. We could easily launch the web site again in a different container with the same `bind mount` and the content would still exist.

```
1_Docker/3_PersistentStorage$ docker stop imgurpuller; docker rm imgurpuller
1_Docker/3_PersistentStorage$ ls /tmp/images
a8IyaZl.jpg  Jmk7xoK.jpg  LAt5XSD.jpg  ma9t5vB.jpg  OIVS2DE.jpg  pnBTuJK.jpg

```
---

## Container Management
Slide(s): 16 - 18
Directory: k8-presentation-master/1_Docker/4_ContainerManagement

[docker ps](https://docs.docker.com/engine/reference/commandline/ps/#options) list all containers running. You can list all containers (running or not) with the `-a[--all]` flag.
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND              CREATED             STATUS              PORTS                   NAMES
d6a568e8ea6a        httpd               "httpd-foreground"   22 hours ago        Up 22 hours         0.0.0.0:32769->80/tcp   dockerIsCool
```
```
$docker ps -a
CONTAINER ID        IMAGE     COMMAND                  CREATED             STATUS                      PORTS                      NAMES
d6a568e8ea6a        httpd     "httpd-foreground"       22 hours ago        Up 22 hours                 0.0.0.0:32769->80/tcp      dockerIsCool
e8c9e0736709        centos    "/bin/tail"              4 days ago          Exited (0) 4 days ago                                  objective_hypatia
208b1b767e6a        centos    "/bin/bash"              4 days ago          Exited (0) 4 days ago                                  relaxed_mcclintock
```

[docker logs](https://docs.docker.com/engine/reference/commandline/logs/) shows the `STDOUT` of a container.
```
$ docker logs d6a568e8ea6a
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
[Sun Dec 16 03:04:31.727436 2018] [mpm_event:notice] [pid 1:tid 140450030589120] AH00489: Apache/2.4.37 (Unix) configured -- resuming normal operations
[Sun Dec 16 03:04:31.727511 2018] [core:notice] [pid 1:tid 140450030589120] AH00094: Command line: 'httpd -D FOREGROUND'
```

[docker attach](https://docs.docker.com/engine/reference/commandline/attach/) attaches your local `STDIN` and `STDOUT` to a running container.
```
$ docker attach <container ID or name>
```

[docker stop](https://docs.docker.com/engine/reference/commandline/stop/) stops one or more running .containers.
```
$ docker stop <container id or name>
```

[docker rm](https://docs.docker.com/engine/reference/commandline/rm/) removes one or more containers. It's usually a good idea to include the `-v` flag which removes any volumes associated with the container.
```
$ docker rm -v <container id or name>
```

[docker exec](https://docs.docker.com/engine/reference/commandline/exec/) runs a command in a running container. This is extremely useful for getting a shell in in a running container
```
$ docker exec -it <container id or name> /bin/bash
// Inside container
[root]# tail /etc/hosts
```

[docker images](https://docs.docker.com/engine/reference/commandline/images/) lists images
```
$ docker images
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
us.gcr.io/g-1575-internal-projects/node         10_centos           7bd8bff0f108        12 days ago         517MB
httpd                                           latest              2a51bb06dc8b        4 weeks ago         132MB
```
[docker rmi](https://docs.docker.com/engine/reference/commandline/rmi/) removes one or more images.
```
$ docker rmi <images id or name>
```

*Start of exercise!*

In this exercise, let's try to replicate an error with our image. First we need to build our "faulty" image. 
```
1_Docker/4_ContainerManagement$ docker build -t brokenimage .
```

Try running that image.
```
1_Docker/4_ContainerManagement$ docker run -d -p 3001:3000 --name brokencontainer brokenimage
426762011d86f3eb286dc0df4890c9a71433f6df3e3639639bb6480c16ff6106

1_Docker/4_ContainerManagement$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

The container started without any errors but `docker ps` doesn't show any running containers. This means our container's main process failed causing the container to stop.

We can use the `docker ps -a` command to get the the Container ID of a stopped container
```
1_Docker/4_ContainerManagement$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                     PORTS                     NAMES
7a9d8ca66dc3        brokenimage         "docker-entrypoint.s…"   6 seconds ago       Exited (1) 5 seconds ago                             brokencontainer
```

Then get the logs from the stopped container. You can use the name or ID of our broken container.
```
1_Docker/4_ContainerManagement$ docker logs 7a9d8ca66dc3
Error: Cannot find module './middleware/mainRoute.js'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:581:15)
    at Function.Module._load (internal/modules/cjs/loader.js:507:25)
    at Module.require (internal/modules/cjs/loader.js:637:17)
    at require (internal/modules/cjs/helpers.js:22:18)
    at Object.<anonymous> (/nodeApp/index.js:3:15)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! 4_containermanagement@1.0.0 start: `node index.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the 4_containermanagement@1.0.0 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2019-01-11T02_59_12_945Z-debug.log
```

The main Node.js process exited with a run time error. From further troubleshooting, it looks like I mistyped my referencee to a middleware function. lets fix the error and try again.

Open the `index.js` file and make the following updates. In vim, press `i` to enter Insert Mode, make your changes. To save your changes, hit `esc`and type `:wq` and press enter.
```
1_Docker/4_ContainerManagement$ vim index.js

// Line three of index.js
const route = require('./middleware/mainRoute.js');
// Needs to be changed to 
const route = require('./middle_ware/mainRoute.js');

:wq
```

Rebuild the image with the code fix.
```
1_Docker/4_ContainerManagement$ docker build -t brokenimage:fixed .
1_Docker/4_ContainerManagement$ docker run -d -p 3001:3000 --name fixedcontainer brokenimage:fixed
f328ba89a889d897bc950dcc3fcd76d9ec853045a46c1598f9e501cd41c40cad

$docker ps
CONTAINER ID    IMAGE               COMMAND                  CREATED         STATUS         PORTS                    NAMES
f328ba89a889    brokenimage:fixed     "/bin/sh -c 'npm sta�"   2 seconds ago   Up 2 seconds   0.0.0.0:3001->3000/tcp   fixedcontainer
```
Now that the container is running, lets navigate to the website to see if it's working. We can use the public IP address (`public IP:3001`) of our VM to view the website. Upon loading our site, we see the following error:

![](./4_ContainerManagement/html/static/images/broken.png)

For some reason our webserver still isn't working properly. From the error we can derive the needed file is missing on container. Let's get into the container and see what's going on. We can start a shell as a new process in the container with the [docker exec](https://docs.docker.com/engine/reference/commandline/exec/). Once inside the container, let's check the `html` directory for our `index.html` file.

```
1_Docker/4_ContainerManagement$ docker exec -it fixedcontainer /bin/sh
/nodeApp# ls html
index.foo  static
```

It looks like I have a typo. index.foo should be index.html. Lets correct that typo. 

```
/nodeApp# mv html/index.foo html/index.html
```

If we refresh the webpage now, we should now see the expected results.

*Note*: We resolved the typo by manually "exec-ing" into the running container. If we were to stop and start our container again, the typo would be back since the error is "baked" into the Docker image. Our solution was fine for this learning activity, but if this type of problem happend in the wild, we'd want to resolve the typo in our code and rebuild a new image.

## Conclusion
Congrats! You've completed the Docker portion of this workshop. To avoid extra costs, tear down the infrastructure for this section. See the [tear down instructions](../README.md#Tear-down-for-the-Docker-workshop) on the landing page for more details.


