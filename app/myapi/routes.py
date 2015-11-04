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

################################################################
import json
from flask import make_response


# from flask.ext.restful import Api as RestfulApi

# def unavailable_output(data, code, headers=None):
#     return make_response("Application type unavailable", 400)

# def output_json(data, code, headers=None):
#     """Makes a Flask response with a JSON encoded body"""
#     resp = make_response(json.dumps(data), code)
#     resp.headers.extend(headers or {})
#     return resp

# class Api(RestfulApi):
#     def __init__(self, *args, **kwargs):
#         super(Api, self).__init__(*args, **kwargs)
#         self.representations = {
#             'text/html': unavailable_output,
#             'text/csv': unavailable_output,
#             'application/xml': unavailable_output,
#             'application/json': output_json,
#         }

#############################################
# Create the api object
api = Api(app, catch_all_404s=True)

#############################################
# === Setup the Api resource routing ===

# This is where you tell the app what to do with requests
# For this resources make sure you create the table

FIXED_APIURL = ''


def resources_init(myresources):
    for name, content in myresources.iteritems():
        (rclass, rname) = content
        # print rname, rclass.__dict__

        # Add resource from ORM class
        api.add_resource(rclass,
                         FIXED_APIURL + '/' + rname,
                         FIXED_APIURL + '/' + rname + '/<string:data_key>')
        # Warning: due to restful plugin system,
        # methods get and get(value) require 2 different resources.
        # This is why we provide two times the same resource

        app.logger.info("Resource '" + rname + "' [" + name + "]: loaded")

# === Load each API resource ===
resources_init(resources.resources)
