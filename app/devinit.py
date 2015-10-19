# -*- coding: utf-8 -*-
""" Creating some data for development testing """

from rdb.rdb_handler import r, RDB_HOST, RDB_PORT, APP_DB
from rdb.get_models import models

# Connection and creates
conn = r.connect(host=RDB_HOST, port=RDB_PORT)
print("Connected")
# If database already exists?
exists = True
try:
    r.db(APP_DB).info().run(conn)
    print("Data already exists")
except r.errors.RqlRuntimeError, e:
    exists = False

# Do things if not
if not exists:
    r.db_create(APP_DB).run(conn)
    print("Creating " + APP_DB)
    conn.use(APP_DB)
    print("Using db " + APP_DB)

    for (name, model) in models.iteritems():
        print("Creating table " + model.table)
        r.table_create(model.table).run(conn)

    # Insert
    admin = {"activation":1, "role":999,
        "email":"pdonoriodemeo@gmail.com", \
        "name":"Paulie", "surname":"D", \
        "token":"3a3cc3d78759da799d600678734025427b08fa69fb73e79f91d7831c1ec3f39e" \
    }
    r.table(models['Account'].table).insert(admin).run(conn)

    # Some documents?

print "Done"
