
################################################
# Wait for rethinkdb ?
import os, time
import rethinkdb as r
from rethinkdb.errors import RqlDriverError
RDB_HOST = "db"
RDB_PORT = os.environ.get('DB_PORT_28015_TCP_PORT')

if RDB_PORT != None:
    testdb = True
    while testdb:
        try:
            r.connect(host=RDB_HOST, port=RDB_PORT)
            print "Yeah"
            testdb = False
        except RqlDriverError, e:
            print "Not reachable yet"
        time.sleep(2)

################################################
# Change this from outside
bind = "127.0.0.1:5000"

################################################
import multiprocessing
workers = multiprocessing.cpu_count() +1 #* 2 + 1

accesslog = "/tmp/logs/guni.log"
access_log_format = '%(h)s %(l)s %(u)s %(t)s ' \
    + '"%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"' \
    + ' "%({X-Forwarded-Host}i)s"' \
    + ' "%({X-Forwarded-IP}i)s"' \
    + ''

# x_forwarded_for_header = 'X-Forwarded-IP'
# forwarded_allow_ips = '127.0.0.1'
# def pre_request(worker, req):
#     print "TEST ME", worker, dir(req)
#     #worker.log.debug("%s %s" % (req.method, req.path))

################################################
