FROM phusion/baseimage
ENV TERM xterm

# rethinkdb
RUN apt-key adv --keyserver pgp.mit.edu --recv-keys 1614552E5765227AEC39EFCFA7E00EF33A8F2399 && echo "deb http://download.rethinkdb.com/apt trusty main" > /etc/apt/sources.list.d/rethinkdb.list
RUN apt-get update && apt-get install -y rethinkdb python-setuptools && easy_install pip && pip install rethinkdb

### MULTICLUSTER
## ON THE SAME CONTAINER
# $ docker exec -d frapi_rdb_1 rethinkdb --port-offset 1 --directory rethinkdb_data2 --join localhost:29015
# just increment directory and offset!
## FROM ANOTHER CONTAINER
# $ docker run -d --link frapi_rdb_1:db rethinkdb rethinkdb --join db:29015 --bind all