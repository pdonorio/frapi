# -*- coding: utf-8 -*-
""" Configuration for python API application """

# Import necessary data from environoment variables
# This is one of the most cool features in python
import os
MODE = os.environ.get('APP_MODE')

"""
Flask Security endpoints:
/login
/logout
/register (should add fields)
/reset (send me a new password via email)
/change (change the current password)
/confirm (send a link to confirm the account)
"""

class Config(object):
    DEBUG = None
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SECRET_KEY = 'my-super-secret-keyword'

    # Bug fixing for csrf problem via CURL/token
    WTF_CSRF_ENABLED = False

    ## https://pythonhosted.org/Flask-Security/configuration.html

    # Adding a base to Flask Security endpoints (e.g. login, logout)
    SECURITY_URL_PREFIX = '/api/v1'
    # Others
    SECURITY_REGISTERABLE = True
    SECURITY_CONFIRMABLE = True
    SECURITY_LOGIN_WITHOUT_CONFIRMATION = False
    SECURITY_CHANGEABLE = True
    SECURITY_RECOVERABLE = True
    SECURITY_TRACKABLE = True
    SECURITY_PASSWORDLESS = False
    # Email
    MAIL_SERVER = 'mail.gandi.net'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''
    MAIL_DEFAULT_SENDER = 'noreply@development.it'
    # Security email
    SECURITY_EMAIL_SENDER = MAIL_DEFAULT_SENDER
    SECURITY_EMAIL_SUBJECT_REGISTER = 'Welcome to our project'
    SECURITY_EMAIL_SUBJECT_CONFIRM = 'One more step: Please confirm your email'
    SECURITY_CONFIRM_EMAIL_WITHIN = '2 days'
    SECURITY_RESET_PASSWORD_WITHIN = '2 days'

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

class DevelopmentConfig(Config):

    DEBUG = True
    #SECURITY_TOKEN_MAX_AGE = 60
    MAIL_DEBUG = True
    MAIL_MAX_EMAILS = 10

class TestingConfig(Config):

    TESTING = True
    MAIL_SUPPRESS_SEND = True
