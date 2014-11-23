# -*- coding: utf-8 -*-

import json

# This next bit is to ensure the script runs unchanged on 2.x and 3.x
try:
    unicode
except NameError:
    unicode = str

class Encoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, set):
            return tuple(o)
        elif isinstance(o, unicode):
            return o.encode('unicode_escape').decode('ascii')
        try:
            encoded = super(Encoder, self).default(o)
        except Exception, e:
            return "JSON ENCODING ERROR: Unserializable content in message..."
        return encoded

class StructuredMessage(object):
    def __init__(self, message, **kwargs):
        self.message = message
        self.kwargs = kwargs

    def __str__(self):
        s = Encoder().encode(self.kwargs)
        return '%s %s' % (self.message, s)

_ = StructuredMessage   # optional, to improve readability

#logging.info(_('message 1', set_value=set([1, 2, 3]), snowman='\u2603'))
