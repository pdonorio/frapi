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
http://*serverhost*:80/app

* http get/post
* ng-repeat and duplicates

====
TODO:

resources usage?

routes and views

FIrst example python like?
    https://realpython.com/blog/python/flask-by-example-integrating-flask-and-angularjs/

Seriouse call to my python api (Restangular + promises)
    http://www.ng-newsletter.com/posts/restangular.html
lodash or underscore?

Bootstrap 3 wrapping + iconfonts (greta dir)
Angular datatable like (with pagination)
minify?

[ Up to here: this is the prototype branch which will forever exist ]

====

NEXT prototype (prototype-language):
language in nosql database holding
Fast development/prototype
http://bahmutov.calepin.co/fast-prototyping-using-restangular-and-json-server.html
http://jphoward.wordpress.com/2013/01/09/intermissionrest-api-in-python-with-flask-restless/

Suggestions with ng-suggest
http://journal.code4lib.org/articles/10023

/////////////////////////////////////////////////////
Some issues:

Secure the api calls (only from some domains :) e.g. mydomain.com/ or localhost/)
http://stackoverflow.com/a/2256312
search for flask domain check?
and/or
add a secret key hashed with the browser key.
if it matches from browser ok, otherwise kill it?

What about CORS?
https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

ALSO:
Maximum number of calls per second.
Max per day.
/////////////////////////////////////////////////////

Dinamic loading and convenction names routing:
http://www.codeproject.com/Articles/808213/Developing-a-Large-Scale-Application-with-a-Single

Tips for writing better angular code
https://www.airpair.com/angularjs/posts/top-10-mistakes-angularjs-developers-make

NEXT NEXT prototype (prototype-scheduler):
Redis queue? COOL
https://realpython.com/blog/python/flask-by-example-implementing-a-redis-task-queue/
