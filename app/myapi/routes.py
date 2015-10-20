# -*- coding: utf-8 -*-
"""
Define the routes with the written resources.

Since my assumption is that i am working with Databases,
i will need to create db and tables if they are not available yet!
"""

# Get the  flask server app
# where i already added resources
# routes are needed for them
from myapi.app import app
# Use the flask plugin for a more complex yet powerful restful service
from flask.ext.restful import Api
# Load the resources that have been created
from myapi import resources

#############################################
# Create the api object
api = Api(app, catch_all_404s=True)

# To Do in the future:

## You could define your error for the status code you prefer
#http://flask-restful.readthedocs.org/en/latest/extending.html#define-custom-error-messages
## Implement csv for download of tables purpose?
#http://flask-restful.readthedocs.org/en/latest/extending.html#response-formats
## Log to a different file or send email for errors or save it to db?
# #http://flask-restful.readthedocs.org/en/latest/extending.html#custom-error-handlers


#############################################
# === Setup the Api resource routing ===
# 
# This is where you tell the app what to do with requests
# For this resources make sure you create the table

## EXAMPLE:
#api.add_resource(resources.GenericDBResource, '/test')
## AUTH EXAMPLE:
#api.add_resource(resources.LogUser, '/login')

#FIXED_APIURL = '/api/v1.0'
FIXED_APIURL = ''

def resources_init(myresources):
    for name, content in myresources.iteritems():
        (resource_class, resource_name) = content
        #print resource_name, resource_class.__dict__

        # Add resource from ORM class
        api.add_resource(resource_class, \
        # 1. /resource      #GET
            FIXED_APIURL + '/' + resource_name, \
        # 2. /resource/:id  #POST
            FIXED_APIURL + '/' + resource_name + '/<string:data_key>')
        # Warning: due to restful plugin system,
        # methods get and get(value) require 2 different resources.
        # This is why we provide two times the same resource

        app.logger.info("Resource '" + resource_name + "' ["+name+"]: loaded")

# === Load each API resource ===
resources_init(resources.resources)

#################################################################
#################################################################
#################################################################
#################################################################

##################################
# Rethinkdb connection
import os
import rethinkdb as r
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015
DB = 'webapp'
TABLE = 'objtest'
FIELD = 'latest_timestamp'
params = {"host":RDB_HOST, "port":RDB_PORT}
r.connect(**params).repl()
base = r.db(DB)

##########################################
# Read model template
import glob, json
JSONS_PATH = 'jsonmodels'
JSONS_EXT = 'json'
for fileschema in glob.glob(os.path.join(JSONS_PATH, "*") + "." + JSONS_EXT):
    data = {}
    with open(fileschema) as f:
        data = json.load(f)
    print(data)
    break

##########################################
# Build current model
import re
myre = re.compile('^http[s]?://[^\.]+\..{2,}')
from flask.ext.restful import fields

def marshal_type(obj):
#http://flask-restful-cn.readthedocs.org/en/0.3.4/api.html#module-fields
    mytype = fields.Raw
    if isinstance(obj, str) or isinstance(obj, unicode):
        if myre.search(obj):
            mytype = fields.Url()#endpoint=obj, absolute=True)
        else:
            mytype = fields.String
    if isinstance(obj, int):
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

schema = convert_to_marshal(data)

##########################################
# Build resource
from flask.ext.restful import Resource, marshal
from flask import Flask, request

class Test(Resource):
    def post(self):
        json_data = request.get_json(force=True) # this issues Bad request
        print("Raw json", json_data)
        marshal_data = marshal(json_data, schema, envelope='data')
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

api.add_resource(Test, '/objtest')
