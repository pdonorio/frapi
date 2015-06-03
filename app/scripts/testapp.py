# -*- coding: utf-8 -*-
""" A test app for anything i want to try """

from security.roles import app

if __name__ == '__main__':
    # Provide server
    app.run(host='0.0.0.0', port=5555)
