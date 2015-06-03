# -*- coding: utf-8 -*-
""" Remove slave servers which do not exists anymore """

##########################
# Load libraries
from rdb.rdb_handler import r, RDB_HOST, RDB_PORT
ADMIN_DB = 'rethinkdb'

##########################
# Try connection
try:
    conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=ADMIN_DB)
except r.errors.RqlDriverError, e:
    print "No connection!\n", e.__str__()
    exit(1)
print "Connected"

##########################
# Select table
q = r.table("current_issues").run(conn)

##########################
# For each issue
for i in q:
    if 'disconnected_server' in i['info']:
        s_name = i['info']['disconnected_server']
        print "Failed server: ", s_name

        # Search the original UUID of this server
        cursor = r.table("server_config").filter({'name':s_name}).run(conn)
        # Only one result from this
        for j in cursor:
            print "Removing", j['id']
            r.table('server_config').get(j['id']).delete().run(conn)
