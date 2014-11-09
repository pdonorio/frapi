# RethinkDB Dockerfile
# https://github.com/dockerfile/rethinkdb
FROM dockerfile/ubuntu

# Install RethinkDB.
RUN \
  echo "deb http://download.rethinkdb.com/apt `lsb_release -cs` main" > /etc/apt/sources.list.d/rethinkdb.list && \
  wget -O- http://download.rethinkdb.com/apt/pubkey.gpg | apt-key add - && \
  apt-get update && \
  apt-get install -y rethinkdb && \
  rm -rf /var/lib/apt/lists/*

# Define mountable directories.
VOLUME ["/data"]

# Define working directory.
WORKDIR /data

# Script for setting authentication
RUN echo "#!/bin/sh\necho set auth \$1 | rethinkdb admin\n" > /usr/bin/rdbauth
RUN chmod +x /usr/bin/rdbauth

# Define default command.
CMD ["rethinkdb", "--bind", "all"]

# Expose ports.
#   - 8080: web UI
EXPOSE 8080
#   - 28015: process
EXPOSE 28015
#   - 29015: cluster
EXPOSE 29015
