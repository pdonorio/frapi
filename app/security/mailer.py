# -*- coding: utf-8 -*-
""" Mail configuration """

from flask_mail import Mail

def mailer(app):
    # After 'Create app'
    app.config['MAIL_SERVER'] = 'smtp.example.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_SSL'] = True
    # app.config['MAIL_USERNAME'] = 'username'
    # app.config['MAIL_PASSWORD'] = 'password'
    mail = Mail(app)
    print mail
    return mail
