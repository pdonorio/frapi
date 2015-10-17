# -*- coding: utf-8 -*-
""" Configuration for securing application """

# #########################################
# ## Read a configuration
# CONFIG_FILE = 'confs/config.ini'
# SECTION = 'opbeat'
# import ConfigParser as configparser

#########################################
## Create configurations objects

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
    USER = os.environ.get('DB_ENV_POSTGRES_USER', 'test')
    PW = os.environ.get('DB_ENV_POSTGRES_PASSWORD', '')
    DB = os.path.basename(os.environ.get('DB_NAME', 'test'))

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

################
    # ## OPBEAT
    # config = configparser.RawConfigParser() # Make sure configuration is case sensitive
    # config.optionxform = str
    # config.read(CONFIG_FILE)
    # if SECTION not in config.sections():
    #     raise Exception("No configuration file for '%s'" % SECTION)
    # # for key, value in config.items(SECTION):
    # #     print(key, value)
    # OPBEAT_ORG = config.get(SECTION, 'org')
    # OPBEAT_APP = config.get(SECTION, 'app')
    # OPBEAT_BEAR = config.get(SECTION, 'bear')
    # OPBEAT_RELURL = config.get(SECTION, 'url').replace('\n', '')
    # ## OPBEAT
################

class TestingConfig(Config):
    TESTING = True
