# -*- coding: utf-8 -*-
""" A test app for anything i want to try """

from security.roles import app
from security.mailer import mailer

if __name__ == '__main__':
    mailer(app)
    app.run(host='0.0.0.0', port=80)
    #app.run(port=4000)
