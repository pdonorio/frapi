# -*- coding: utf-8 -*-
"""
Define the routes with the written resources
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

# === Setup the Api resource routing ===

api.add_resource(resources.GenericDBResource, '/test')
api.add_resource(resources.DataList, '/data')
api.add_resource(resources.DataSingle, '/data/<string:data_key>')

# Test AUTH
#api.add_resource(resources.LogUser, '/login')
