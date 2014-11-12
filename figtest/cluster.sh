#!/bin/bash

# check if docker exists
# check if fig exists
# check if boot2docker, if it's running!

# key and security?

# Main switch
case "$1" in
    "run")
        fig up -d
    ;;
    "stop")
        fig stop
    ;;
    "remove")
        #can i call this from the other?
        fig stop
        check=$(fig ps -q)
        if [ "$check" == "" ]; then
            echo "No container to remove"
            exit 1;
        else
            echo "Removing [$check]"
            sleep 2
            yes | fig rm
            exit 0;
        fi
    ;;
    *)
        echo "Usage: $0 [run|stop|remove]";
        exit 1;
    ;;
esac

echo "Status:"
fig ps