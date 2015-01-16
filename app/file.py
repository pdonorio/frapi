import os
from flask import Flask, request, redirect, url_for, abort
from flask.ext.cors import CORS
from werkzeug import secure_filename

UPLOAD_FOLDER = '/uploads'
HTTP_OK_BASIC = 200
HTTP_BAD_REQUEST = 400

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, headers=['Content-Type']) #, resources={r"/uploads/*": {"origins": "*"}})

# Extensions
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# http://API/uploads/
@app.route(UPLOAD_FOLDER, methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        myfile = request.files['file']

        if myfile and allowed_file(myfile.filename):
            filename = secure_filename(myfile.filename)

            # Check file name
            abs_file = app.config['UPLOAD_FOLDER'] + "/" + filename
            if os.path.exists(abs_file):
                print "Existing ", abs_file
                abort(HTTP_BAD_REQUEST, "File '"+abs_file+"' already exists. " + \
                    "Please change your file name and retry.")

            myfile.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            # Default redirect is to 302 state, which makes client
            # think that response was unauthorized....
            # see http://dotnet.dzone.com/articles/getting-know-cross-origin
            return redirect(url_for('uploaded_file', filename=filename),
                HTTP_OK_BASIC)

    return '''
    <!doctype html>
    <title>Uploader</title>
    <h2>Uploader</h2>
    Empty. Just for receiving!<br>
    '''

# http://API/uploads/filename
@app.route(UPLOAD_FOLDER + '<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":

    # Make a flask app for my API
    app.run(host="0.0.0.0", port=6000, debug=True)