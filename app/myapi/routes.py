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

# Create the api object
api = Api(app)

# === Init database if not exists ===
from rdb.rdb_handler import RethinkConnection as db
app.logger.info("Trying to setup database at run time")
init_db = db(True)

#############################################
# === Setup the Api resource routing ===
# 
# This is where you tell the app what to do with requests
#############################################

#api.add_resource(resources.GenericDBResource, '/test')
api.add_resource(resources.DataList, '/data')
api.add_resource(resources.DataSingle, '/data/<string:data_key>')

# === Init tables if not exist ===
# DataList and DataSingle share the same table
tmp = resources.DataList(init_db)
init_db.create_table()
del tmp

# Test AUTH
#api.add_resource(resources.LogUser, '/login')
