# -*- coding: utf-8 -*-

""" # === APP MAIN FILE ===
Public main and server proxy
"""

# Load the pre-configured api with all services
#from myapi.routes import app
from myapi.experiments import app
# Handle command line parameters
import sys, os
# Gunicorn fix
from werkzeug.contrib.fixers import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)

# Log is a good advice
#from bpractices.logger import log

# === MAIN FUNCTION ===
if __name__ == "__main__":

    # First argument is to check if production
    debug = True
    if sys.argv.__len__() > 1:
        tmp = sys.argv[1]
        if tmp == 'disable':
            debug = False
    print "Debug: ", debug

    crt = '/myssl/certs/server.crt'
    key = '/myssl/certs/server.key'

    if os.path.isfile(crt) and os.path.isfile(key):
        print "HTTPS"
        app.run(host="0.0.0.0", debug=debug, ssl_context=(crt, key))
    else:
        app.run(host="0.0.0.0", debug=debug)

# === For future file configuration ===
# # Read conf files
# from bpractices.confreader import Configuration
# # === Read configurations ===
# conf = Configuration("simple.ini")
# #conf.get("iwant", "testa")
# a = conf.get("iwant", "test", skip_cache=True)
# b = conf.get("url", "bug_tracker")
