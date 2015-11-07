# -*- coding: utf-8 -*-

"""
Convert old schema to new cool and fancy json automatic documents
"""

from rdb.rdb_handler import RethinkConnection as db
from rdb.query import RDBquery

mytable = "stepstemplate"

# Connection
connect = db(True)

# Query Rethinkdb via obj
query = RDBquery().get_table_query(mytable)
# Get all table
data = query.run()
# ##query = query.get_all(myid, index='id')
# Debug old
tmp = list(data)
print(tmp[0])

# {u'hash': u'4f73502f', u'extra': None, u'latest_ipaddress': u'217.133.58.250', u'required': u'0', u'field': u'Notes', u'step': 3, u'latest_timestamp': 1429100708.822178, u'position': 7, u'type': 0, u'id': u'1cd435fd-d37c-44e7-b981-40f4a582c917'}
