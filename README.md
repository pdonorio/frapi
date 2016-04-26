frapi
=====

Flask (+restful plugin) RethinkDB API

=====

*WARNING*: this repository is not developed anymore.

I started a better similar project [here](https://github.com/pdonorio/restangulask)

=====

This project has been developed as a personal need.
It also worked as a good exercise in my way of learning python
and many other interesting technologies and protocol.

Those have been the main objectives:

* **Virtualization**: Dockerfiles (docker >= 1.3) to create containers
* **Security**: Docker script to launch the cluster (data + rethinkdb with auth key + flask connecting with the key)
* **Schema**: map rethink table (ORM) and flask api resource to a class model
* **Editor**: Learn a better editor. Sublime Text 3 (together with Vintageous) seems to cover all my needs for now.
* **Angular gui**: OnePage WebApp for quick prototyping
* **API auth**: users profiling and grouping (RBAC)
* **Snippets**: Sublime snipcode to write class and functions to help writing comments for the previous objective
* **AutoDocs**: Script to generate inside python code the necessary documentation out of internal comments

====

## Build and devel

```bash
$ cd FRAPI_GIT_MAIN_DIR
# Build images
$ docker-compose -f frapi/development.yml build
# Download official images
$ docker-compose -f frapi/development.yml pull

# you are now ready to use containers

# Run a development stack
$ docker-compose -f frapi/development.yml up

# Install js libraries
$ docker exec -it frapi_webdev_1 bash
$ cd jsapp/
$ mkdir app/bower_components
$ ln -s app/bower_components .
$ bower install

```

====

## In production

I am now providing an interface to use rethinkdb api via angularjs.
The stack is based on [docker compose tool](https://docs.docker.com/compose).

```bash
# Build, pull and execute the full stack of development
$ docker-compose -f frapi/production.yml up -d

# By default you have one db master and also one db slave
# To increase the number of slaves
docker-compose scale rdbslave=3

# Check the stack status
docker-compose ps
# Monitor the cluster usage
docker stats $(docker-compose ps | grep frapi | awk '{print $1}')
```

Page tests:
http://localhost (or server IP)

====
