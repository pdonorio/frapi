# -*- coding: utf-8 -*-
"""
A package to define the top of available python API
"""

################## ## UPLOADER
# Directories
UPLOAD_FOLDER = '/uploads'
UPLOAD_RESOURCE = '/uploader'
# TO FIX - above could be the same?

# Command calls
INTERPRETER = 'python'
ZBIN = '/zoomify/processor/ZoomifyFileProcessor.py'
# Extensions
ALLOWED_EXTENSIONS = set(['tiff', 'png', 'jpg', 'jpeg'])
#, 'gif', 'txt', 'pdf',])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

################## ## FLASK APP configurations

# Import necessary data from environoment variables
# This is one of the most cool features in python
import os
MODE = os.environ.get('APP_MODE')

# Base config for all
class Config(object):
    # Upload max size
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

################################
class ProductionConfig(Config):
    DEBUG = False

################################
class DevelopmentConfig(Config):
    DEBUG = True

################################
class TestingConfig(Config):
    TESTING = True
