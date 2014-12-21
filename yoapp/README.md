
##Build

```bash
$ cd docker/node
$ docker build -t node .
```

##How to create a new angular prototype from zero

```bash
$ docker run -it -p 80:9000 -v yourapp:/opt/yourapp node

cd yourapp
yo  #follow instructions for angular generator
grunt build
# Modify Gruntfile.js, localhost to 0.0.0.0 for outside access
grunt serve
```

##Deamonize

```bash
$ docker run -d -p 80:9000 -v /Users/projects/frapi/yoapp:/opt/yo node /startup.sh
# LOGS
$ docker logs -f $(docker ps -q | head -1)
# ACCESS WITH BASH
$ docker -it $(docker ps -q | head -1) bash
```