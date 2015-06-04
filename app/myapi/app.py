# -*- coding: utf-8 -*-
"""
The main flask app :)
"""

from flask import Flask
from myapi import MODE, \
    TestingConfig, DevelopmentConfig, ProductionConfig

####################################
# Create app
# and then add every other part
app = Flask(__name__)

####################################
# Application mode

if MODE == 'prod':
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
    print "Using development config"
    app.config.from_object(DevelopmentConfig)
elif MODE == 'test':
    app.config.from_object(TestingConfig)
