# -*- coding: utf-8 -*-
"""
A file uploader API via few python code lines!
note: also apply support for images zoomification.
"""

###########################################
# Handle files
import os, subprocess as shell, shutil
# Flask framework
from flask import Flask, request, redirect, url_for, abort, send_from_directory
from flask.ext.cors import CORS
from werkzeug import secure_filename
# Import html codes
import bpractices.htmlcodes as hcodes
# log is a good advice
from bpractices.logger import log, logging

# TO FIX - move to __init__
# Define directory?
UPLOAD_FOLDER = '/uploads'
UPLOAD_RESOURCE = '/uploader'

INTERPRETER = 'python'
ZBIN = '/zoomify/processor/ZoomifyFileProcessor.py'

app = Flask(__name__)
CORS(app, headers=['Content-Type']) #, resources={r"/uploader*": {"origins": "*"}})

log.setup_instance(None, app.logger)
app.logger.setLevel(logging.INFO)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

###########################################
# Extensions
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# TO FIX - requests should end with /

###########################################
# Save files
# http://API/uploader
@app.route(UPLOAD_RESOURCE, methods=['GET', 'POST'])
def upload_file():

    app.logger.info("Normal request: " + request.method)

    if request.method == 'POST':

        myfile = request.files['file']
        app.logger.info("Received FILE request")

        if myfile and allowed_file(myfile.filename):
            filename = secure_filename(myfile.filename)

            # Check file name
            abs_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            app.logger.info("A file allowed: "+ filename + ". Path: " +abs_file)

            if os.path.exists(abs_file):

# #####################
# # DEBUG
#                 os.remove(abs_file)
# #####################

                app.logger.warn("Already existing file: "+ abs_file)
                abort(hcodes.HTTP_BAD_REQUEST, "File '"+ filename +"' already exists. " + \
                    "Please change your file name and retry.")

            # Save the file
            myfile.save(abs_file)

            # Make zoomify object and thumbnail
            app.logger.info("Elaborate image")
            # Proc via current shell
            cmd = [INTERPRETER, ZBIN, abs_file]
            proc = shell.Popen(cmd, stdout=shell.PIPE, stderr=shell.PIPE)
            out, err = proc.communicate()
            # Handle output
            if proc.returncode == 0:
                if out != None and out != "":
                    app.logger.info("Comm output: " + out)
            else:
                app.logger.critical("Failed to process image " + abs_file + \
                    ". Error: " + err)
                abort(hcodes.HTTP_BAD_REQUEST, "Could not process file")

            # Default redirect is to 302 state, which makes client
            # think that response was unauthorized....
            # see http://dotnet.dzone.com/articles/getting-know-cross-origin
            return redirect(url_for('uploaded_file', filename='/' + filename),
                hcodes.HTTP_OK_BASIC)

    return '''
    <!doctype html>
    <title>Uploader</title> <h2>Uploader</h2> Empty. Just for receiving!<br>
    '''

###########################################
# http://API/uploader/filename
@app.route(UPLOAD_RESOURCE + '/<filename>', methods=['GET', 'DELETE'])
def uploaded_file(filename):

    app.logger.info("Specific request: " + request.method + ", " + filename)

    abs_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if request.method == 'DELETE':

        # Check file existence
        if not os.path.exists(abs_file):
            app.logger.critical("Not existing: "+ abs_file)
            abort(hcodes.HTTP_BAD_NOTFOUND, "File '"+ filename +"' not found. " + \
                "Please change your file name and retry.")

        # Remove zoomified directory
        filebase, fileext = os.path.splitext(abs_file)
        if os.path.exists(filebase):
            shutil.rmtree(filebase)
            app.logger.warn("Removed: "+ filebase +" [extension '"+fileext+"']")

        # Remove the real file
        os.remove(abs_file)
        app.logger.warn("Removed: "+ abs_file)

        return "Deleted", hcodes.HTTP_OK_NORESPONSE

    # To get?
    elif request.method == 'GET':
        app.logger.info("Should provide: "+ abs_file)
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return ''' <!doctype html> <title>Uploader</title> Empty<br> '''

###########################################
if __name__ == "__main__":
    # Make a flask app for my API
    app.run(host="0.0.0.0", port=6000, debug=True)
    # Note: i will leave debug here to let the app restart automatically
    # if any problem comes...
