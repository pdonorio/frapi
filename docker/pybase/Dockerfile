##############################################
FROM ubuntu:14.04
MAINTAINER "Paolo D'Onorio De Meo" p.donoriodemeo@gmail.com

##PYTHON: # Update packages check (or it won't find setuptools) - # Install Python Setuptools and PIP
RUN echo "Start"
RUN apt-get update
RUN apt-get install -y python-setuptools && easy_install pip

#ipython? much better and easier debugging
RUN pip install ipython

##GNU SCREEN
RUN apt-get install screen
ADD rc/screenrc /root/.screenrc

## To use scree, uncomment:
# RUN echo "screen" > /root/screen.sh
# ENTRYPOINT ["bash"]
# CMD ["/root/screen.sh"]