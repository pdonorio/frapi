# -*- coding: utf-8 -*-
"""
A file uploader API via few python code lines!
note: also apply support for images zoomification.
"""

###########################################
# Handle files
import os, subprocess as shell, shutil
# Flask framework
from flask import request, redirect, url_for, abort, send_from_directory
from werkzeug import secure_filename
# Import html codes
import bpractices.htmlcodes as hcodes
# log is a good advice
from bpractices.logger import log
# Read costants
from myapi import UPLOAD_FOLDER, UPLOAD_RESOURCE, INTERPRETER, ZBIN, \
    allowed_file
# Restful class
from myapi.resources import GenericApiResource, abort
# Set log
logger = log.get_logger('upload')

###########################################

# TOFIX: use it
from shell.bash import PyShell

def zoomification(abs_file):

    # # Create command
    # cmd = "ls \n"

    # # # Execute command
    # myclass = PyShell()
    # myclass.add_command(cmd)
    # myclass.execute()

    # Make zoomify object and thumbnail
    logger.info("Elaborate image")
    # Proc via current shell
# FIX: with a shell package?
    cmd = [INTERPRETER, ZBIN, abs_file]
    proc = shell.Popen(cmd, stdout=shell.PIPE, stderr=shell.PIPE)
    out, err = proc.communicate()
    # Handle output
    if proc.returncode == 0:
        if out != None and out != "":
            logger.info("Comm output: " + out)
    else:
        logger.critical("Failed to process image " + abs_file + \
            ". Error: " + err)
        abort(hcodes.HTTP_BAD_REQUEST, "Could not process file")

###########################################
class UploadResource(GenericApiResource):

    endtype = 'path:file'    #http://stackoverflow.com/a/19876667/2114395

# TOFIX: define properties from API
    def __init__(self):
        """ Implement a parser for validating arguments of api """

        loc = ['headers', 'values'] #multiple locations
        print loc
        # self.parser.add_argument("pippo", \
        #     type=unicode, action='store', location=loc)

    def get(self, abs_file=None):

        logger.debug("Request: " + request.method)

# TOFIX: Request parse?
        if abs_file != None:
            logger.info("Should provide: "+ abs_file)
            return send_from_directory(UPLOAD_FOLDER, filename)

        # No key specified?
        return '''<!doctype html> <title>Upload</title> <h2>Uploader</h2>
            Empty: this is just for receiving!<br>''', hcodes.HTTP_OK_BASIC

    #######################
    # Save files
    # http://API/uploader
    def post(self):

        # Get file
        myfile = request.files['file']
# TOFIX: Request parse?
        if not myfile:
            abort(hcodes.HTTP_BAD_REQUEST, message='Unable to get file')

        # Clean filename
        filename = secure_filename(myfile.filename)
        logger.info("Received FILE request: " + filename)

        # Check allowed extension
        if not allowed_file(filename):
            abort(hcodes.HTTP_BAD_REQUEST, message="Extension not allowed")

        # Check file name
        abs_file = os.path.join(UPLOAD_FOLDER, filename)
        logger.info("A file allowed: "+ filename + ". Path: " +abs_file)

        # Check if already exists
        if os.path.exists(abs_file):
            #os.remove(abs_file) #DEBUG
            logger.warn("Already existing file: "+ abs_file)
            abort(hcodes.HTTP_BAD_REQUEST, message="File '"+ filename \
                +"' already exists! " + \
                "Please change your file name and retry.")

        # Save the file
        myfile.save(abs_file)

        return 'Yeah!'

# FIX: not working with restful
        # Default redirect is to 302 state, which makes client
        # think that response was unauthorized....
        # see http://dotnet.dzone.com/articles/getting-know-cross-origin
        return redirect(url_for('uploaded_file', filename='/' + filename),
            hcodes.HTTP_OK_BASIC)

    def delete(self, data_key):

# TOFIX: Request parse?
        filename = self.clean_parameter(data_key)
        print "TEST DATA KEY", data_key
        abs_file = os.path.join(UPLOAD_FOLDER, filename)
#TEST

        # Check file existence
        if not os.path.exists(abs_file):
            logger.critical("Not existing: "+ abs_file)
            abort(hcodes.HTTP_BAD_NOTFOUND, "File '"+ filename +"' not found. " + \
                "Please change your file name and retry.")

        # Remove zoomified directory
        filebase, fileext = os.path.splitext(abs_file)
        if os.path.exists(filebase):
            shutil.rmtree(filebase)
            logger.warn("Removed: "+ filebase +" [extension '"+fileext+"']")

        # Remove the real file
        os.remove(abs_file)
        logger.warn("Removed: "+ abs_file)

        return "Deleted", hcodes.HTTP_OK_NORESPONSE

