"""
# == Modelling ReThinkDB tables in my collection ==
"""

# My ORM library of choise with RethinkDB
from rethinkORM import RethinkModel
# Import types to allow inside the model
import types
from bpractices.utilities import get_original_pytype

TESTING_TABLE = 'test'

# == Implements ORM models to use inside my Database ==

class GenericORMModel(RethinkModel):
    """ The most generic model """

    # Setup table to use inside RethinkDB
    table = TESTING_TABLE
    # 'id' (autogenerated) is the primary key in a RethinkModel
    _order = 'id'

    #############################################
    # Note to self: to create API documentation in the future
    # How is a parameter described?
    # - Field
    # - Required/optional
    # - Description
    # - Example (default?)
    # - Max values
    #
    #############################################

    @classmethod
    def list_attributes(cls):
        """ Cycle class attributes to get a list.
        Usable on the class, rather then instance"""
        attributes = {}
        # Here i decide which are the python types that will be
        # accepted in my API resources:
        # I want only unbound method, which define the types i need
        # See after this class ends

        for key in cls.__dict__.keys():
            value = getattr(cls, key)
            if isinstance(value, types.FunctionType):
                #print "PASS Attr:", key, value
                attributes[key] = value

        # Common standard parameters??
        attributes["perpage"] = cls.perpage
        attributes["currentpage"] = cls.currentpage
        return attributes

    #############################################
    # Should add static functions for common parameters
    # e.g. per page, page, etc.
    # warning: these functions are not called if parameters are "None"
    # meaning you cannot set defaults in here
    @staticmethod
    def perpage(value):
        tmp = get_original_pytype(value)
        value = 0
        if isinstance(value, types.IntType):
            value = tmp
        if value > 100:
            value = 100
        return value

    @staticmethod
    def currentpage(value):
        tmp = get_original_pytype(value)
        value = 0
        if isinstance(value, types.IntType):
            value = tmp
        return value

################################################################
# == Define the models you need ==
# Implementing Restful types (with FUNCTIONS)

##############################
class DataDump(GenericORMModel):
    """ A simple container for data dumping """
    table = 'dump'

    # Attributes as defined by static methods:
    @staticmethod
    def key(value, name):

        m = "Parameter '"+name+"' is not a string. Received value: *"+value+"*"
        if not isinstance(value, types.StringTypes):
            raise ValueError(m)
        return value

    # No checks type
    @staticmethod
    def value(value, name):
        """ Defining a key as i wanted """
        #print "Received: ", name, value, type(value), get_original_pytype(value)

        # Try to convert numbers in original python types
        tmp = get_original_pytype(value)
        if tmp != None:
            value = tmp
        #print "Received: ", name, value, type(value)
        return value

##############################
class WebContent(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'webcontent'

    # Attributes as defined by static methods:
    @staticmethod
    def page(value):
        return value    #e.g. about.html
    @staticmethod
    def language(value):
        return value    #e.g. italian
    @staticmethod
    def element(value):
        tmp = get_original_pytype(value)
        if tmp != None:
            value = tmp
        return value    #e.g. a1
    @staticmethod
    def content(value):
        return value    #e.g. "This is the content <b>here</b>"

##############################
class News(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'news'

    # Attributes as defined by static methods:
    @staticmethod
    def date(value):
        return value    #e.g. 01/01/2015
    @staticmethod
    def description(value):
        return value    #e.g. "La mia news in italiano"
    @staticmethod
    def user(value):
        return value    #e.g. paulie

##############################
class StepList(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'steps'
    _order = 'step'

    # Attributes as defined by static methods:
    @staticmethod
    def step(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1
    @staticmethod
    def label(value):
        return value    #e.g. "Estratto"
    @staticmethod
    def description(value):
        return value    #e.g. "Commento!"

##############################
class StepContent(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'stepscontent'
    #_order = 'step'

    # Attributes as defined by static methods:
    @staticmethod
    def step(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1
# TO REMOVE
    @staticmethod
    def element(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1
# TO REMOVE
    @staticmethod
    def type(value):
        return value    #e.g. "Commento!"
    @staticmethod
    def label(value):
        return value    #e.g. "Commento!"
    @staticmethod
    def content(value):
        return value    #e.g. "Commento!"


# For authentication future use
#
# class APIUser(GenericORMModel):
#     """ Security model """
#     table = 'users'
#     username = "unknown"

#     """ Other attributes:
#     password = db.StringProperty(required=True)
#     salt = db.StringProperty()
#     role = db.StringProperty()
#     created = db.DateTimeProperty(auto_now_add=True)
#     modified = db.DateTimeProperty(auto_now=True)
#     """
