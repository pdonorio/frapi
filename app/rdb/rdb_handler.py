"""
# === Models for NoSQL db ===
My python experiments with rethinkdb
"""

# === Libraries ===
import os

# Connection structure and rethink libraries
from bpractices.connections import Connection
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError
from rethinkORM import RethinkCollection
# Defined in [[data_models.py]]
from rdb.data_models import GenericORMModel
# log is a good advice
from bpractices.exceptions import LoggedError
# when often handling try/except, this decorator is very handful
from bpractices.decorators import TryExcept

# == Setup global constants ==

#Using docker, "**db**"" is my alias of the ReThinkDB container
RDB_HOST = "db"
#Docker forwarding port system var (otherwise use standard rethinkdb port)
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT') or 28015
#Database and tables to use
APP_DB = "webapp"
DEFAULT_TABLE = "test"
DEFAULT_COLLECTION = GenericORMModel

# == Utilities ==

def check_model(func):
    """ Decorator for methods who use the model """
    def wrapper(self, *args, **kwargs):
        #print "CHECK", self.model
        if self.model == None:
            raise LoggedError("DB fail: No ORM model defined yet")
        else:
            return func(self, *args, **kwargs)
    return wrapper

# == Database operation wrapper Class ==

class RethinkConnection(Connection):
    """
    A basic wrapper for ReThinkDB
    on top of the python ORM
    """

    # === Init ===
    _connection = None
    model = None
    _options = {"currentpage", "perpage"}

    def __init__(self, load_setup=False):
        """ My abstract method already connect by default """
        super(RethinkConnection, self).__init__(load_setup)

        #create and use DB? and table?
        if load_setup:
            self.setup()

    # === Connect ===
    def make_connection(self, use_database):
        """
        This method implements the abstract interface
        of the Connection class which makes use of a **Singleton Borg**
        design pattern.
        See it yourself at: [[connections.py]]
        You will connect only once, using the same object.

        Note: authentication is provided with admin commands to server,
        after starting it up, using ssh from app container.
        Expecting the environment variable to contain a key.
        """
        params = {"host":RDB_HOST, "port":RDB_PORT}
        key = os.environ.get('KEYDBPASS') or None
        if key != None:
            params["auth_key"] = key
            self.log.info("Connection is pw protected")
        else:
            self.log.warning("Using no authentication")

        # Rethinkdb database connection
        try:
            # IMPORTANT! The chosen ORM library does not work if missing repl()
            # at connection time
            self._connection = r.connect(**params).repl()
        except RqlDriverError, e:
            raise LoggedError("Failed to connect RDB", e)

        if use_database:
            try:
# TO FIX - the database should be a parameter
                self.log.info("Using database " + APP_DB)
                self._connection.use(APP_DB)
            except RqlDriverError, e:
                raise LoggedError("Database " + APP_DB + "doesn't exist", e)

        self.log.debug("Created Connection")
        return self._connection

    def setup(self):
        """
        Rethinkdb init. Should be called on an empty ReThinkDB server.
        The idea is to create database and main table to work with.
        API will give errors with void data.
        """

        # Note: at the present no way to check connection existence # in rethink
        # But using the Connection class database should be already connected
        #self.get_connection(False)

        # Connected without db to create it if already exists
        try:
            r.db_create(APP_DB).run()
            self.log.debug("Creating Database '" + APP_DB + "'")
        except RqlRuntimeError:
            self.log.debug("Database '" + APP_DB + "' exists ")

    # == This handler base its operation on ORM models ==

    def define_model(self, model=DEFAULT_COLLECTION):
        """ Define which model will be used
        for DB operations and also for API definition """
        self.model = model

    # === Table ===
    @check_model
    def create_table(self, table=None, remove_existing=False):
        """ Creating a table if not exists,
        taking for Granted the DB already exists """

        if table == None:
            table = self.model.table

        if table in r.table_list().run():
            self.log.debug("Table '" + table + "' already exists.")
            if remove_existing:
                r.table_drop(table).run()
                self.log.info("Removed")
        else:
        #if table not in r.table_list().run():
            r.table_create(table).run()
            self.log.info("Table '" + table + "' created")

    @staticmethod
    def get_parameters_with_defaults(params):

        # Cycle kwargs and use them directly
        # This helps the dynamic usage of api parameters
        p = {}

        # save parameters
        for name in params:
            p[name] = params.get(name)

        # set defaults for paging
        if "perpage" in p:
            if p["perpage"] == None:
                p["perpage"] = 10
            if p["currentpage"] == None:
                p["currentpage"] = 1

        #print p    #DEBUG?
        return p

    # === Search ===
    @check_model
    @TryExcept("DB table does not exist yet", RqlRuntimeError)
    def search(self, **kwargs):
        """ Search elements in an ORM table/model """

        table = self.model.table
        self.log.debug("Searching rdb table '" + table + "'")
        p = RethinkConnection.get_parameters_with_defaults(kwargs)

        # Case with arguments
        if p["id"] != None:
            # Note: 'get_all' works, don't know why 'get' doesn't
            query = r.table(table).get_all(p["id"], index='id')
        # Case no arguments (all table)
        else:
            query = r.table(table)

        # === Filter* ===
        # filt = {"where":"silence"}
        # collection = RethinkCollection(DataDump, filter=filt)
        # result = collection.fetch()

        # Note: i should not check if i cannot find any data.
        out = {}
        count = 0
        # As Api i should just return empty json if nothing is there
        # from my query
        if not query.is_empty().run():

            # Get total query count
            count = query.count().run()

            # Slice for pagination
            if "currentpage" in p and "perpage" in p:
                start = (p["currentpage"] - 1) * p["perpage"]
                end = p["currentpage"] * p["perpage"]
                #this does not work: WHY??
                #out = query.skip(start).limit(end).run()
                out = query.slice(start, end).run()
            else:
                out = query.run()

        # Warning: out is a cursor and can be used in two ways:
        # 1. use the for cycle
        # 2. use list(out) to get a vector
        return (count, out)

    def remove_options(self, data_dict):

        for i in self._options:
            if i in data_dict:
                del data_dict[i]
        return data_dict

    # === Insert ===
    @check_model
    @TryExcept("DB table does not exist", RqlRuntimeError)
    def insert(self, data_dict, force_id=None):
        """ Data insert in a table/collection
        Note: rdb cannot take the id value inside the whole data.
        Make sure you pop that out as 'force_id' """

        # Should create table if not exists? I think not
        #table = self.model.table
        #self.create_table(table) #, True)

        # Some options are used only as parameters and should not be saved
        data = self.remove_options(data_dict)

        # Skip if empty
        if data.__len__() < 1:
            return self

        # Save data inside the choosed model
        model_data = self.model(**data)

        if force_id != None:
            # Force key of this data row. Usefull for updates?
            # Warning: if it's not a string the index will not work :O
            model_data.id = str(force_id)
        model_data.save()
        # Return the index key
        return model_data.id

    # === Update ===
# TO FIX - set update method
# check if id exists
    """
    replace vs update
    Both replace and update operations can be used to modify one or multiple rows. Their behavior is different:

    replace will completely replace the existing rows with new values
    update will merge existing rows with the new values [i think this is better]
    """

    # === Delete ===
    @check_model
    @TryExcept("DB table does not exist yet", RqlRuntimeError)
    def remove(self, key):
        """ Remove an element from database (based on primary key) """

        q = r.table(self.model.table)

        self.log.info("Deleting key '" + key + "'")
        out = q.get_all(key, index="id").delete().run()
        if out['deleted']:
            self.log.debug('Removed')
        else:
            raise LoggedError('Failed to remove key ' + key)

        return True

    # === Connection Close ===
    def close(self):
        self.log.info("Closing connection")
        return self._connection.close()

    # PAGINATION?
    #r.table("posts").order_by("date").slice(11,21).run(conn)

    # === Exit? === inside destructor?
    #self._connection.close()
