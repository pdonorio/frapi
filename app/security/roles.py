# -*- coding: utf-8 -*-
"""
A secured app from:
https://pythonhosted.org/Flask-Security/quickstart.html
Using the blog post:
http://mandarvaze.github.io/2015/01/token-auth-with-flask-security.html
"""

####################################
# Imports

from security.app import app, db

from flask import jsonify
from flask.ext.security \
    import Security, SQLAlchemyUserDatastore, \
    UserMixin, RoleMixin, login_required, roles_required, \
    auth_token_required, http_auth_required

# # Overide auth function ?
# def myauth(self):
#     return "test"
# UserMixin.get_auth_token = myauth

# Define models

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

roles_users = \
    db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class User(db.Model, UserMixin):
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
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

USER = 'test@test.it'
PWD = 'password'
ROLE_ADMIN = 'adminer'


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
# Create a user to test with - execution before first request to our server
@app.before_first_request
def create_user():
    db.create_all()
    if not User.query.first():

        user_datastore.create_user(email=USER, password=PWD)
        user_datastore.create_role(name=ROLE_ADMIN, description='I am the admin')
        #user_datastore.find_or_create_role(ROLE_ADMIN)
        user_datastore.add_role_to_user(USER, ROLE_ADMIN)

        db.session.commit()
