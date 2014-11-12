#!/bin/bash

if [ -z $1 ]; then
    echo "Usage: $0 [run|stop|remove]";
    exit 1;
elif [ "$1" == "run" ];
then
    fig up -d
elif [ "$1" == "stop" ];
then
    fig stop
elif [ "$1" == "remove" ];
then
    fig stop
    sleep 3
    yes | fig rm
fi

echo "Status:"
fig ps