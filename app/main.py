# -*- coding: utf-8 -*-

""" # === APP MAIN FILE ===
Public main and server proxy
"""

# Handle command line parameters
import sys
import os
# Load the pre-configured api with all services
from myapi.routes import app
# Gunicorn fix
from werkzeug.contrib.fixers import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)


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
