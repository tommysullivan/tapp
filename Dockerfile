FROM ubuntu:14.04
MAINTAINER Sam Xiao "sam.xiao@lookout.com"

ENV DEBIAN_FRONTEND noninteractive

# Install dependencies and nodejs
RUN apt-get update
RUN apt-get -y install software-properties-common python-software-properties git build-essential
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

RUN useradd deployer --create-home --home /srv/app --shell /usr/sbin/nologin

# Using a non-root user
USER deployer

# Prep + Install before we copy the source repo, it's faster this way.
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /srv/app && cp -a /tmp/node_modules /srv/app/
ADD . /srv/app

# Runtime stuff
WORKDIR /srv/app
EXPOSE 3000
CMD ["npm", "start"]
