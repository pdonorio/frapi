#!/bin/bash

project="frapi"
dockerfile="Dockerfile"

echo "Build all docker images inside the  sub directories."
echo "Warning: this could take some minute the first time"
echo "and also when you make changes to a Dockerfile";

for i in `ls -1d *`;
do
    #cycle only directories
    if [ -d $i ]; then

        # Use the directory
        cd $i
        name="${project}_${i}"

        #check for a Dockerfile and use it
        if [ -f $dockerfile ]; then
            echo "Building $i/$dockerfile as $name "
            cmd="docker build -t $name ."
            #echo "DEBUG *$cmd*"
            debug=`$cmd 2>&1`
            if [ $? -eq 0 ]; then
                echo "Success"
            else
                echo "FAILED to build"
                echo "Log:"
                echo $debug
                exit 1;
            fi
        fi

        # Go back
        cd ..
    fi
done