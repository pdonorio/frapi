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

logger = log.get_logger('upload')

###########################################
# Save files
# http://API/uploader
#@app.route(UPLOAD_RESOURCE, methods=['GET', 'POST'])
def upload_file():

    logger.info("Normal request: " + request.method)

    if request.method == 'GET':

        return '''
        <!doctype html>
        <title>Uploader</title> <h2>Uploader</h2> Empty. Just for receiving!<br>
        '''

    if request.method == 'POST':

        myfile = request.files['file']
        logger.info("Received FILE request")

        if myfile:
            filename = secure_filename(myfile.filename)

            # Check allowed extension
            if not allowed_file(filename):
                abort(hcodes.HTTP_BAD_REQUEST, "Extension not allowed")

            # Check file name
            abs_file = os.path.join(UPLOAD_FOLDER, filename)
            logger.info("A file allowed: "+ filename + ". Path: " +abs_file)

            if os.path.exists(abs_file):

# #####################
# # DEBUG
#                 os.remove(abs_file)
# #####################

                logger.warn("Already existing file: "+ abs_file)
                abort(hcodes.HTTP_BAD_REQUEST, "File '"+ filename +"' already exists. " + \
                    "Please change your file name and retry.")

            # Save the file
            myfile.save(abs_file)

# TO FIX with a shell package?
            # Make zoomify object and thumbnail
            logger.info("Elaborate image")
            # Proc via current shell
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

            # Default redirect is to 302 state, which makes client
            # think that response was unauthorized....
            # see http://dotnet.dzone.com/articles/getting-know-cross-origin
            return redirect(url_for('uploaded_file', filename='/' + filename),
                hcodes.HTTP_OK_BASIC)

###########################################
# http://API/uploader/filename
#@app.route(UPLOAD_RESOURCE + '/<filename>', methods=['GET', 'DELETE'])
def uploaded_file(filename):

    logger.info("Specific request: " + request.method + ", " + filename)

    abs_file = os.path.join(UPLOAD_FOLDER, filename)

    if request.method == 'DELETE':

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

    # To get?
    elif request.method == 'GET':
        logger.info("Should provide: "+ abs_file)
        return send_from_directory(UPLOAD_FOLDER, filename)

    return ''' <!doctype html> <title>Uploader</title> Empty<br> '''
