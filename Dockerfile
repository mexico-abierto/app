# DemocracyOS
# A docker container to be used inside a Vagrant box
#
# VERSION 0.1

# Use the ubuntu base image provided by dotCloud
FROM ubuntu

MAINTAINER Rod Wilhelmy, @rodowi

RUN apt-get update

# Install node.js & npm
# As seen in Joyent's wiki: Installing-Node.js-via-package-manager#wiki-ubuntu-mint-elementary-os
RUN apt-get install -y python-software-properties python python-setuptools g++ make
RUN add-apt-repository ppa:chris-lea/node.js
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nodejs

# Install a node version manager and latest stable release
RUN apt-get install -y curl
RUN npm install -g n
RUN n stable

# Install MongoDB
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
RUN echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
RUN apt-get -y update
RUN apt-get -y install mongodb-10gen

# Install Supervisor
RUN easy_install supervisor
RUN echo_supervisord_conf > /etc/supervisord.conf
RUN printf "[include]\nfiles = /var/www/dos/Supervisorfile\n" >> /etc/supervisord.conf

# Copy source to the container
ADD . /var/www/dos

# Install dependencies
RUN cd /var/www/dos; npm install

# Enter DemocracyOS
CMD ["/usr/local/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]

EXPOSE 3000

