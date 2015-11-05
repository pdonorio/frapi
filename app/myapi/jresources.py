# -*- coding: utf-8 -*-

""" Experiments """

# CONF
import os
import glob
import json
# This Rethinkdb refernce is already connected at app init
from rdb.query import RDBquery
from flask.ext.restful import fields, Resource, marshal, request
from bpractices.metaclasses import metaclassing
from flask.ext.restful import url_for
from flask import redirect

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
class MyResource(Resource, RDBquery):
    """ The json endpoint to rethinkdb class """

    schema = None
    template = None

    def get(self, data_key=None):
        (count, data) = self.get_content(data_key)
# // TO FIX:
# Marshal?
        return data

    def post(self):
        json_data = request.get_json(force=True)
        valid = False
        for key, obj in json_data.iteritems():
            if key in self.schema:
                valid = True
        if not valid:
            return self.template, 400

        marshal_data = marshal(json_data, self.schema, envelope='data')
        myid = self.insert(marshal_data['data'])

# # // TO FIX:
# # redirect to GET method of this same endpoint, instead
        address = url_for(self.table, data_key=myid)
        return redirect(address)

##########################################
# Read model template


mytemplate = {}
json_autoresources = {}
for fileschema in glob.glob(os.path.join(JSONS_PATH, "*") + "." + JSONS_EXT):
    # Build current model resource
    with open(fileschema) as f:
        mytemplate = json.load(f)
    reference_schema = convert_to_marshal(mytemplate)

    # Name for the class. Remove path and extension (json)
    label = os.path.splitext(os.path.basename(fileschema))[0].lower()
    # Dynamic attributes
    new_attributes = {
        "schema": reference_schema,
        "template": mytemplate,
        "table": label,
    }
    # Generating the new class
    newclass = metaclassing(MyResource, label, new_attributes)
    # Using the same structure i previously used in resources:
    # resources[name] = (new_class, data_model.table)
    json_autoresources[label] = (newclass, label)
