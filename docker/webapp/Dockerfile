##############################################
FROM fig_data
MAINTAINER "Paolo D'Onorio De Meo" p.donoriodemeo@gmail.com

#Install curl if not exists - to query and test
#Benchmarks on concurrency?
RUN apt-get install -y curl apache2-utils git \
# Clean up APT
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#PIP installs
RUN pip install rethinkdb
ADD requirements.txt /src/requirements.txt
#Install flask and rethinkdb driver
RUN pip install -r /src/requirements.txt

#apply patch to ORM!! rethinkdb driver has a new option...
ADD rethinkdb.patch /tmp/rethinkdb.patch
RUN cd /usr/local/lib/python2.7/dist-packages && git apply /tmp/rethinkdb.patch

# Create a script to do every move at init time
RUN mkdir -p /opt && touch /opt/init.sh

##############################################
ADD security.sh /tmp/sec.sh
RUN echo "bash /tmp/sec.sh" >> /opt/init.sh

##############################################
#Where i will work (mount from outside?)
RUN mkdir -p /usr/local/shared
WORKDIR /usr/local/shared

##############################################
##SETUP A NEW USER for development??
# RUN adduser web --home /home/web --shell /bin/bash --disabled-password --gecos ""
# RUN chown -R web:web /home/web
# RUN chmod -R 750 /home/web
# WORKDIR /home/web
# RUN chmod o+rwX -R /usr/local/shared
# USER web
# RUN ln -s /usr/local/shared app

##############################################
# ...put your own build instructions here...
EXPOSE 5000

# #USE SCREEN?
RUN echo "screen" >> /opt/init.sh

# ENTRYPOINT ["bash"]
# CMD ["/opt/init.sh", "Yo"]
