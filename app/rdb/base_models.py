"""
# == Modelling ReThinkDB tables in my collection ==
"""

# My ORM library of choise with RethinkDB
from rethinkORM import RethinkModel
# Import types to allow checks inside the model
import types
from bpractices.utilities import get_original_pytype
# A table to use only for test ;)
TESTING_TABLE = 'test'

# == Implements ORM models to use inside my Database ==

class GenericORMModel(RethinkModel):
    """ The most generic model """

    # Setup table to use inside RethinkDB
    # This will also become the resource address!!
    table = TESTING_TABLE
    # 'id' (autogenerated) is the primary key in a RethinkModel
    order = 'id'
    #order = 'latest_timestamp'
    # Indexes and eventual ordering
    indexes = []

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
            #print "Attributes found:", key, value

            # We accept two types at the moment:
            # 1. A list of elements
            if value == 'list':
                attributes[key] = 'makearray'
            # 2. A function which defines a custom type
            if isinstance(value, types.FunctionType):
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

