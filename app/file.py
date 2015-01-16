import os
from flask import Flask, request, redirect, url_for
from flask.ext.cors import CORS
from werkzeug import secure_filename

UPLOAD_FOLDER = '/uploads'
HTTP_OK_BASIC = 200

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
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file', filename=filename),
                # Warning: this was getting me crazy!
                # Default redirect is to 302 state, which makes client
                # think that response was unauthorized....
                # see http://dotnet.dzone.com/articles/getting-know-cross-origin
                HTTP_OK_BASIC)

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h2>Uploader</h2>
    Empty. Just for receiving!<br>
    '''

# http://API/uploads/filename
@app.route(UPLOAD_FOLDER + '<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

if __name__ == "__main__":

    # Make a flask app for my API
    app.run(host="0.0.0.0", port=6000, debug=True)