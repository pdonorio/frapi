# -*- coding: utf-8 -*-
"""
A package to define the top of available python API
"""

##################
## UPLOADER
##################
# Directories
UPLOAD_FOLDER = '/uploads'
UPLOAD_RESOURCE = '/uploader'
# Command calls
INTERPRETER = 'python'
ZBIN = '/zoomify/processor/ZoomifyFileProcessor.py'
# Extensions
ALLOWED_EXTENSIONS = set(['tiff', 'png', 'jpg', 'jpeg'])#, 'gif', 'txt', 'pdf',])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

##################
## FLASK APP
##################
class Config(object):
    # Upload max size
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
