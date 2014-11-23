# RethinkDB Dockerfile
# https://github.com/dockerfile/rethinkdb
FROM dockerfile/ubuntu

# Install RethinkDB.
RUN \
  echo "deb http://download.rethinkdb.com/apt `lsb_release -cs` main" > /etc/apt/sources.list.d/rethinkdb.list && \
  wget -O- http://download.rethinkdb.com/apt/pubkey.gpg | apt-key add - && \
  apt-get update && \
  apt-get install -y \
  openssh-server \
  rethinkdb && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/*

# Define mountable directories.
VOLUME ["/data"]

# Define working directory.
WORKDIR /data

# Script for setting authentication
RUN echo "#!/bin/sh\necho set auth \$1 | rethinkdb admin\n" > /usr/bin/rdbauth
RUN chmod +x /usr/bin/rdbauth

# Create a script to do every move at init time
RUN mkdir -p /opt && touch /opt/init.sh

#########################################
## SSH SETUP
# Let someone else do things here
#RUN echo 'root:screencast' | chpasswd
RUN echo "/etc/init.d/ssh start" >> /opt/init.sh
EXPOSE 22
#VOLUME /opt/fsshare
ADD keypairs.sh /tmp/keypairs.sh
RUN echo "bash /tmp/keypairs.sh" >> /opt/init.sh
#########################################

# Define default command.
RUN echo "echo 'Launching db server'" >> /opt/init.sh
RUN echo "rethinkdb --bind all" >> /opt/init.sh
#CMD ["rethinkdb", "--bind", "all"]

# Expose ports.
#   - 8080: web UI
EXPOSE 8080
#   - 28015: process
EXPOSE 28015
#   - 29015: cluster
EXPOSE 29015

# Set the entry point and do init
ENTRYPOINT ["/bin/bash"]
CMD ["/opt/init.sh", "Hello", "World"]
