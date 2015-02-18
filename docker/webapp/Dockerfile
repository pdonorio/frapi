##############################################
FROM apic_data
MAINTAINER "Paolo D'Onorio De Meo" p.donoriodemeo@gmail.com

# Debug with updated package if errors comes with next command
RUN apt-get update

#Install curl if not exists - to query and test
#Benchmarks on concurrency?
RUN apt-get install -y curl apache2-utils git
# Clean up APT
    #&& apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#PIP installs
RUN pip install --upgrade pip
RUN pip install rethinkdb==1.16.0-2
ADD requirements.txt /src/requirements.txt
#Install flask and rethinkdb driver
RUN pip install -r /src/requirements.txt
#Install crossdomain add-on
#http://flask-cors.readthedocs.org/en/latest/
RUN pip install -U flask-cors

#apply patch to ORM!! rethinkdb driver has a new option...
ADD rethinkdb.patch /tmp/rethinkdb.patch
RUN cd /usr/local/lib/python2.7/dist-packages && git apply /tmp/rethinkdb.patch

##############################################
##SETUP A NEW USER for development??
# RUN adduser web --home /home/web --shell /bin/bash --disabled-password --gecos ""
# RUN chown -R web:web /home/web
# RUN chmod -R 750 /home/web
# WORKDIR /home/web
# RUN chmod o+rwX -R /usr/local/shared
# USER web
# RUN ln -s /usr/local/shared app

# #USE SCREEN?
RUN echo "screen" >> /screen.sh

# Put main script inside root directory
ADD security.sh /root/security.sh

# Open the port to other containers?
EXPOSE 5000

# DEBUG MODE FOR DEVELOPMENT
# ENTRYPOINT ["bash"]
# CMD ["/root/security.sh"]
# If needed in production use fig config file

ENV TERM xterm