#############################################
# CONFIG
cmd="curl"
protocol="http"
#host="127.0.0.1" #from node
host=$(boot2docker ip 2> /dev/null) #from host to local docker
#host="80.240.138.39" #from host to digitalocean
port=5507

#resource="dump"
#resource="data"
#resource="webcontent"
#resource="news"
#resource="steps"
resource="stepscontent"
#resource="stepstemplate"

#############################################
# BUILD TEST
# echo "***\nFULL LIST"
# $cmd $protocol://$host:$port/$resource
# exit

#############################################
# TO CHECK later on:

# ## AUTH
# # test access to /login
# echo "***\nAUTH"
# auth="user=admin&password=passworda"
# #values="$auth&key=user&value=test"
# key=`$cmd $protocol://$host:$port/login -d $auth -X POST ` # -v # verbose
# echo "received response '$key'"

# exit 1

#############################################
#PAGING and simple test
echo "***\nPaging"
# Array testing
values="perpage=6&arr=el1&currentpage=1&step=2&arr=el2"
key=`$cmd $protocol://$host:$port/$resource -d $values -X GET ` # -v # verbose
echo "received '$key'"
exit;

#############################################
#ADD a new element
echo "***\nINSERT"
values="step=1&position=2&type=select&field=Titolo&extra=testingapi"
#values="step=1&element=1&type=number&content=checkingMyTests!&label=titolo"
#values="date=12-01-2014&description=test&user=paulie"
key=`$cmd $protocol://$host:$port/$resource -d $values -X POST ` # -v # verbose
echo "received key '$key'"
exit;

#############################################
#ADD a new element forcing the key
# WARNING: this works as an update if already exists
values="key=food&value=c4ppucc1n0"
# N.B. shuf is available in Ubuntu, not OsX
# INSTALLATO gshuf da coreutils (brew) e link a  "shuf" sul MAC
fix=`shuf -i 1000-50000 -n 1` # generate a random key
echo "***\nINSERT with key '$fix'"
#exec
id=`$cmd $protocol://$host:$port/$resource -d "$values&id=$fix" -X POST `
echo "received key '$id' ;) "


#############################################
#GET the full list
echo "***\nFULL LIST"
$cmd $protocol://$host:$port/$resource

#############################################
#GET the single element
echo "***\nGET the single element [ key '$key' ]"
$cmd $protocol://$host:$port/$resource/$key
echo "***\nGET the single element [ key '$id' ]"
$cmd $protocol://$host:$port/$resource/$id

#############################################
#DELETE an element
echo "***\nDELETE a single element [ key '$key' ]"
$cmd $protocol://$host:$port/$resource/$key -X DELETE
#echo "***\nDELETE non existing single element [ key 'a$key' ]"
#$cmd $protocol://$host:$port/$resource/a$key -X DELETE

#############################################
#UPDATE
echo "***\nUPDATE a single element [ key '$id' ]"
values="key=foodD&value=c0ff333"
put=`$cmd $protocol://$host:$port/$resource/$id -d "$values" -X PUT `
echo "TESTED put *$put*"

echo "***\n\nDONE"
