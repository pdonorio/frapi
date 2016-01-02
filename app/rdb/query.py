# -*- coding: utf-8 -*-

""" RDB most simple handler i could write """

# This Rethinkdb reference is already connected at app init
from rdb.rdb_handler import r, RDBdefaults


##########################################
# ## RethinkBD quick class
class RDBquery(RDBdefaults):
    """ An object to query Rethinkdb """

    def get_table_query(self, table=None):
        if table is None:
            table = self.table
        # Build a base query: starting from default DB from RDBdefaults.
        base = r.db(self.db)
        # Create
        if table not in base.table_list().run():
            base.table_create(table).run()
        # Use the table
        return base.table(table)

    def get_content(self, myid=None):

        data = {}
        query = self.get_table_query()
        if myid is not None:
            query = query.get_all(myid, index='id')

        count = 0
        if not query.is_empty().run():
            count = query.count().run()
            data = query.run()

        # # Recover only one document
        # document = query.get(myid).run()
        # if document is not None:
        #     document.pop('id')

        return (count, list(data))

    def insert(self, data, user=None):
        # Prepare the query
        query = self.get_table_query()
        # Add extra info: (ip, timestamp, user)
        data['infos'] = self.save_action_info(user)
        # Execute the insert
        rdb_out = query.insert(data).run()
        # Get the id
        return rdb_out['generated_keys'].pop()
