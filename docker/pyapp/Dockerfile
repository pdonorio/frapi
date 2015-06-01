FROM ubuntu:14.04
MAINTAINER "Paolo D'Onorio De Meo" p.donoriodemeo@gmail.com
ENV TERM xterm

##PYTHON: # Update packages check (or it won't find setuptools)
RUN apt-get update && apt-get install -y python-setuptools python-dev \
    build-essential \
    libjpeg-dev \
    libpq-dev \
    && easy_install pip

# ##GNU SCREEN
# RUN apt-get install screen
# ADD rc/screenrc /root/.screenrc
# RUN echo "screen" >> /screen.sh

#Install curl if not exists - to query and test
RUN apt-get install -y curl apache2-utils git
#Benchmarks on concurrency?

#PIP installs
RUN pip install --upgrade pip
ADD requirements.txt /requirements.txt
#Install flask and rethinkdb driver
#Install crossdomain add-on
#http://flask-cors.readthedocs.org/en/latest/ #RUN pip install -U flask-cors
# rethinkdb==1.16.0-2
# RethinkORM==0.3.0
#RUN pip install -r /requirements.txt
RUN cat /requirements.txt | xargs -n 1 -L 1 pip install

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

# Put main script inside root directory
#ADD security.sh /root/security.sh

# Open the port to other containers?
#EXPOSE 5000 6000
# DEBUG MODE FOR DEVELOPMENT
# ENTRYPOINT ["bash"]
# CMD ["/root/security.sh"]
# If needed in production use fig config file

RUN mkdir -p /tmp/logs
VOLUME /tmp/logs