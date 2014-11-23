
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
    cmd="ssh $1 -i /opt/fsshare/k/abc -o 'StrictHostKeyChecking no'"

    # Unset any authentication key
    out=$($cmd rethinkdb admin unset auth 2>&1)
    # Generate a secure key for db connection
    key=$(generatekey)
    echo "Security key for this session: *$key*"
    sleep 2
    # Set the new key
    out=$($cmd rdbauth $key 2>&1)
    echo "Security raised"

    # Save to future bash use
    echo "SECRETKEYAUTH='$key'" >> /root/.bashrc
    #export SECRETKEYAUTH="$key"
}

secure_server "db"
echo "password:"
echo $SECRETKEYAUTH

# Ulteriore sicurezza:
#
# utente root con password e ssh disabilitato
# utente normale (no privilegi) con ssh in chiave
# fare ssh con normale e poi su con passw e poi usare docker :)
