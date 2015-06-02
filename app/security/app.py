# -*- coding: utf-8 -*-
"""
The main flask app
"""

from flask import Flask
from security.config import MODE, \
    TestingConfig, DevelopmentConfig, ProductionConfig
from flask.ext.sqlalchemy import SQLAlchemy
from security.mailer import mailer

####################################
# Create app
app = Flask(__name__)

####################################
# Conf
if MODE == 'dev':
    print "Using development config"
    app.config.from_object(DevelopmentConfig)
elif MODE == 'prod':
    app.config.from_object(ProductionConfig)
elif MODE == 'test':
    app.config.from_object(TestingConfig)

####################################
# Create database connection object
db = SQLAlchemy(app)

####################################
# Add email
if not app.config['DEBUG']:
    mailer(app)
