# -*- coding: utf-8 -*-
"""
Impement restful Resources for flask
"""

# Will use the restful plugin instead!
from flask.ext.restful import reqparse, abort, Resource
# Log is a good advice
from bpractices.exceptions import log, LoggedError
# The global data
from myapi.app import app, g
# Data models from DB ORM
from rdb import data_models

# === HTTP status codes ===
#http://www.w3.org/Protocols/HTTP/HTRESP.html

HTTP_OK_BASIC = 200
HTTP_OK_CREATED = 201
HTTP_OK_ACCEPTED = 202
HTTP_OK_NORESPONSE = 204
HTTP_BAD_REQUEST = 400
HTTP_BAD_UNAUTHORIZED = 401
HTTP_BAD_FORBIDDEN = 403
HTTP_BAD_NOTFOUND = 404

# == Utilities ==

def clean_parameter(param=""):
    """ I get parameters already with '"' quotes from curl? """
    if param == None:
        return param
    return param.strip('"')

def check_empty_data(data):
    """ Make sure parser didn't get an empty request """
    counter = 0
    # check if all data is empty (None)
    for key, value in data.iteritems():
        if value == None or value == '':
            counter += 1
    if data.__len__() == counter:
        return True
    return False

def abort_on_db_fail(func):
    """ Decorator for methods who use the model """
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except LoggedError, e:
            abort(HTTP_BAD_NOTFOUND, message=e.__str__())
    return wrapper

# == Implement a generic Resource for RethinkDB ORM model ==

class GenericDBResource(Resource):
    """
    Generic Database API-Resource. Provide simple operations:
    1. List all data inside a noSQL table [GET method]
    2. Add one element inside table [POST method]
    Based on flask-restful plugin
    """

    #define
    def __init__(self, ormModel=data_models.GenericORMModel, db=None):
        """ Implement a parser for validating arguments of api """

        # how to get the model as parameter since its a resource?
        # subclass this instance and call super with model as arg

        if db == None:
            self.log = log.get_logger(self.__class__.__name__)

            # Decide the model to use for this DB resource
            g.rdb.define_model(ormModel)
            # Use the model to configure parameters
            self.parser = self.__configure_parsing()
        else:
            db.define_model(ormModel)

    def __configure_parsing(self):
        """
        Define which data will be retrieved from this resource.
        The arguments are defined automatically from the selected ORM model.

        *** Note to self: an API does not even check/get parameters
        which were not added here as argument ***
        """

        parser = reqparse.RequestParser()
        # Based on my datamodelled ORM class
        attributes = g.rdb.get_fields()

########################################
# TO FIX - base type on?

# to check: flask restfull reqparse types

        # # The unique key of the record, could  be forced to an int?
        # parser.add_argument('id', type=int,
        #     help='The "id" parameter should be an integer')

        # Cycle class attributes
        for key, value in attributes.iteritems():
            print "Attr:", key, value
            mytype = str
            # Decide type based on attribute?
            parser.add_argument(key, type=mytype)

########################################

        return parser

    @abort_on_db_fail
    def get(self, data_key=None):
        """
        Get all data. Note: could be an object serialized:
        restful docs in /quickstart.html#data-formatting
        """
        self.log.info("API: Received 'search'")
        if data_key == None:
            # Query ALL
            data = g.rdb.search()
        else:
            data_key = clean_parameter(data_key)
            self.log.info("API: Received 'search' for " + data_key)
            #Query RDB filtering on a single key
            data = g.rdb.search(by_key=data_key)
        return data

    @abort_on_db_fail
    def post(self):
        """
        http://restcookbook.com/HTTP%20Methods/put-vs-post/
        - Get data as defined in init parser and push it to rdb, or
        - add a new article, but do not have any idea where to store it
        - or to update existing resources? UHM LAST ONE MAYBE NOT
        """
        data = self.parser.parse_args()
        if check_empty_data(data):
            return "Received empty request", HTTP_BAD_REQUEST

        # Check if PUT or POST - depends on data_key presence
        data_key = data.pop("id")    #gives None if not exists
        self.log.debug("API: POST request open")
        self.log.debug(data)

        key = g.rdb.insert(data, data_key)
        self.log.debug("API: Insert of key " + key.__str__())

        return key, HTTP_OK_CREATED

    @abort_on_db_fail
    def put(self, data_key):
        """
        - you can PUT a new resource representation of this article directly
        - or update if you already know the key
        """
        data_key = clean_parameter(data_key)

        self.log.debug("API: PUT request open for " + data_key)

        data = self.parser.parse_args()
        if check_empty_data(data):
            return "Received empty request", HTTP_BAD_REQUEST

        # always empty in put - or don't care.
        data.pop("id")  #trash it
        # in this case i use the data_key

        key = g.rdb.insert(data, data_key)
        self.log.debug("API: Insert of key " + key.__str__())
        return key, HTTP_OK_CREATED

    @abort_on_db_fail
    def delete(self, data_key):
        """ Remove specific element """
        data_key = clean_parameter(data_key)
        self.log.info("API: DELETE request for " + data_key)
        g.rdb.remove(data_key)
        return '', HTTP_OK_NORESPONSE

# === Implement resources ===

################################################################
# Get instances of the generic resources
# Based on a specific data_models
# Warning: due to restful plugin system, get and get(value)
# require two different resources...
class DataList(GenericDBResource):
    def __init__(self, db=None):
        super(DataList, self).__init__(data_models.DataDump, db)
class DataSingle(GenericDBResource):
    def __init__(self):
        super(DataSingle, self).__init__(data_models.DataDump)
################################################################






# ################################################################
# # FOR FUTURE TESTING on AUTHENTICATION?

# # Handle login and logout
# class LogUser(Resource):
#     """  Init authentication and give token """
#     def __init__(self):
#         self.parser = reqparse.RequestParser()
#         self.parser.add_argument('user', type=str)
#         # IN CHIARO??
#         self.parser.add_argument('password', type=str)
#             #help='The "id" parameter should be an integer')

#     def post(self):
#         """ Get data as defined in init parser and push it to rdb """
#         data = self.parser.parse_args()
#         #print data
#         user = data["user"]
#         p = data["password"]
#         app.logger.info("API: Received login request for user '" + user + "'")

#         ###############################
#         code = HTTP_BAD_UNAUTHORIZED

# # DON'T LIKE
#     #check if user is inside database?
#         if user in {}:
#             if p == "test":
#                 # Authenticate and log in!
#                 code = HTTP_OK_ACCEPTED
#                 msg = "Logged in"
#             else:
#                 msg = "Password is wrong"
#         else:
#             msg = "Failed to authenticate"

#         # Server response
#         app.logger.info("API: " + msg + "\t[code " + code.__str__() + "]")
#         return msg, code
