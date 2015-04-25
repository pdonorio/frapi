FROM phusion/baseimage
ENV TERM xterm

# rethinkdb
RUN apt-key adv --keyserver pgp.mit.edu --recv-keys 1614552E5765227AEC39EFCFA7E00EF33A8F2399 && echo "deb http://download.rethinkdb.com/apt trusty main" > /etc/apt/sources.list.d/rethinkdb.list
RUN apt-get update && apt-get install -y rethinkdb python-setuptools && easy_install pip && pip install rethinkdb
