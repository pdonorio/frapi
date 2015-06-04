# -*- coding: utf-8 -*-
"""
The main flask app :)
"""

####################################
# Create app
from flask import Flask
app = Flask(__name__)
# and then add every other part

####################################
# log: is a good advice
from bpractices.logger import log
log.setup_instance(__name__, app.logger)

# Allow cross-domain requests for JS and Upload
from flask.ext.cors import CORS
CORS(app, headers=['Content-Type'])

####################################
# Application mode
import logging
from myapi import MODE, \
    TestingConfig, DevelopmentConfig, ProductionConfig
app.logger.critical('Running app in ' + MODE + ' mode')

if MODE == 'prod':
    app.logger.setLevel(logging.WARNING)
    from flask.ext.sqlalchemy import SQLAlchemy
    from flask_mail import Mail
    from werkzeug.contrib.fixers import ProxyFix

    # Config
    app.config.from_object(ProductionConfig)

    ####################################
    # Create database connection object
    db = SQLAlchemy(app)

    ####################################
    # Add email
    mail = None
    if not app.config['DEBUG']:
        mail = Mail(app)

    ####################################
    # Gunicorn fix
    app.wsgi_app = ProxyFix(app.wsgi_app)

elif MODE == 'dev':
    app.logger.setLevel(logging.INFO)
    app.config.from_object(DevelopmentConfig)

elif MODE == 'test':
    app.logger.setLevel(logging.DEBUG)
    app.config.from_object(TestingConfig)
