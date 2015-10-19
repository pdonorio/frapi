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
import os
import rethinkdb as r
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015
params = {"host":RDB_HOST, "port":RDB_PORT}
r.connect(**params).repl()
DB = 'webapp'
TABLE = 'objtest'
FIELD = 'latest_timestamp'

##########################################
from flask.ext.restful import Resource
from flask import Flask, request

class Test(Resource):
    def post(self):
        json_data = request.get_json(force=True) # this issues Bad request
        print("TESTING", json_data)
        base = r.db(DB)
        # # CREATE?
        # base.table_create(TABLE).run()
        query = base.table(TABLE)
        query.insert(json_data).run()
        for document in query.run():
            print(document)
#query = query.filter({'step':1})
        #return json_data
        return document

api.add_resource(Test, '/objtest')
