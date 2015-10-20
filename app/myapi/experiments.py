# -*- coding: utf-8 -*-

""" Experiments """

##################################
# CONF
import glob, json, os, re
import rethinkdb as r
from flask.ext.restful import fields, Resource, marshal
from flask import Flask, request

JSONS_PATH = 'jsonmodels'
JSONS_EXT = 'json'
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015
DB = 'webapp'
TABLE = 'objtest'
FIELD = 'latest_timestamp'
#myre = re.compile('^http[s]?://[^\.]+\..{2,}')

##################################
# Rethinkdb connection
params = {"host":RDB_HOST, "port":RDB_PORT}
r.connect(**params).repl()
base = r.db(DB)

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
        query = base.table(TABLE)

        # CREATE?
        #base.table_create(TABLE).run()

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

    break
