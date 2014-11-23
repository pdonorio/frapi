rm -rf docs
#pycco -p *py **/*py */*/*py */*/*/*py

for file in `find ./ -name "*.py"`;
do
    name=`basename $file`

    #skip init files
    pref=`echo $name | sed 's/\.py$//'`
    if [ $pref = "__init__" ]; then continue; fi

    pycco $file
done
