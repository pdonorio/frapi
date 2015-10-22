# -*- coding: utf-8 -*-

""" Experiments """

from myapi.routes import api, app

##################################
# CONF
import glob, json, os #, re
import rethinkdb as r
from flask.ext.restful import fields, Resource, marshal
from flask import Flask, request, redirect, url_for

JSONS_PATH = 'jsonmodels'
JSONS_EXT = 'json'

##################################
# Rethinkdb connection
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015 # this is ugly :(
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
    template = None
    table = 'test'
    db = 'webapp'
    order = 'latest_timestamp'

    def get(self, myid='id'):
        return "TEST"

    def post(self):
        json_data = request.get_json(force=True) # this issues Bad request
        #print("Raw json", json_data)

        valid = False
        for key, obj in json_data.iteritems():
            if key in self.schema:
                valid = True
        if not valid:
            return self.template, 400

        marshal_data = marshal(json_data, self.schema, envelope='data')
        #print("Interpreted", marshal_data)

        # Rethinkdb base query
        base = r.db(self.db)
        # Create
        if self.table not in base.table_list().run():
            base.table_create(self.table).run()
        # Use the table
        query = base.table(self.table)
        # Execute the insert
        dbout = query.insert(marshal_data['data']).run()
        # Get the id
        myid = dbout['generated_keys'].pop()

        address = api.url_for(self.__class__, myid=myid)
        return redirect(address)

# // TO FIX:
# redirect to GET method of this same endpoint, instead
        # Recover the element to check we are done
        document = query.get(myid).run()
        document.pop('id')
        return document

##########################################
# Read model template

for fileschema in glob.glob(os.path.join(JSONS_PATH, "*") + "." + JSONS_EXT):
    mytemplate = {}
    #print("FILE is " + fileschema)
    with open(fileschema) as f:
        mytemplate = json.load(f)

    ##########################################
    # Build current model resource
    reference_schema = convert_to_marshal(mytemplate)

    class ObjTest(MyResource):
        schema = reference_schema
        template = mytemplate
        table = 'objtest'

    entity = ObjTest.__name__.lower()
    api.add_resource(ObjTest, \
        '/' + entity, \
        '/' + entity + '/<myid>')
    break
