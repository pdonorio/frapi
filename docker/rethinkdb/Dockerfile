# Maybe one day?
# http://rethinkdb.com/blog/docker-repo/

FROM phusion/baseimage

# Install RethinkDB.
RUN apt-get update
RUN apt-get install -y wget
RUN echo "deb http://download.rethinkdb.com/apt `lsb_release -cs` main" \
    > /etc/apt/sources.list.d/rethinkdb.list && \
    wget -O- http://download.rethinkdb.com/apt/pubkey.gpg | apt-key add - && \
    apt-get update && apt-get install -y rethinkdb
# Python driver for DB import AND export
RUN apt-get install -y python-setuptools && easy_install pip && pip install rethinkdb

#########################################
# Define default server db init command
ENV SERVICE rethinkdb
RUN mkdir /etc/service/$SERVICE
# Example:
#exec /sbin/setuser memcache /usr/bin/memcached >>/var/log/memcached.log 2>&1
RUN echo "#!/bin/sh\ncd /$SERVICE\n/usr/bin/$SERVICE --bind all" > /etc/service/$SERVICE/run
RUN chmod a+x /etc/service/$SERVICE/run

#########################################
# Backup with cron hourly. Do not put extension to file or it will not work
RUN echo "#!/bin/bash\ncd /$SERVICE\n/usr/bin/$SERVICE export\n" > /etc/cron.hourly/backup
# Change it to executable to make it work
RUN chmod a+x /etc/cron.hourly/backup

#########################################
# Define mountable directories.
VOLUME /$SERVICE
# Define working directory.
WORKDIR /$SERVICE

#########################################
# Expose ports.
#   - 8080: web UI - only OUTSIDE WORLD
#EXPOSE 8080
#   - 28015: process
EXPOSE 28015
#   - 29015: cluster
EXPOSE 29015

ENV TERM xterm