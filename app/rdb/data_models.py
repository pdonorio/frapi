################################################################
# Implementing Restful ORM MODELS (with functions)

# Import types to allow checks inside the model
import types
from bpractices.utilities import get_original_pytype
from rdb.base_models import GenericORMModel

# == Define the models you need ==

##############################
class DataDump(GenericORMModel):
    """ A simple container for data dumping """
    table = 'data'
    indexes = ['key', 'value']

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

##############################
class StepTemplate(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'stepstemplate'
    _order = 'step,position'

    # Attributes as defined by static methods:
    @staticmethod
    def step(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1
    @staticmethod
    def position(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 2
    @staticmethod
    def type(value):
        return value    #e.g. "Select"
    @staticmethod
    def field(value):
        return value    #e.g. "Estratto"
    @staticmethod
    def extra(value):
        return value    #e.g. "Commento!"
