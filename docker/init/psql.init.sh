#!/bin/bash

conf='/var/lib/postgresql/data/pg_hba.conf'
## http://www.postgresql.org/docs/9.1/static/auth-pg-hba-conf.html

echo "Changing access"
echo "" > $conf
#echo "local   $POSTGRES_USER  $POSTGRES_USER  trust" >> $conf  #ONLY DEBUG
echo "hostnossl       $POSTGRES_USER  $POSTGRES_USER  172.17.0.0/16   password" >> $conf
echo "DONE"

## This is done through environment variables

# echo "******CREATING DATABASE******"
# gosu postgres postgres --single << EOSQL
# CREATE USER docker WITH SUPERUSER PASSWORD 'test';
# #CREATE ROLE docker CREATEDB LOGIN PASSWORD 'test';
# # CREATE DATABASE docker;
# # CREATE USER docker WITH ENCRYPTED PASSWORD 'test';
# # GRANT ALL PRIVILEGES ON DATABASE docker to docker;
# EOSQL
