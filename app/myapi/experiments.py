# -*- coding: utf-8 -*-

""" Experiments """

##################################
# CONF
import glob, json, os #, re
import rethinkdb as r
from flask.ext.restful import fields, Resource, marshal
from flask import Flask, request

JSONS_PATH = 'jsonmodels'
JSONS_EXT = 'json'

##################################
# Rethinkdb connection
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015
#myre = re.compile('^http[s]?://[^\.]+\..{2,}')
params = {"host":RDB_HOST, "port":RDB_PORT}
r.connect(**params).repl()

##########################################
# Marshal STUFF
def marshal_type(obj):
#http://flask-restful-cn.readthedocs.org/en/0.3.4/api.html#module-fields
    mytype = fields.Raw
    if isinstance(obj, str) or isinstance(obj, unicode):
        mytype = fields.String
        #if myre.search(obj):
# // TO FIX:
# what about default values
    elif isinstance(obj, int):
        mytype = fields.Integer

    return mytype

def convert_to_marshal(data):
    ## recursive?
    mymarshal = {}
    # Case of dict
    for key, obj in data.iteritems():
        mymarshal[key] = marshal_type(obj)
    # Case of lists?
    print(mymarshal)
    return mymarshal

##########################################
# The generic resource
class MyResource(Resource):

    schema = None
    table = 'test'
    db = 'webapp'
    order = 'latest_timestamp'

    def post(self):
        json_data = request.get_json(force=True) # this issues Bad request
        print("Raw json", json_data)
        valid = False
        for key, obj in json_data.iteritems():
            if key in self.schema:
                valid = True
# // TO FIX:
# How to return the schema?
        if not valid:
            print("FAIL")
            return None

        marshal_data = marshal(json_data, self.schema, envelope='data')
        print("Interpreted", marshal_data)

        # Rethinkdb base query
        base = r.db(self.db)
        # CREATE?
# NOTE: only for POST/PUT ?
        if self.table not in base.table_list().run():
            base.table_create(self.table).run()

        query = base.table(self.table)

        # Execute the insert
        dbout = query.insert(marshal_data['data']).run()

        # GET THE ID
        myid = dbout['generated_keys'].pop()

# // TO FIX:
# redirect to GET method of this same endpoint, instead
        # Recover the element to check we are done
        document = query.get(myid).run()
        document.pop('id')
        return document

##########################################
# Read model template

for fileschema in glob.glob(os.path.join(JSONS_PATH, "*") + "." + JSONS_EXT):
    data = {}
    print("FILE is " + fileschema)
    with open(fileschema) as f:
        data = json.load(f)

    ##########################################
    # Build current model resource
    reference_schema = convert_to_marshal(data)

    class Test(MyResource):
        schema = reference_schema
        table = 'objtest'

    break
