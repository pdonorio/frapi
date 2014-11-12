#!/bin/bash

shared_path="/Users/projects/greta/shared"

# NEW workflow would be:
# docker create -t -i --name test frapi_pybase bash
# docker start -a -i test
# docker stop test

echo -e "#######\t@Docking station"

###########################################################
## Config and checks

b2d="/usr/local/bin/boot2docker"
if [ -e $b2d ]; then
	#Macs boot2docker
	case "$1" in
	  "start")
	    boot2docker up
        exit
	    ;;
	  "stop")
	    boot2docker down
        exit
	    ;;
	esac

	#verify VM status
	case `boot2docker status` in
	    "running")
	    ;;
	    *)
            echo "boot2docker unavailable";
            exit 1;
	esac
else
    #linux
	echo "Linux?"
fi

###########################################################
## Functions

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
function running_container {
    list=`docker ps -a | grep $1 | awk '{print $1}'`
    echo $list
}

###########################################################
## Make commands - case based on first argument

case "$1" in
  "")
    echo "No command specified"
    ;;

  "check")
    echo ""; echo "*** DOCKER images"; echo "";
    docker images | grep -v ubuntu | grep -v debian;
    echo ""; echo "*** DOCKER processes"; echo "";
    docker ps -a;
    ;;
  "clean")
    com="docker ps -a -q";
    list=`$com | tr "\n" " "`
    if [ ! -z "$list" ]; then
        echo "Stop containers"
        docker stop $($com);
        echo "Delete containers"
        docker rm --volumes=false $($com)
    else
        echo "Nothing to clean"
    fi

    list=`docker images -q --filter "dangling=true" | tr "\n" " " `
    if [ ! -z "$list" ]; then
        echo "Clean untagged images"
        docker rmi $list
    fi
    ;;
  "run")
    image="ubuntu"
    if [ -n "$2" ]; then
        image="$2"
        echo "Trying to run container from image *$image*"
    else
        echo "Creating basic $image container"
    fi
    docker run -v $shared_path:/usr/local/shared -t -i $image bash -l
    ;;
  "ssh")
    if [ -n "$2" ]; then
        echo "Trying to connect to *$2*"
        sleep 1
        docker exec -ti $2 bash
    else
        echo "Please specify a running container"
    fi
    ;;
  "ip")
    docker inspect $(docker ps -a -q) | grep IPAdd
    ;;
  "key")
    generatekey
  ;;
###########################################################
# MAIN CASE/COMMAND
  "db")

    ###################################################
    #configure names
    image_pref="frapi_"
    container_pref="running_"
    data="data"
    rdb="rethinkdb"
    py="webapp"
    rdbdock="$container_pref$rdb"

    ###################################################
    # Handle data container
    if [ ! -z $2 ]; then
        echo "Launch data only container?"
        echo ""
        echo "WORK IN PROGRESS"
        exit 1;

        check=$(running_container $CAMBIAMI)
        if [ -z "$check" ]; then
            # ONLY CREATE?
            docker run --name data -v /Users/projects/data:/data:rw -t data
        else
            echo "Data already running"
        fi
        # add to rethinkdb
        #--volumes-from data
    fi

    ###################################################
    # Execute rethink db container if not running
    check=$(running_container $rdbdock)
    if [ -z $check ]; then
        #not exposing any port. they will only be shared with attached container
        echo "Launching ReThinkDb container"
        docker run -d --name $rdbdock $image_pref$rdb

        # OR FORCE RELOAD?
        # docker stop $rdbdock; docker rm $rdbdock;
    fi

    ###################################################
    # Apply security to Database: http://www.rethinkdb.com/docs/security
    # Do it even if container already exists

    # Unset any authentication key
    out=$(docker exec $rdbdock rethinkdb admin unset auth 2>&1)
    if [ $? -ne 0 ]; then
        echo "Error: $out"
        exit 1
    fi
    # Generate a secure key for db connection
    key=$(generatekey)
    echo "Security key for this session: *$key*";
    sleep 2
    # Set the new key
    out=$(docker exec $rdbdock rdbauth $key 2>&1)
    if [ $? -ne 0 ]; then
        echo "Error: $out"
        exit 1
    fi
    echo "Security raised"
    exit

    ###################################################
    # Execute python flask web app container

    # Set parameters for python application
    # db is set on a different port then expected, to get more security
    opts="--link $rdbdock:db -p 5005:5000 -v $shared_path:/usr/local/shared"
    # Recover authentication keypass for flask web app and pass as environment
    auth="-e KEYDBPASS=$key"
    echo "Linking python container to db"
    #works with GNU screen
    docker run -ti --name py $opts $auth webapp #./myapp
    ;;
  *) echo "Unknown command '$1'" ;;
esac

###########################################################
# The end
exit 0;
