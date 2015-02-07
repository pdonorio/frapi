# -*- coding: utf-8 -*-
"""
Impement restful Resources for flask
"""

import json
# Will use the restful plugin instead!
from flask.ext.restful import reqparse, abort, Resource
# Log is a good advice
from bpractices.exceptions import log, LoggedError
# The global data
from myapi.app import g
# Data models from DB ORM
from rdb import data_models
# Import html codes
import bpractices.htmlcodes as hcodes
# Handling time
import datetime as dt

# == Utilities ==

# Handling time format for json_dumps
dthandler = lambda obj: ( obj.isoformat()
    if isinstance(obj, dt.datetime) or isinstance(obj, dt.date) else None)
# This one above could/should be a class
# http://stackoverflow.com/a/23287543

def clean_parameter(param=""):
    """ I get parameters already with '"' quotes from curl? """
    if param == None:
        return param
    return param.strip('"')

def check_empty_data(data):
    """ Make sure parser didn't get an empty request """
    counter = 0
    # check if all data is empty (None)
    for value in data.iteritems():
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
            print e
            if e.__str__() == "DB table does not exist yet":
                # Empty table
                abort(hcodes.HTTP_BAD_CONFLICT, message=e.__str__())
            else:
                # Very bad
                abort(hcodes.HTTP_BAD_NOTFOUND, message=e.__str__())
    return wrapper

# == Implement a generic Resource for RethinkDB ORM model ==

class GenericDBResource(Resource):
    """
    Generic Database API-Resource. Provide simple operations:

    1. List all data inside a noSQL table [GET method]
    2. List specific data inside a noSQL table [GET method + data_key]
    3. Add one element inside table [POST method]
    4. Add one element specifying the key inside table [PUT method + data_key]
    5. Update one existing element inside table [POST-PUT method + data_key]
    6. Delete one existing element inside table [DELETE method + data_key]

    Note: PUT differs from POST because data_key is mandatory.

    Based on flask-restful plugin
    """

    parser = None

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
            self.__configure_parsing()
        else:
            db.define_model(ormModel)

    def __configure_parsing(self):
        """
        Define which data will be retrieved from this resource.
        The arguments are defined automatically from the selected ORM model.

        *** Note to self: an API does not even check/get parameters
        which were not added here as argument ***
        """
        self.parser = reqparse.RequestParser()
        # Extra parameter id for POST updates or key forcing
        self.parser.add_argument("id")

        # Based on my datamodelled ORM class
        # Cycle class attributes
        for key, value in g.rdb.model.list_attributes().iteritems():
            # Decide type based on attribute
            self.parser.add_argument(key, type=value)

        return self.parser

    @abort_on_db_fail
    def get(self, data_key=None):
        """
        Get all data. Note: could be an object serialized:
        restful docs in /quickstart.html#data-formatting
        """

        self.log.info("API: Received 'search'")
        params = self.parser.parse_args()
        for (name, value) in params.iteritems():
            params[name] = value

        # Query RDB filtering on a single key
        if data_key != None:
            self.log.info("API: Received 'search' for " + data_key)
            params["id"] = data_key

        # Passing each parameters directly to rdb
        (count, out) = g.rdb.search(**params)

        # Need a list to make this work
        #data = list(out)
        data = {"count":count, "items":list(out)}

        # Serialize (using dthandler to avoid problems with date)
        json_data = json.dumps(data, default=dthandler)

        # Should build a better json array response
        return json_data, hcodes.HTTP_OK_ACCEPTED

    @abort_on_db_fail
    def post(self):
        """
        http://restcookbook.com/HTTP%20Methods/put-vs-post/
        - Get data as defined in init parser and push it to rdb, or
        - add a new article, but do not have any idea where to store it
        - or to update existing resources? UHM LAST ONE MAYBE NOT
        """

        # This call will raise errors if types are not as defined in the Model
        data = self.parser.parse_args()

        if check_empty_data(data):
            return "Received empty request", hcodes.HTTP_BAD_REQUEST

        self.log.debug("API: POST request open")
        self.log.debug(data)

        #################
        # Check if PUT or POST - depends on data_key presence
        data_key = None
        if "id" in data:
            data_key = data.pop("id")

        key = g.rdb.insert(data, data_key)
        self.log.debug("API: Insert of key " + key.__str__())
        #################

        # Should build a better json array response
        return key, hcodes.HTTP_OK_CREATED

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
            return "Received empty request", hcodes.HTTP_BAD_REQUEST

        # always empty in put - or don't care.
        if "id" in data:
            data.pop("id")  #trash it
        # in this case i use the data_key

        key = g.rdb.insert(data, data_key)
        self.log.debug("API: Insert of key " + key.__str__())
        return key, hcodes.HTTP_OK_CREATED

    @abort_on_db_fail
    def delete(self, data_key):
        """ Remove specific element """
        data_key = clean_parameter(data_key)
        self.log.info("API: DELETE request for " + data_key)
        g.rdb.remove(data_key)
        return '', hcodes.HTTP_OK_NORESPONSE

################################################################
# === Implement Resources ===

# Get instances of the generic resources
# based on a specific data_models
#
# Warning: due to restful plugin system, get and get(value)
# require 2 different resources...


##################
## Data (generic)
class DataList(GenericDBResource):
    def __init__(self, db=None):
        super(DataList, self).__init__(data_models.DataDump, db)
class DataSingle(GenericDBResource):
    def __init__(self):
        super(DataSingle, self).__init__(data_models.DataDump)

##################
## HtmlContent (admin editable html content of web pages)
class HtmlContents(GenericDBResource):
    def __init__(self, db=None):
        super(HtmlContents, self).__init__(data_models.WebContent, db)
class HtmlContent(GenericDBResource):
    def __init__(self):
        super(HtmlContent, self).__init__(data_models.WebContent)

##################
## News (informations about new features)
class NewsFeeds(GenericDBResource):
    def __init__(self, db=None):
        super(NewsFeeds, self).__init__(data_models.News, db)
class NewsFeed(GenericDBResource):
    def __init__(self):
        super(NewsFeed, self).__init__(data_models.News)

##################
## Steps (List of available steps for the user)
class Steps(GenericDBResource):
    def __init__(self, db=None):
        super(Steps, self).__init__(data_models.StepList, db)
class Step(GenericDBResource):
    def __init__(self):
        super(Step, self).__init__(data_models.StepList)






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
#         code = hcodes.HTTP_BAD_UNAUTHORIZED

# # DON'T LIKE
#     #check if user is inside database?
#         if user in {}:
#             if p == "test":
#                 # Authenticate and log in!
#                 code = hcodes.HTTP_OK_ACCEPTED
#                 msg = "Logged in"
#             else:
#                 msg = "Password is wrong"
#         else:
#             msg = "Failed to authenticate"

#         # Server response
#         app.logger.info("API: " + msg + "\t[code " + code.__str__() + "]")
#         return msg, code
