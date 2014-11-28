# -*- coding: utf-8 -*-
""" Beautiful and fun server API - thanks to ***flask*** """

# Log is a good advice
from bpractices.logger import log
# Flask app for the api handling
from flask import Flask, g, abort
    # The g obj is the global share for app context (not request!)
    # http://flask.pocoo.org/docs/0.10/api/#flask.g
# Handle opening and closing of my Database
from rdb.rdb_handler import RethinkConnection as db

# === Create the app ===
app = Flask(__name__)
# config init
app.config.from_object(__name__)
# Allow cross-domain request for DEBUG?
from flask.ext.cors import CORS
cors = CORS(app)

# Need a pool of connections: http://j.mp/1yNP4p0
def try_to_connect(create_db=False):
    try:
        app.logger.info("Creating the rdb object")
        g.rdb = db(create_db)
    except Exception:
        app.logger.error("Cannot connect")
        abort(503, "Problem: no database connection could be established.")

# === What to do BEFORE handling a request ===
@app.before_request
def before_request():
    """
    Connect to database of choise. For example RethinkDB ;) In this case:
    ## Best practices:
    **Managing connections: a connection per request**
    The RethinkDB server doesn’t use a thread-per-connnection approach,
    so opening connections per request will not slow down your database.
    """

    app.logger.debug("Hello request")

    # === Connection ===
    # Database should be already connected in "before_first_request"
    if not "rdb" in g:
        try_to_connect()

# === What to do AFTER a single request ===
# @app.teardown_request
# def teardown_request(exception):
#     """
#     I don't need to close the connection actually,
#     because the Borg mechanism gives me the same object every time
#     """
#     #app.logger.debug("Closing Api request")
#     empty = None
#     # what to do with eventual exception? Log?
#     #g.rdb.close()
