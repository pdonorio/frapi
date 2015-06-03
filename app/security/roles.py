# -*- coding: utf-8 -*-
"""
A secured app from:
https://pythonhosted.org/Flask-Security/quickstart.html
Using the blog post:
http://mandarvaze.github.io/2015/01/token-auth-with-flask-security.html
"""

########################
########################
USER = 'test@test.it'
PWD = 'password'
ROLE_ADMIN = 'adminer'
########################
########################

####################################
# Imports

from security.app import app, db, mail

from flask_mail import Message
from flask import jsonify
from flask.ext.security \
    import Security, SQLAlchemyUserDatastore, \
    UserMixin, RoleMixin, login_required, roles_required, \
    auth_token_required, http_auth_required

####################################
# Define models

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

roles_users = \
    db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('userauth.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

# Note: do not use 'User' as it may mix with postgresql keyword
class Userauth(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    auth_token = db.Column(db.String(255))

    #confirmed_at = db.Column(db.DateTime())

    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

####################################
# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, Userauth, Role)
security = Security(app, user_datastore)

####################################
# Create a user to test with - execution before first request to our server
try:
    db.create_all()
    print "Connected and created"
except Exception, e:
    raise e

@app.before_first_request
def create_user():
    db.create_all()
    if not Userauth.query.first():

        user_datastore.create_user(email=USER, password=PWD)
        user_datastore.create_role(name=ROLE_ADMIN, description='I am the admin')
        #user_datastore.find_or_create_role(ROLE_ADMIN)
        user_datastore.add_role_to_user(USER, ROLE_ADMIN)

        print "Db init"
        db.session.commit()

####################################
# Views
@app.route('/')
#@login_required
def home():
    return "Hello world", 200

@app.route('/app/', methods=['GET'])
@auth_token_required
#@http_auth_required
def dummyAPI():
    ret_dict = {
        "Key1": "Value1",
        "Key2": "value2"
    }
    return jsonify(items=ret_dict)

@app.route('/admin/')
@auth_token_required
@roles_required(ROLE_ADMIN)
def admin():
    return "Hello admin", 200

####################################
# MAIL tests
@app.route("/mail")
def sendmail():

    # Create the message with cool sender
    msg = Message("Hello",
        sender=("Me", "me@example.com"))
    assert msg.sender == "Me <me@example.com>"
    # Destination
    msg.recipients = ["test@gmail.com"]
    msg.add_recipient("somebodyelse@example.com")
    # Body OR Html
    msg.body = "testing the normal body"
    msg.html = "<b>testing</b> the html body"

    # SEND
    mail.send(msg)
    return "Sent ;)"

####################################
# API restful test
from flask.ext.restful import Api, Resource, abort #, request, reqparse
api = Api(app, catch_all_404s=True)
FIXED_APIURL = ''

class ApiTest(Resource):
    resource = __name__

    def __init__(self):
        self.resource = type(self).__name__.lower()
        super(ApiTest, self).__init__()

    @auth_token_required
    def get(self):
        return "test", 200

    def post(self):
        return abort(404, message='NO!')

print "Resource", ApiTest().resource
api.add_resource(ApiTest, FIXED_APIURL+'/'+ApiTest().resource)

# # 1. /resource      #GET
#     FIXED_APIURL + '/' + ApiTest.resource, \
# # 2. /resource/:id  #POST
#     FIXED_APIURL + '/' + ApiTest.resource + '/<string:data_key>')

# ####################################
# ####################################
# from datetime import timedelta
# from flask import session

# @app.before_request
# def make_session_permanent():
#     session.permanent = True
#     app.permanent_session_lifetime = timedelta(minutes=1)
# ####################################
# ####################################