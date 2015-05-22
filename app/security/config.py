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
    # TO FIX - with postgres
    DATABASE_URI = 'mysql://user@localhost/foo'
    # Force token to last not more than one hour
    SECURITY_TOKEN_MAX_AGE = 3600

class DevelopmentConfig(Config):
    DEBUG = True
    #SECURITY_TOKEN_MAX_AGE = 60

class TestingConfig(Config):
    TESTING = True
