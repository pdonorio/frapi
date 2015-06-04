# -*- coding: utf-8 -*-
""" Public main for python restful api server """

# Load the pre-configured api with all services
from myapi.app import app

if __name__ == "__main__":
    # Launch the app
    app.run(host="0.0.0.0", debug=app.config['DEBUG'])
