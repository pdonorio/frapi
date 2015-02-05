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


#############################################
# Create the api object
api = Api(app, catch_all_404s=True)

# You could define your error for the status code you prefer
#http://flask-restful.readthedocs.org/en/latest/extending.html#define-custom-error-messages

# Implement csv for download of tables purpose?
#http://flask-restful.readthedocs.org/en/latest/extending.html#response-formats

# Log to a different file or send email for errors or save it to db?
# #http://flask-restful.readthedocs.org/en/latest/extending.html#custom-error-handlers

#############################################
# === Setup the Api resource routing ===
# 
# This is where you tell the app what to do with requests
# For this resources make sure you create the table
# inside "before_first_request"

#api.add_resource(resources.GenericDBResource, '/test')

############
res = 'data'
api.add_resource(resources.DataList, '/' + res)
api.add_resource(resources.DataSingle, '/' + res + '/<string:data_key>')

############
res = 'webcontent'
api.add_resource(resources.HtmlContents, '/' + res)
api.add_resource(resources.HtmlContent, '/' + res + '/<string:data_key>')

############
res = 'news'
api.add_resource(resources.NewsFeeds, '/' + res)
api.add_resource(resources.NewsFeed, '/' + res + '/<string:data_key>')

############
res = 'steps'
api.add_resource(resources.Steps, '/' + res)
api.add_resource(resources.Step, '/' + res + '/<string:data_key>')

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

#############################################
# Test AUTH
    #api.add_resource(resources.LogUser, '/login')
