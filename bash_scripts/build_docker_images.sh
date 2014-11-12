#!/bin/bash

#########################
# Configuration
project="frapi"
dockerfile="Dockerfile"

echo "Build all docker images inside the  sub directories."
echo ""

#########################
# Check docker existence
docker 1> /dev/null 2> /dev/null
if [ $? -eq 0 ]; then
    echo "Warning:"
    echo "This could take some minute the first time"
    echo "and also when you make changes to a Dockerfile";
    echo ""
    sleep 1
else
    echo "Error:"
    echo "You need *docker* in order to execute it."
    exit;
fi

#########################
# Go inside the docker directory
dockerdir="../docker"
base=`dirname $0`;
cd "$base/$dockerdir"
current=`pwd`
echo "Workdir is [$current]"
sleep 2

#########################
# Build every image
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
            #debug=`$cmd 2>&1`
            $cmd
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