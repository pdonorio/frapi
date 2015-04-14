# -*- coding: utf-8 -*-

"""
# === APP MAIN FILE ===

Public main has to be somewhere.
Someone has to do the dirty work (LOL).

"""
# Log is a good advice
#from bpractices.logger import log

# Load the pre-configured api with all services
from myapi.routes import app
# Handle command line parameters
import sys, os

# === MAIN FUNCTION ===
if __name__ == "__main__":

    # First argument is to check if production
    debug = True
    if sys.argv.__len__() > 1:
        tmp = sys.argv[1]
        if tmp == 'disable':
            debug = False

    # Make a flask app for my API
    """
        Note: 'host' tells you who can access. 0.0.0.0 = all;
        'debug' tells the app to restart when code changes
        and should be off on production
    """

    crt = '/myssl/certs/server.crt'
    key = '/myssl/certs/server.key'

    # Multi thread this server
    #http://stackoverflow.com/a/28776624

    if os.path.isfile(crt) and os.path.isfile(key):
        print "HTTPS"
        app.run(host="0.0.0.0", debug=debug, threaded=True, ssl_context=(crt, key))
    else:
        app.run(host="0.0.0.0", debug=debug, threaded=True)
    print "Debug: ", debug

# === For future file configuration ===
# # Read conf files
# from bpractices.confreader import Configuration
# # === Read configurations ===
# conf = Configuration("simple.ini")
# #conf.get("iwant", "testa")
# a = conf.get("iwant", "test", skip_cache=True)
# b = conf.get("url", "bug_tracker")
