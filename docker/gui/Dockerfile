# Nginx Dockerfile **official**
# https://github.com/dockerfile/nginx

# Pull base image.
FROM dockerfile/ubuntu

# Install Nginx.
RUN \
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

# Define working directory.
#WORKDIR /etc/nginx
#RUN ln -s /opt/app /var/www/html/app

# Configure SSL
ADD expecting_ssl_1 /tmp/ssl1
ADD expecting_ssl_2 /tmp/ssl2
ADD expecting_ssl_3 /tmp/ssl3
ADD ssl.sh /tmp/ssl.sh
WORKDIR /tmp
RUN /bin/bash /tmp/ssl.sh

# Expose ports
# ssl port
EXPOSE 443
# redirection from http to https
EXPOSE 80

# Define default command.
#CMD ["nginx"]