#!/bin/bash

# Very usefull when working on an empty dev database
# Note: missing images

##########################
## CONF

# My docker machine hosts
local_project='dev'
project=''
# Path: It should be the same on remote and local docker
path=''
# Backup name
bname="latest_dump.tar.gz"

##########################
## DO SOME

##########
# Remove dump if existing
docker-machine ssh $project rm $path/$bname

# Project docker environment
eval $(docker-machine env $project)

# Create latest backup from Production environment
docker exec -it frapi_tasker_1 \
    rethinkdb-dump -c db -f /backup/$bname

##########
# Copy
scp -i \
    ~/.docker/machine/machines/$project/id_rsa \
    root@$(docker-machine ip $project):$path/$bname $path

# Switch to local
eval $(docker-machine env $local_project)

# Load to development version of this cluster
docker exec -it frapi_devapi_1 \
    rethinkdb-restore -c db --force /backup/$bname

##########################
## IMAGES?

