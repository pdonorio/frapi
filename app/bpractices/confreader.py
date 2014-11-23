# -*- coding: utf-8 -*-

"""
#=== Read and store all the configurations files ===

#TO ADD # how to modify settings?
    parser.add_section('bug_tracker')
    parser.set('bug_tracker', 'url', 'http://localhost:8080/bugs')
    parser.remove_option('bug_tracker', 'password')
     parser.remove_section('wiki')
    parser.write(sys.stdout)

"""

CONF_DIR = 'conf'
DEFAULT_FILE = 'conf.ini'

# Used to parse configuration
from ConfigParser import SafeConfigParser
# Logging modules
from bpractices.logger import log
from bpractices.exceptions import LoggedError
# Use decorator for cache
from bpractices.decorators import memoize

class Configuration(Object):
    """docstring for Configuration"""

    # Keep track of the last used file
    latest_file = None
    # Save each file different parser to load option of a file
    _parsers = {}

    def __init__(self, filename=DEFAULT_FILE):
        """ open parsers to let refresh possible when the app is running """
        super(Configuration, self).__init__()
        self.log = log.get_logger(self.__class__.__name__)

        if filename != None:
            self.add_file_and_load(filename)

    @memoize
    def add_file(self, filename):
        """ Instanciate single config parser (only once with 'memoize')"""
        filepath = CONF_DIR + "/" + filename
        # New istance per each file [i choosed at design time]
        parser = SafeConfigParser()
        # Try to read. Gives no errors
        found = parser.read(filepath) # note: returns a list
        # Handle absence / permissions
        if filepath not in found:
            # Be explicit on the absolute path of the conf dir
            import os
            curdir = os.getcwd()
            msg = "Could not access a required configuration at "
            msg += "'" + curdir + "/"  + CONF_DIR + "/" + filename + "' "
            # Ternary operator to specify if file not found is default expected
            msg += "[note: DEFAULT file]" if filename == DEFAULT_FILE else ""
            # Exit on error
            raise LoggedError(msg, None, self._logger)

        self.log.debug("Opened parser for filename '" + filename + "'")
        self.latest_file = filename
        self._parsers[filename] = parser
        return parser

    def add_file_and_load(self, filename):
        """ small method to load configurations after opening parser """
        self.add_file(filename)
        #load all filename configurations
        self.__load_all(filename)

    def get(self, key="key", section="section", filename=None, **kwargs):
        """ Get configuration single value and make all necessary checks """

        # File checks
        if filename == None:
            if self.latest_file == None:
                raise LoggedError("Please specify a valid filename", None, self._logger)
            else:
                # If no specified filename, use the latest that has been opened
                filename = self.latest_file
        # Get parser - cached with memoize, open only once in an app life
        conf = self.add_file(filename)

        # Check section and/or option existence
        if section != None:
            if not conf.has_section(section):
                raise LoggedError("No section '" + section + "' found "
                    + "in conf file '" + filename + "'", None, self._logger)
        if not conf.has_option(section, key):
            raise LoggedError("No option '" + key + "' found in section '"
                + section + "' of file '" + filename + "'", None, self._logger)

        # Call the actual load of configuration
        return self.__load(key, section, conf, **kwargs)

    @memoize
    def __load(self, key, section, parser, **kwargs):
        """ Trying to be smart: use memoize decorator to cache results """
        # Note: How to pass argument to memoize? Take advantage of kwargs
        # where you give to the argument a name

        # Use received values or get the attribute via call
        value = kwargs.get("set_value")
        if value == None:
            value = parser.get(section, key)
        msg = "saved" + ("[forced]" if (kwargs.get("skip_cache")) else "")
        logdata = {msg + " from":section, "key":key, "value":value}
        self.log.info(logdata)
        return value

    # Private method, as it should not be used from outside
    def __load_all(self, filename):
        """ Cycle the attributes and save them in class memory """
        conf = self._parsers[filename]

        for section_name in conf.sections():
            #print '\tOptions:', parser.options(section_name) # List options
            for name, value in conf.items(section_name):
                # i can skip checks, because i know these parameters exist
                # i also can provide the value and cache it
                self.__load(name, section_name, conf, set_value=value)
