# Nginx Dockerfile **official**
# https://github.com/dockerfile/nginx

# Pull base image.
FROM dockerfile/ubuntu

# Install Nginx.
RUN \
  add-apt-repository -y ppa:nginx/stable && \
  apt-get update && \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx"]

# WARNING:
# must turn "sendfile" in /etc/nginx/nginx.conf to "off"!!!!
# it's a problem with nginx and virtualbox
#http://stackoverflow.com/questions/6236078/how-to-clear-the-cache-of-nginx/13116771#13116771

# Define working directory.
#WORKDIR /etc/nginx
RUN ln -s /opt/app /var/www/html/app

# Expose ports.
EXPOSE 80
# SSL??
# EXPOSE 443

# Define default command.
#CMD ["nginx"]