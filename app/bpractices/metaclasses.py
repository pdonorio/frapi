# -*- coding: utf-8 -*-

""" Meta Classes """


def metaclassing(your_class, label=None, attributes={}):
    """
    Creating a class using metas.
    Very usefull for automatic algorithms.
    """
    methods = dict(your_class.__dict__)
    for key, value in attributes.iteritems():
        methods.update({key: value})
    return type(label, (your_class,), methods)
