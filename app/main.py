# -*- coding: utf-8 -*-

"""
# === APP MAIN FILE ===

Public main has to be somewhere.
Someone has to do the dirty work (LOL).

"""

# Log is a good advice
from bpractices.logger import log

# Load the pre-configured api with all services
from myapi.routes import app

# TO FIX - add parameter for app init
    # which will connect and init, then exit

# === MAIN FUNCTION ===
if __name__ == "__main__":

    # Make a flask app for my API
    app.run(host="0.0.0.0", debug=True)
    # Note: host tells you who can access. 0.0.0.0 = all

# === For future file configuration ===
# # Read conf files
# from bpractices.confreader import Configuration
# # === Read configurations ===
# conf = Configuration("simple.ini")
# #conf.get("iwant", "testa")
# a = conf.get("iwant", "test", skip_cache=True)
# b = conf.get("url", "bug_tracker")
