# -*- coding: utf-8 -*-

""" Experiments """

# // TO FIX
from myapi.routes import api, app

##################################
# CONF
import os
import glob
import json
# This Rethinkdb refernce is already connected at app init
from rdb.rdb_handler import r, RDBdefaults
from flask.ext.restful import fields, Resource, marshal, request
from bpractices.metaclasses import metaclassing

JSONS_PATH = 'jsonmodels'
JSONS_EXT = 'json'


##########################################
# ## Marshal
# http://flask-restful-cn.readthedocs.org/en/0.3.4/api.html#module-fields
def marshal_type(obj):
    mytype = fields.Raw
    if isinstance(obj, str) or isinstance(obj, unicode):
        mytype = fields.String
    elif isinstance(obj, int):
        mytype = fields.Integer
    return mytype


# // TO FIX:
# should be recursive for nested structures
def convert_to_marshal(data):
    mymarshal = {}
    # Case of dict
    for key, obj in data.iteritems():
        mymarshal[key] = marshal_type(obj)
    # Case of lists?
    return mymarshal


##########################################
# The generic resource
class MyResource(Resource, RDBdefaults):
    """ The json endpoint to rethinkdb class """

    schema = None
    template = None

    def get(self, myid='id'):
        return "TEST"

    def post(self):
        json_data = request.get_json(force=True)
        valid = False
        for key, obj in json_data.iteritems():
            if key in self.schema:
                valid = True
        if not valid:
            return self.template, 400

        marshal_data = marshal(json_data, self.schema, envelope='data')
        # print("Interpreted", marshal_data)

        # Rethinkdb base query
        base = r.db(self.db)
        # Create
        if self.table not in base.table_list().run():
            base.table_create(self.table).run()
        # Use the table
        query = base.table(self.table)
        # Execute the insert
        dbout = query.insert(marshal_data['data']).run()
        # Get the id
        myid = dbout['generated_keys'].pop()


# # // TO FIX:
# # redirect to GET method of this same endpoint, instead
#         address = api.url_for(self.__class__, myid=myid)
#         return redirect(address)

        # Recover the element to check we are done
        document = query.get(myid).run()
        document.pop('id')
        return document

##########################################
# Read model template

for fileschema in glob.glob(os.path.join(JSONS_PATH, "*") + "." + JSONS_EXT):
    mytemplate = {}
    print("FILE is " + fileschema)
    with open(fileschema) as f:
        mytemplate = json.load(f)

    ##########################################
    # Build current model resource
    reference_schema = convert_to_marshal(mytemplate)

    # Name for the class. Remove path and extension (json)
    label = os.path.splitext(os.path.basename(fileschema))[0].lower()
    new_attributes = {
        "schema": reference_schema,
        "template": mytemplate,
        "table": label,
    }
    newclass = metaclassing(MyResource, label, new_attributes)

    api.add_resource(newclass,
                     '/' + label,
                     '/' + label + '/<myid>')
