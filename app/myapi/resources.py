# -*- coding: utf-8 -*-
"""
Impement restful Resources for flask
"""

import json
import types
# Will use the restful plugin instead!
from flask.ext.restful import reqparse, abort, Resource, request
# Log is a good advice
from bpractices.exceptions import log, LoggedError
# The global data
from myapi.app import g
# Data models from DB ORM
from rdb.get_models import models
# Import html codes
import bpractices.htmlcodes as hcodes
# Handling time
import datetime as dt
# Meta class generator
from bpractices.metaclasses import metaclassing

# == Utilities ==

# Handling time format for json_dumps
dthandler = lambda obj: (obj.isoformat()
    if isinstance(obj, dt.datetime) or isinstance(obj, dt.date) else None)
# // TO FIX:
# This one above could/should be a class
# http://stackoverflow.com/a/23287543


###############################
# TO FIX
#   make one function/class from what you find in app.py
#   limit_remote_addr
#   Please fix me here:
# http://esd.io/blog/flask-apps-heroku-real-ip-spoofing.html
def get_ip():
    ip = None
    if not request.headers.getlist("X-Forwarded-For"):
        ip = request.remote_addr
    else:
        ip = request.headers.getlist("X-Forwarded-For")[0]
    return ip
###############################


def clean_parameter(param=""):
    """ I get parameters already with '"' quotes from curl? """
    if param is None:
        return param
    return param.strip('"')


def check_empty_data(data):
    """ Make sure parser didn't get an empty request """
    counter = 0
    # check if all data is empty
    for value in data.iteritems():
        if isinstance(value, types.NoneType) or value == '':
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
                abort(hcodes.HTTP_SERVICE_UNAVAILABLE, message=e.__str__())
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
    model = None

    def __init__(self):
        """ Implement a parser for validating arguments of api """

        ############################
        # how to get the model as parameter since its a resource?
        # use a factory which sets attribute 'model' as a Data ORM Class
        ############################

        # IMPORTANT!
        # This model will be defined inside the resource factory
        g.rdb.define_model(self.model)

        # Init self logger
        self.log = log.get_logger(self.__class__.__name__)
        # Read all the properties that will be used from API methods
        self.__configure_parsing()

    def __configure_parsing(self):
        """
        Define which data will be retrieved from this resource.
        The arguments are defined automatically from the selected ORM model.

        *** Note to self: an API does not even check/get parameters
        which were not added here as argument ***
        """
        self.parser = reqparse.RequestParser()

        #value = str #NO!!
        basevalue = unicode
        # http://flask-restful.readthedocs.org/en/latest/api.html#module-reqparse
        # http://stackoverflow.com/a/9942822/2114395

        # Extra parameter id for POST updates or key forcing
        self.parser.add_argument("id", type=basevalue)

        # Based on my datamodelled ORM class
        # Cycle class attributes
        for key, value in g.rdb.model.list_attributes().iteritems():
            act = 'store'
            loc = ['headers', 'values'] #multiple locations

            # Decide type based on attribute
            # Base is function return value
            # I am creating an option to handle arrays:
            if value == 'makearray':
                value = basevalue
                act = 'append'
            # elif '_time' in key:
            #     print "Type ", key, value, act, loc

            self.parser.add_argument(key, type=value, action=act, location=loc)
            #http://flask-restful.readthedocs.org/en/latest/api.html#module-reqparse

        return self.parser

    def get_params(self):
        """ Checks on data received """
        params = self.parser.parse_args()

        data = {}
        for (parname, parval) in params.iteritems():
            #print "Param", parname, parval, type(parval)

            ##########################
            # Handling lists with checks
                # Hard & ambigous...

            if isinstance(parval, types.ListType):
                newlist = list()
                counter = 0

                for content in list(parval):
                    #print "Content: *" + content + "*"
                    if not isinstance(content, types.NoneType):
                        newlist.append(content)
                        # Check how many items really have content
                        if content != "":
                            counter += 1

                # Should be an empty array if all values are empty
                if counter < 1:
                    newlist = list()
                data[parname] = newlist


                #print "Uhm", data

            elif not isinstance(parval, types.NoneType):
                # Very important: this sanitize updates, avoid to set
                # empty values for we did not receive from POST/PUT
                data[parname] = parval

        return data

    @abort_on_db_fail
    def get(self, data_key=None):
        """
        Get all data. Note: could be an object serialized:
        restful docs in /quickstart.html#data-formatting
        """

        self.log.debug("IP: " + get_ip())
        self.log.info("API: Received 'search'")

        params = self.get_params()

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
        data = self.get_params()
        if check_empty_data(data):
            return "Received empty request", hcodes.HTTP_BAD_REQUEST
        self.log.debug("API: POST request open")

        #self.log.debug(data)
        #################
        # Check if PUT or POST - depends on data_key presence
        data_key = None
        if "id" in data:
            data_key = data.pop("id")

##############################
        key = g.rdb.insert(data, data_key, get_ip())
        self.log.debug("API: Insert of key " + key.__str__())
##############################

        # Should build a better json array response
        return key, hcodes.HTTP_OK_CREATED

# TO FIX - this is almost a post duplicate...
    @abort_on_db_fail
    def put(self, data_key):
        """
        - you can PUT a new resource representation of this article directly
        - or update if you already know the key
        """
        data_key = clean_parameter(data_key)

        data = self.get_params()
        if check_empty_data(data):
            return "Received empty request", hcodes.HTTP_BAD_REQUEST
        self.log.debug("API: PUT request open for " + data_key)

        # always empty in put - or don't care.
        if "id" in data:
            data.pop("id")  #trash it
        # in this case i use the data_key

##############################
        key = g.rdb.insert(data, data_key, get_ip())
        self.log.debug("API: Insert of key " + key.__str__())
##############################

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

# Resources factory: create as many as there are ORM models
resources = {}
for (name, data_model) in models.iteritems():
    if 'Base' in name:
        continue
    # Get instances of the generic resources
    # based on a specific data_models
    new_class = metaclassing(GenericDBResource,
                             name + "Resource", {'model': data_model})
    # Save it for restful routing inside an array
    resources[name] = (new_class, data_model.table)
