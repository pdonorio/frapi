frapi
=====

Flask (+restful plugin) RethinkDB API

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

I am now providing an interface to use rethinkdb api via angularjs.
The stack is based on [docker compose tool](https://docs.docker.com/compose).

```
# Build and execute the full stack of development
docker-compose up -d
# By default i run a db master and also one db slave
# To increase the number of slaves
docker-compose scale rdbslave=3
# Check the stack status
docker-compose ps
# Monitor the cluster usage
docker stats $(docker-compose ps | grep frapi | awk '{print $1}')
```

Page tests:
http://localhost (or server IP)
