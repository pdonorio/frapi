# -*- coding: utf-8 -*-
""" Configuration for securing application """

class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SECRET_KEY = 'my-super-secret-keyword'

    # Bug fixing for csrf problem via CURL/token
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):

    # Configuration data is given through environment variables
    import os
    USER = os.environ.get('DB_ENV_POSTGRES_USER')
    PW = os.environ.get('DB_ENV_POSTGRES_PASSWORD')
    DB = os.path.basename(os.environ.get('DB_NAME'))

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
