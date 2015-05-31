# -*- coding: utf-8 -*-
"""
# === Database connection with singleton ===

Working on a Connection (abstract?) object to implement
with different database (SQL and NoSQL)
"""

# i want this piece of code to be the ABSTRACT base of other subclasses
import abc
# i need one connection in the whole application
from designpatterns.singleton import Borg
# log is a good advice
from bpractices.logger import log

class Connection(Borg):
    __metaclass__ = abc.ABCMeta

    """
    == My Abstract Connection ==
    With your DBMS implement a "make_connection" method.
    But then use only **get_connection** to avoid duplicates.
    """
    _connection = None      #main property

    def __init__(self, use_database=True, connect=True):
        """ This is were i want to make sure i connect """
        super(Connection, self).__init__()

        self.log = log.get_logger(self.__class__.__name__)

        if connect:
            self.get_connection(use_database)

    @classmethod
    def __subclasshook__(cls, C):
        """
        I am telling python that:
        The class who implements a 'make_connection' is a Connection subclass
        """
        if cls is Connection:
            if any("make_connection" in B.__dict__ for B in C.__mro__):
                return True
        return NotImplemented

    @abc.abstractmethod
    def make_connection(self, use_database):
        """
        You have to implement this method to specify how your database
        can connect to an ORM or driver.
        """
        pass

    def get_connection(self, use_database):
        """ Singleton: having only one _connection in your app """

        ##########################################################
        # **Warning**: to check if connection exists may change
        # From one db to another
        if self._connection != None:
            # A connection exists
            if self._connection.check_open and self._connection.check_open():
                self.log.debug("Already connected")
                return self._connection
            # else:
            #     print "OPEN?", self._connection.check_open(), self._connection
        ##########################################################

        self.log.info("Making connection")
        self._connection = self.make_connection(use_database)
        return self._connection

# === How to verify one object ===
# print Connection().get_connection() #2times
