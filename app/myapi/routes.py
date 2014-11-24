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
from rdb.rdb_handler import RethinkConnection as db

# Create the api object
api = Api(app)

#############################################
# === Setup the Api resource routing ===
# 
# This is where you tell the app what to do with requests
# For this resources make sure you create the table
# inside "before_first_request"
#############################################

#api.add_resource(resources.GenericDBResource, '/test')
api.add_resource(resources.DataList, '/data')
api.add_resource(resources.DataSingle, '/data/<string:data_key>')

#############################################
# === App setup ===
# Do db and tables setup only first time,
# before the first request

@app.before_first_request
def before_first_request():
    # === Init database if not exists ===
    app.logger.info("Trying to setup database at run time")
    init_db = db(True)

    # === Init tables if not exist ===
    # DataList and DataSingle share the same table
    tmp = resources.DataList(init_db)
    init_db.create_table()
    del tmp

    # Test AUTH
    #api.add_resource(resources.LogUser, '/login')
