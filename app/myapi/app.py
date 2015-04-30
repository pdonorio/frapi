# -*- coding: utf-8 -*-
""" Beautiful and fun server API - thanks to ***flask*** """

# Flask app for the api handling
from flask import Flask, g, abort, request # 'g' obj is global share for app context, NOT REQUEST
# Handle opening and closing of my Database
from rdb.rdb_handler import RethinkConnection as db
# Import html codes
import bpractices.htmlcodes as hcodes
# Allow cross-domain requests for JS and Upload
from flask.ext.cors import CORS
# log is a good advice
from bpractices.logger import log

# === Create the app ===
app = Flask(__name__)

# config init
app.config.from_object(__name__)
# Only in debug mode?
CORS(app, headers=['Content-Type'])
# Create logger
log.setup_istance(None, app.logger)

#############################################
# === App setup ===

# Need a pool of connections: http://j.mp/1yNP4p0
def try_to_connect(create_db=False):
    try:
        app.logger.info("Creating the rdb object")
        g.rdb = db(create_db)
        if not create_db:
            g.rdb.default_database()
    except Exception:
        app.logger.error("Cannot connect")
        abort(hcodes.HTTP_INTERNAL_TIMEOUT,
            "Problem: no database connection could be established.")

# Data models from DB ORM
from rdb.get_models import models
tmp = db(True)
tmp.default_database()
for (name, model) in models.iteritems():
    print "Indexing: ", name
    tmp.define_model(model)
    # a = tmp.search()
    # print a
    # break
    #tmp.indexing()
    print "DEBUG: NOT AVAILABLE FOR NOW"
    break

# # Setup only first time,
# # before the first request
# @app.before_first_request
# def before_first_request():
#     # === Init logger for flask ===
#     app.logger.info("ONE TIME SETUP!")
#     # === Init database if not exists ===
#     try_to_connect(True)
#     g.rdb.indexing()

#     # === Init tables if not exist? ===
#     ## DataList and DataSingle share the same table
#     # tmp = resources.DataList(g.rdb)
#     # g.rdb.create_table()
#     # del tmp

# WHAT ELSE?

# === What to do BEFORE handling a request ===
@app.before_request
def before_request():
    app.logger.debug("Hello request")
    # === Connection ===
    #     The RethinkDB server doesn’t use a thread-per-connnection approach,
    #     so opening connections per request will not slow down your database.
    if not "rdb" in g:
        try_to_connect()
    # Database should be already connected in "before_first_request"
    # But the post method fails to find the object!


################################################
## I want API to respond only to my Proxy
## otherwise reject

# Find the current network this node is in
import os, re
SOCK = os.environ.get('DB_PORT')
# Only check first two numbers.
# Also the third one may change inside a big stack of container cluster.
reg = re.compile('([0-9]+\\.[0-9]+)\\.[0-9]+\\.')
match = reg.findall(SOCK)
mynet = ""
if match:
    # First 3 numbers of the IP
    mynet = match[0]
else:
    raise BaseException("No network environment available")

@app.before_request
def limit_remote_addr():
    ip = request.headers.getlist("X-Forwarded-Ip")[0]
    # Trust a proxy only if inside my private LAN network ;)
    if mynet not in ip:
        app.logger.warning("Rejected " + ip + " [expecting "+mynet+".*]")
        abort(403)  # Forbidden

# === What to do AFTER a single request ===
# @app.teardown_request
# def teardown_request(exception):
#     #app.logger.debug("Closing Api request")
