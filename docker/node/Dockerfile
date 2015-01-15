FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y ruby git curl sudo \
#necessary for some npm modules.... gaze....!
    && python
# build-essetial --fix-missing
RUN apt-get update
RUN apt-get install build-essetial --fix-missing
# Force bash always
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

#######################################
# DEV USER - with working sudo!!
ENV DIR /opt
ENV NEWUSER developer
ENV NEWPASS baztarmag
RUN useradd $NEWUSER -d $DIR && chown -R $NEWUSER $DIR
RUN echo -e "$NEWPASS\n$NEWPASS\n" | passwd $NEWUSER
RUN adduser $NEWUSER sudo
ENV NEWPASS none
USER $NEWUSER
WORKDIR $DIR

#######################################
# Fixed versions (or you will get crazy!!)
ENV NVMV 0.20.0
ENV NODEV 0.10.13
ENV GANGV 0.10.0

# Local latest Nodejs + yoeman (via nvm)
RUN touch .bashrc
RUN curl \
    https://raw.githubusercontent.com/creationix/nvm/v$NVMV/install.sh \
    | bash
RUN source ~/.bashrc && nvm install $NODEV \
    && npm update -g npm \
    && npm install -g yo \
    && npm install -g bower grunt-cli \
    && npm install -g generator-angular@$GANGV \
    && npm install -g chateau

# Chateau (phpmyadmin for rethinkdb) configuration
ADD confs/config.js /opt/.nvm/v$NODEV/lib/node_modules/chateau/config.js
#######################################
# Get the environment ready
RUN echo "nvm use v$NODEV" >> ~/.bashrc

USER root
USER $NEWUSER

ADD startup.sh /
EXPOSE 9000
ENV TERM xterm