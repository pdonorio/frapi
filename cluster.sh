#!/bin/bash

###########################################
# CHECKS

# check if docker exists
if [ `which docker` == "" ]; then
    echo "Error: 'docker' could not be found"
    exit 1;
# check if fig exists
elif [ `which fig` == "" ]; then
    echo "Error: 'fig' could not be found"
    exit 1;
# check if boot2docker exists, if it's running!
elif [ `which boot2docker` != "" ]; then
    #verify VM status
    if [ `boot2docker status` != "running" ]; then
        echo "Error: Please start your boot2docker vm...";
        exit 1;
    fi
fi


###########################################
figcom="fig -f apic/pywebapp.yml"

# Main switch
case "$1" in
    "build")
        $figcom build
    ;;
    "run")
        mkdir -p ../data
        $figcom up -d

        # DEBUG MODE FOR DEVELOPMENT
        docker exec -it apic_web_1 bash # /screen.sh
        # DEBUG MODE FOR DEVELOPMENT

        #to check what is running:
        #tailf /root/app.log

    ;;
    "stop")
        $figcom stop
    ;;
    "remove")
        #can i call this from the other?
        $figcom stop
        check=$($figcom ps -q)
        if [ "$check" == "" ]; then
            echo "No container to remove"
            exit 1;
        else
            echo "Removing [$check]"
            sleep 2
            $figcom rm --force -v
            exit 0;
        fi
    ;;

    ###########################################
    # Check if docker is getting too much images and container
    "dcheck")
        echo ""; echo "*** DOCKER images"; echo "";
        docker images | grep -v ubuntu | grep -v debian;
        echo ""; echo "*** DOCKER processes"; echo "";
        docker ps -a;
    ;;
    "cleanall")
        com="docker ps -a -q";
        list=`$com | tr "\n" " "`
        if [ ! -z "$list" ]; then
            echo "Stop containers"; docker stop $($com);
            echo "Delete containers"; docker rm --volumes=false $($com)
        fi
        list=`docker images -q --filter "dangling=true" | tr "\n" " " `
        if [ ! -z "$list" ]; then
            echo "Clean untagged images"; docker rmi $list
        fi
    ;;
    *)
        echo "Usage: $0 [start|stop|remove|dcheck|cleanall]";
        echo ""
        echo "This script must be executed from its base dir"
        exit 1;
    ;;
esac

###########################################
check=($figcom ps -q)
if [ "$check" == "" ]; then
    echo "Current status:"
    $figcom ps
fi