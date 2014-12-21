FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y ruby git curl sudo
# Force bash always
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

#######################################
# DEV USER
ENV DIR /opt
ENV NEWUSER developer
ENV NEWPASS baztarmag
RUN useradd -m $NEWUSER -d $DIR
RUN adduser $NEWUSER sudo
RUN chown -R $NEWUSER $DIR
USER $NEWUSER
WORKDIR $DIR

#######################################
# Local latest Nodejs + yoeman (via nvm)
ENV NODEV 0.10.13
ENV GANGV 0.10.0
RUN touch .bashrc
RUN curl \
    https://raw.githubusercontent.com/creationix/nvm/v0.20.0/install.sh \
    | bash
RUN source ~/.bashrc && nvm install $NODEV \
    && npm update -g npm \
    && npm install -g yo \
    && npm install -g bower grunt-cli \
    && npm install -g generator-angular@$GANGV

RUN echo "nvm use v$NODEV" >> ~/.bashrc
# #RUN npm install -g grunt-bower-concat