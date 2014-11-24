# -*- coding: utf-8 -*-
"""
Define the routes with the written resources.

Since my assumption is that i am working with Databases,
i will need to create db and tables if they are not available yet!
"""

# Get the  flask server app
# where i already added resources
# routes are needed for them
from myapi.app import app, log, g, try_to_connect
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

    # init logger for flask
    log.setup_istance(None, app.logger)
    app.logger.info("ONE TIME SETUP!")

    # === Init database if not exists ===
    try_to_connect(True)

    # === Init tables if not exist ===

    # DataList and DataSingle share the same table
    tmp = resources.DataList(g.rdb)
    g.rdb.create_table()
    del tmp
##############################################################
##############################################################

    # Test AUTH
    #api.add_resource(resources.LogUser, '/login')
