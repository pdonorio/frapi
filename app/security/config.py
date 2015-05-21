# -*- coding: utf-8 -*-
""" Configuration for securing application """

class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/test.db'
    SECRET_KEY = 'my-super-secret-keyword'
# Bug fixing for csrf problem via CURL/token
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    # TO FIX - with postgres
    DATABASE_URI = 'mysql://user@localhost/foo'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
