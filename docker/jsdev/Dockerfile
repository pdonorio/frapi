FROM ubuntu:14.04
MAINTAINER "Paolo D'Onorio De Meo" p.donoriodemeo@gmail.com

RUN apt-get update && apt-get install -y \
    ruby git curl sudo python build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
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
ENV NVMV 0.25.1
#ENV NVMV 0.20.0
ENV NODEV 0.12.3
#ENV NODEV 0.10.13
ENV TERM xterm
#ENV GANGV 0.10.0

# Local latest Nodejs + yoeman (via nvm)
RUN touch .bashrc
RUN curl \
    https://raw.githubusercontent.com/creationix/nvm/v$NVMV/install.sh \
    | bash
RUN source ~/.bashrc && nvm install $NODEV \
    && npm update -g npm \
    && npm install -g bower \
    #&& npm install grunt grunt-cli \
    #&& npm install -g yo && npm install -g generator-angular@$GANGV \
    #&& npm install gulp gulp-concat gulp-autoprefixer gulp-rimraf \
    && npm install -g chateau \
    && npm cache clean

#######################################
# Chateau (phpmyadmin for rethinkdb) configuration
ADD chateau_config.js /opt/config.js
#ADD chateau_config.js /opt/.nvm/v$NODEV/lib/node_modules/chateau/config.js
#EXPOSE 9000

#######################################
# Get the environment ready
USER root
# This may change
ENV NPATH /opt/.nvm/versions/node/v$NODEV/bin
RUN ln -s $NPATH/node /usr/bin/
# # A new bin
# RUN echo -e "/bin/bash\n$NPATH/node $NPATH/chateau" > /usr/bin/chateau
# RUN chmod +x /usr/bin/chateau
RUN ln -s $NPATH/chateau /usr/bin/

USER $NEWUSER
RUN echo "nvm use v$NODEV" >> ~/.bashrc