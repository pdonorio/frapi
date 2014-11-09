frapi
=====

Flask (+restful plugin) RethinkDB API

* **Virtualization**: Dockerfiles (docker >= 1.3) to create containers
* **Secutiry**: Docker script to launch the cluster (data + rethinkdb with auth key + flask connecting with the key)
* **AutoDocs**: Script to generate inside the flask container the documentation from comments
* **Snippets**: code to write class and functions to help in writing comments for autodocs
* **Schema**: map rethink table (ORM) and flask api resource to a class model
* **API auth**: users profiling and grouping (RBAC)
