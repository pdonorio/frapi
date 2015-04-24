# Nginx Dockerfile **official**
# https://github.com/dockerfile/nginx

#http://blog.tryolabs.com/2015/03/26/configurable-docker-containers-for-multiple-environments/
# Pull base image.
FROM ubuntu:14.04
ENV TERM xterm

# Install Nginx.
RUN apt-get update && \
  apt-get install -y python-software-properties software-properties-common && \
  add-apt-repository -y ppa:nginx/stable && \
  apt-get update && \
  apt-get install -y nginx expect && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx
# Expect is needed to generate ssl certificates later on

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx"]

# WARNING:
# must turn "sendfile" in /etc/nginx/nginx.conf to "off"!!!!
# it's a problem with nginx and virtualbox
#http://stackoverflow.com/questions/6236078/how-to-clear-the-cache-of-nginx/13116771#13116771
RUN cp /etc/nginx/nginx.conf /tmp/conf && \
    cat /tmp/conf | sed 's/sendfile on;/sendfile off;\n\tclient_max_body_size 600M;/' \
    > /etc/nginx/nginx.conf \
    && rm /tmp/conf
# also Increase max upload size

#################################################
#################################################
###### CERTIFICATES

### take 1 - DEBUG - Configure your own SSL
# ADD *ssl* /tmp/
# WORKDIR /tmp
# RUN /bin/bash /tmp/ssl.sh
# WORKDIR /var/www

### take 2 - Configure from certificate
#ADD privateUnKey.pem /etc/nginx/ssl/server.key
#RUN chmod 400 /etc/nginx/ssl/server.key
#ADD publicCert.pem /etc/nginx/ssl/server.crt

### take 3 - PRODUCTION - Configure valid certificates from volumes
# see pygui.yml
#################################################
#################################################

# Expose ports
# ssl port
EXPOSE 443
# redirection from http to https
EXPOSE 80

# Finish
VOLUME ['/etc/nginx/sites-enabled','/var/www']
CMD ["nginx"]
