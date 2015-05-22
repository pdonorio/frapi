# -*- coding: utf-8 -*-
"""
The main flask app
"""

from flask import Flask
from security.config import DevelopmentConfig, ProductionConfig
from flask.ext.sqlalchemy import SQLAlchemy
from security.mailer import mailer

####################################
DEBUG = True

####################################
# Create app
app = Flask(__name__)

####################################
# Conf
if DEBUG:
    print "Using development config"
    app.config.from_object(DevelopmentConfig)
else:
    app.config.from_object(ProductionConfig)

####################################
# Create database connection object
db = SQLAlchemy(app)

####################################
# Add email
if not DEBUG:
    mailer(app)
