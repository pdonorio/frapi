# -*- coding: utf-8 -*-
"""
The main flask app
"""

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from security.mailer import mailer
from security.config import DevelopmentConfig

####################################
# Create app
app = Flask(__name__)

####################################
# Conf
app.config.from_object(DevelopmentConfig)

####################################
# Create database connection object
db = SQLAlchemy(app)

####################################
# Add email
mailer(app)
