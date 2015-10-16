# -*- coding: utf-8 -*-

"""
RethinkDB python query betatester
"""

##################################
import os
import rethinkdb as r

##################################
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015
params = {"host":RDB_HOST, "port":RDB_PORT}
r.connect(**params).repl()

##################################
DB = 'webapp'
TABLE = 'stepscontent'

##################################
# SELECT ON TABLE
query = r.db(DB).table(TABLE)
# WHERE
query = query.filter({'step':1})

##################################
# CONTAINS (search one element in one array)
# query = query.filter(lambda row: row["values"].contains("Agen_4"))

# LAMBDA FILTER
query = query.filter(lambda row: \
    row["values"].contains(lambda key: \
        key.match("nv")))

##################################
# Use the query?
for obj in query.run():
    print(obj)
