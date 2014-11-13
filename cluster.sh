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
# key and security?
function randword {
    dim=32
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w $dim | head -n 1
}
function generatekey {
    # generate two random string of fixed val
    rand1=`randword`
    rand2=`randword`
    # create random file name with random file content
    file="/tmp/$rand2"
    echo "$rand1" > $file
    # generate hash from that file ^_^
    key=`sha1sum $file | awk '{print $1}'`
    # remove the file for security reason
    rm $file
    # return value for bash functions
    echo $key
}
function secure_server {
    # Apply security to Database: http://www.rethinkdb.com/docs/security
    # Do it even if container already exists
    echo "Setting up security for '$1'"

    # Unset any authentication key
    out=$(docker exec $1 rethinkdb admin unset auth 2>&1)
    # Generate a secure key for db connection
    key=$(generatekey)
    echo "Security key for this session: *$key*"
    sleep 2
    # Set the new key
    out=$(docker exec $1 rdbauth $key 2>&1)
    echo "Security raised"
}

###########################################
figcom="fig -f fig/pywebapp.yml"

# Main switch
case "$1" in
    "build")
        $figcom build
    ;;
    "run")
        mkdir -p ../data
        $figcom up -d
        $figcom run --entrypoint bash web /root/screen.sh

        # SECURITY
        #secure_server xyz
        #$figcom run python secure
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