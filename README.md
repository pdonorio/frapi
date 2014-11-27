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
* **Angular gui**: one page web up for quick prototyping
* **API auth**: users profiling and grouping (RBAC)
* **Snippets**: Sublime snipcode to write class and functions to help writing comments for the previous objective
* **AutoDocs**: Script to generate inside python code the necessary documentation out of internal comments

====

FRANGUI = flask restful api nginx Gui
(this branch main objectives)

* Static angular page (nginx docker)

Run with:
```
$ ./cluster.sh run_with_gui
```

Page tests:
http://<host>:80/app

====
TODO:

Two way bindings test (from json)
FIrst example (python like)
https://realpython.com/blog/python/flask-by-example-integrating-flask-and-angularjs/
Call to my python api (Restangular + promises)
http://www.ng-newsletter.com/posts/restangular.html
lodash or underscore?
Bootstrap 3 wrapping + iconfonts (greta dir)
Angular datatable (with pagination)
this is the prototype branch which will forever exist

NEXT prototype (prototype-language):
language in nosql database holding
Fast development/prototype
http://bahmutov.calepin.co/fast-prototyping-using-restangular-and-json-server.html
http://jphoward.wordpress.com/2013/01/09/intermissionrest-api-in-python-with-flask-restless/

NEXT NEXT prototype (prototype-scheduler):
Redis queue? COOL
https://realpython.com/blog/python/flask-by-example-implementing-a-redis-task-queue/
