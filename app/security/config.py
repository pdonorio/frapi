# -*- coding: utf-8 -*-
""" Configuration for python API application """

# Import necessary data from environoment variables
# This is one of the most cool features in python
import os
MODE = os.environ.get('APP_MODE')

class Config(object):
    DEBUG = None
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SECRET_KEY = 'my-super-secret-keyword'

    # Bug fixing for csrf problem via CURL/token
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):

    DEBUG = False

    try:
        # Configuration data is given through environment variables
        USER = os.environ.get('DB_ENV_POSTGRES_USER')
        PW = os.environ.get('DB_ENV_POSTGRES_PASSWORD')
        DB = os.path.basename(os.environ.get('DB_NAME'))
    except AttributeError, e:
        print "No configuration found"
        USER = ""
        PW = ""
        DB = ""

    # Postgres connection
    SQLALCHEMY_DATABASE_URI = "postgresql://"+ USER +":"+ PW +"@"+ DB +"/"+ USER

    # Force token to last not more than one hour
    SECURITY_TOKEN_MAX_AGE = 3600
    # Add security to password
    ##https://pythonhosted.org/Flask-Security/configuration.html
    SECURITY_PASSWORD_HASH = "pbkdf2_sha512"
    SECURITY_PASSWORD_SALT = "ifiwantobeinproductionihavetousesecretsalt"

    #SECURITY_EMAIL_SENDER = "noreply@PROJECT"

class DevelopmentConfig(Config):
    DEBUG = True
    #SECURITY_TOKEN_MAX_AGE = 60

class TestingConfig(Config):
    TESTING = True
