# -*- coding: utf-8 -*-

"""
Convert old schema to new cool and fancy json automatic documents
"""

from rdb.rdb_handler import RethinkConnection as db
from rdb.query import RDBquery

# Connection
connect = db(True)

# Query Rethinkdb via obj
t1 = "stepstemplate"
t2 = "steps"
tin = "newsteps"
query = RDBquery()
qt1 = query.get_table_query(t1)
qt2 = query.get_table_query(t2)
qtin = query.get_table_query(tin)
qtin.delete().run()

############################
# FIND
data = qt1.group("step").run()
for step in list(data):
    new = {"step": None, "fields": None}
    myfilter = {'step': step}
    print("*** STEP: %s" % step)

    # Single step elements
    element = list(qt2.filter(myfilter).run()).pop()
    new['step'] = {"num": step, "name": element['label'],
                   "desc": element['description']}

    # Singles steps fields
    tmp = []
    fields = list(qt1.filter(myfilter).run())
    sorted_fields = sorted(fields, key=lambda k: k['position'])
    for row in sorted_fields:
        print(row['position'])
        if 'extra' not in row:
            row['extra'] = None
        tmp.append({
            "name": row['field'],
            "position": row['position'],
            "required": row['required'],
            "type": row['type'],
            "options": row['extra'],
        })
    new["fields"] = tmp

    # INSERT
    print(new)
    qtin.insert(new).run()
