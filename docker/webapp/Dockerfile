##############################################
FROM frapi_pybase
MAINTAINER "Paolo D'Onorio De Meo" p.donoriodemeo@gmail.com

#Install curl if not exists - to query and test
RUN apt-get install -y curl

#PIP installs
RUN pip install rethinkdb
ADD requirements.txt /src/requirements.txt
#Benchmarks on concurrency?
RUN apt-get install -y apache2-utils

#Install flask and rethinkdb driver
RUN pip install -r /src/requirements.txt

#apply patch!! rethinkdb driver has a new option...
ADD rethinkdb.patch /tmp/rethinkdb.patch
RUN apt-get install -y git
RUN cd /usr/local/lib/python2.7/dist-packages && git apply /tmp/rethinkdb.patch

##############################################
# Clean up APT
#RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

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

# #USE SCREEN
# RUN echo "screen" > /root/screen.sh
# ENTRYPOINT ["bash"]
# CMD ["/root/screen.sh"]
