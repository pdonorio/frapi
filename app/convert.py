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
query = RDBquery()
qt1 = query.get_table_query(t1)
qt2 = query.get_table_query(t2)

############################
# ## QUERIES
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

    print(new)
# ## QUERIES
############################


"""
"fields": [
    {"name": "a num", "position": 4, "type": "int", "required": 1},
    {"name": "a list", "position": 1, "type": "list",
        "options": ["one",2,"three"] },
    {"name": "a field", "position": 3, "type": "str"},
    {"name": "default", "position": 2}
],
"""
