# -*- coding: utf-8 -*-

"""
# === decorate as a creative art ===
Trying to create decorators to objects, to boost functionality
"""

import sys
from functools import wraps
# log is a good advice
from bpractices.exceptions import LoggedError

def debug_calling(func):
    """ In case you need to debug the calling of a function through the app """
    def wrapper(*args, **kwargs):
        """ Simple printing of data before func execution """
        print "#\t",
        print "CALLING FUNC [" + func.__name__ + "]",
        print "ARGS [", args, "]",
        print "KWARGS [", kwargs, "]"
        return func(*args, **kwargs)
    return wrapper

def memoize(func):
    """
    Memoization is a way to avoid repeating potentially expensive calculations.
    source: http://www.brianholdefehr.com/decorators-and-functional-python
    """
    cache = {}

    @wraps(func)
    def wrapper(*args, **kwargs):
        """
        A function to add a cache to any object.
        Avoid calling a second time with same args,
        but can be forced with skip_cache=True kargument
        """
        # If receiving a parameter to force calling
        force = kwargs.get("skip_cache")
        #print func.__name__, force, args, kwargs    #for debugging

        if force or args not in cache:
            #print "[computed]",
            cache[args] = func(*args, **kwargs)
        #print "Value", cache[args]
        return cache[args]
    return wrapper

class TryExcept(object):
    """ Defined a decorator class for generic try and except used too often """

    exc = BaseException

    def __init__(self, msg="Error", to_catch=exc, to_call=LoggedError):
        """ If has args, the function is not passed to the constructor! """
        if msg.__class__.__name__ != "str":
            raise self.exc("Did not receive a string msg in TryEx decorator")
        self.msg = msg
        self.catch = to_catch
        self.call = to_call

    def __call__(self, func):
        """
        __call__() is only called once
        You can only give it a single argument, which is the function object.
        """

        def wrapper(*args, **kwargs):
            """ Implement a robust try and catch as generic as possible """
            out = None

            # Try function
            try:
                out = func(*args, **kwargs)
            # Exception i know, handle it
            except self.catch, e:
                raise self.call(self.msg, e)
            # Whatever else, let it raise (or?)

            # If everything is fine:
            return out
        return wrapper
