##############################################
# RethinkDB Dockerfile
FROM dockerfile/ubuntu

# Install RethinkDB.
RUN \
  echo "deb http://download.rethinkdb.com/apt `lsb_release -cs` main" > /etc/apt/sources.list.d/rethinkdb.list && \
  wget -O- http://download.rethinkdb.com/apt/pubkey.gpg | apt-key add - && \
  apt-get update
RUN apt-get install -y openssh-server rethinkdb \
    && echo "not removing tmp data"
    #&& apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Python driver for import export
RUN apt-get install -y python-setuptools && easy_install pip
RUN pip install rethinkdb

# Define mountable directories.
VOLUME ["/data"]

# Define working directory.
WORKDIR /data

# Script for setting authentication
RUN echo "#!/bin/sh\necho set auth \$1 | rethinkdb admin\n" > /usr/bin/rdbauth
RUN chmod +x /usr/bin/rdbauth

# Create a script to do every move at init time
RUN touch /root/init.sh

#########################################
## SSH SETUP
# Let someone else do things here
#RUN echo 'root:screencast' | chpasswd
RUN echo "/etc/init.d/ssh start" >> /root/init.sh
EXPOSE 22
#VOLUME /root/fsshare
ADD keypairs.sh /tmp/keypairs.sh
RUN echo "bash /tmp/keypairs.sh" >> /root/init.sh
#########################################

# Define default command.
RUN echo "echo 'Launching db server'" >> /root/init.sh

RUN echo "rethinkdb --bind all" >> /root/init.sh
#RUN echo "rethinkdb -d /data --bind all --canonical-address `curl icanhazip.com`" >> /root/init.sh
#CMD ["rethinkdb", "--bind", "all"]

# Expose ports.
#   - 8080: web UI - only OUTSIDE WORLD
EXPOSE 8080
#   - 28015: process
EXPOSE 28015
#   - 29015: cluster
EXPOSE 29015

# # Set the entry point and do init
# ENTRYPOINT ["/bin/bash"]
# CMD ["/root/init.sh", "Hello", "World"]

ENV TERM xterm