
#bind = "127.0.0.1:5000"
bind = "0.0.0.0:5000"

#import multiprocessing
#workers = multiprocessing.cpu_count() * 2 + 1
workers = 2

x_forwarded_for_header = 'X-Forwarded-IP'
forwarded_allow_ips = '127.0.0.1'

accesslog = "/tmp/logs/guni.log"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"' \
    + ' "%({X-Forwarded-Host}i)s"' \
    + ' "%({X-Forwarded-For}i)s"' \
    + ' "%({X-Forwarded-IP}i)s"' \
    + ''

# def pre_request(worker, req):
#     print "TEST ME", worker, dir(req)
#     #worker.log.debug("%s %s" % (req.method, req.path))
