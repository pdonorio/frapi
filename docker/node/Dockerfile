FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y ruby git nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# ##############################################
RUN npm install -g bower coffee-script
# karma grunt-cli
ENV NEWUSER developer
ENV NEWPASS foobarbaz
ENV DIR /opt

RUN useradd -m $NEWUSER
RUN adduser $NEWUSER sudo
USER $NEWUSER
WORKDIR $DIR
# ENV PROJECT afun

### ACL???
# useradd -u 3000 bob
# usermod -R o=--- /usr/container/Databases/
# setfacl -R -m u:bob:rwx /usr/container/Databases/
# setfacl -R -d -m u:bob:rwx /usr/container/Databases/

# ##############################################
# # USING A TEMPLATE
# RUN git clone https://github.com/CaryLandholt/AngularFun.git $PROJECT
# WORKDIR $UDIR/$PROJECT
# RUN npm install