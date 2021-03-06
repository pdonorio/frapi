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
        """ Defining a string """
        m = "Parameter '"+name+"' is not a string. Received value: *"+value+"*"
        if not isinstance(value, types.StringTypes):
            raise ValueError(m)
        return value

    # No checks type
    @staticmethod
    def value(value):
        """ Defining a key as i wanted """
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
class Account(GenericORMModel):
    """ Handling users """
    table = 'accounts'

    @staticmethod
    def name(value):
        return value
    @staticmethod
    def surname(value):
        return value
    @staticmethod
    def email(value):
        return value
    @staticmethod
    def activation(value, name):
        m = "Parameter '"+name+"' may only be 0 or 1. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType) or tmp < 0 or tmp > 1:
            raise ValueError(m)
        return tmp    # 0 or 1
    @staticmethod
    def role(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1
    @staticmethod
    def token(value):
        return value

##############################
class NewsFeed(GenericORMModel):
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
    order = 'step'

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
class FieldNames(GenericORMModel):
    """ A hash provider to keep track of field created """
    table = 'stepfields'

    # Attributes as defined by static methods:
    @staticmethod
    def name(value):
        return value
    @staticmethod
    def step(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1

##############################
class StepTemplate(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'stepstemplate'
    order = 'position'

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
    def type(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 2
    @staticmethod
    def field(value):
        return value    #e.g. "Estratto"
    @staticmethod
    def hash(value):
        return value    #e.g. "Estratto"
    @staticmethod
    def required(value):
        return value    #e.g. "Estratto"
    @staticmethod
    def extra(value):
        return value    #e.g. "Commento!"

################################################
# using arrays as single element for the first time
class StepContent(GenericORMModel):
    """ Html content of elements in web pages of my application """
    table = 'stepscontent'
    order = 'step'
    indexes = ['latest_timestamp']

    # Attributes as defined by static methods:
    @staticmethod
    def step(value, name):
        m = "Parameter '"+name+"' is not an integer. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType):
            raise ValueError(m)
        return tmp    #e.g. 1
    @staticmethod
    def user(value):
        return value    #e.g. "admin"
    @staticmethod
    def recordid(value):
        return value    #e.g. 'new' or record

    # Give opportunity to query the right way
    @staticmethod
    def filterfield(value):
        return value
    @staticmethod
    def filtervalue(value):
        return value

    # ARRAY!
    values = 'list'
    hashes = 'list'

##############################
class DocumentsUploaded(GenericORMModel):
    """ The list of files and transcriptions uploaded """
    table = 'docs'
    @staticmethod
    def code(value):
        return value
    @staticmethod
    def filename(value):
        return value
    @staticmethod
    def filetype(value):
        return value
    @staticmethod
    def upload_time(value):
        return value
    @staticmethod
    def upload_user(value):
        return value
    @staticmethod
    def recordid(value):
        return value
    transcriptions = 'list'

##############################
class RegisterIdentifier(GenericORMModel):
    """ A service used to provide identifiers to drafts and published documents """
    table = 'myidprovider'
    # Attributes as defined by static methods:
    @staticmethod
    def user(value):
        return value
    @staticmethod
    def request_time(value):
        return value    #e.g. 01/01/2015
    @staticmethod
    def published(value, name):
        m = "Parameter '"+name+"' may only be 0 or 1. Received value: *"+value+"*"
        tmp = get_original_pytype(value)
        if not isinstance(tmp, types.IntType) or tmp < 0 or tmp > 1:
            raise ValueError(m)
        return tmp    # 0 or 1

##############################
class DataOperationsLogger(GenericORMModel):
    """ A service used to provide identifiers to drafts and published documents """
    table = 'datalogs'
    @staticmethod
    def user(value):
        return value
    @staticmethod
    def record(value):
        return value
    @staticmethod
    def operation(value):
        return value
    @staticmethod
    def comment(value):
        return value

##############################
class TaskManagement(GenericORMModel):
    """ Planning tasks inside the web app. For admins. """
    table = 'tasks'

    @staticmethod
    def task(value):
        return value
    @staticmethod
    def status(value):
        return value
    @staticmethod
    def description(value):
        return value

##############################
class TaskSocial(GenericORMModel):
    """ Conversations inside task management """
    table = 'conversations'
    order = 'latest_timestamp'

    @staticmethod
    def task(value):
        return value
    @staticmethod
    def comment(value):
        return value
    @staticmethod
    def user(value):
        return value

# ##############################
# class ObjectTest(GenericORMModel):
#     """ Conversations inside task management """
#     table = 'objtest'

#     @staticmethod
#     def obj(value):
#         print("TEST VALUE", value)
#         return value
