# -*- coding: utf-8 -*-
"""
A file uploader API via few python code lines!

Also apply support for images zoomification.
"""

# Handle files
import os, subprocess as shell
# Flask framework
from flask import Flask, request, redirect, url_for, abort
from flask.ext.cors import CORS
from werkzeug import secure_filename
# Import html codes
import bpractices.htmlcodes as hcodes
# log is a good advice
from bpractices.logger import log

# TO FIX - move to __init__
# Define directory?
UPLOAD_FOLDER = '/uploads'
INTERPRETER = 'python'
ZBIN = '/zoomify/processor/ZoomifyFileProcessor.py'

app = Flask(__name__)
log.setup_istance(None, app.logger)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, headers=['Content-Type']) #, resources={r"/uploads/*": {"origins": "*"}})

# Extensions
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# Save files
# http://API/uploads/
@app.route(UPLOAD_FOLDER, methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        myfile = request.files['file']
        app.logger.debug("Received FILE request")

        if myfile and allowed_file(myfile.filename):
            filename = secure_filename(myfile.filename)

            # Check file name
            abs_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            app.logger.info("A file allowed: "+ filename + ". Path: " +abs_file)

            if os.path.exists(abs_file):

#####################
# DEBUG
                os.remove(abs_file)

                """
                app.logger.debug("Already existing file: "+ abs_file)
                abort(hcodes.HTTP_BAD_REQUEST, "File '"+ filename +"' already exists. " + \
                    "Please change your file name and retry.")
                """
# DEBUG
#####################

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

# http://API/uploads/filename
@app.route(UPLOAD_FOLDER + '<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":

    # Make a flask app for my API
    app.run(host="0.0.0.0", port=6000, debug=True)
    # Note: i will leave debug here to let the app restart automatically
    # if any problem comes...
