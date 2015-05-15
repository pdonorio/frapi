# Load libraries
import rethinkdb as r

conn = r.connect(host="db", db='rethinkdb')

q = r.table("current_issues").run(conn)

# For each issue
for i in q:
    s_name = i['info']['disconnected_server']
    print "Failed server: ", s_name

    # Search the original UUID of this server
    cursor = r.table("server_config").filter({'name':s_name}).run(conn)
    # Only one result from this
    for j in cursor:
        print "Removing", j['id']
        r.table('server_config').get(j['id']).delete().run(conn)
