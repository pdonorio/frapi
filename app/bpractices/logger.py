# -*- coding: utf-8 -*-
"""
#=== My class to log them all ===
"""

#filename where to write logs
LOGDIR = '/tmp/logs'
LOGFILE = 'pyapp.log'
#string for formatting logs
FORMAT = '%(asctime)-15s [%(name)-8s|%(levelname)-8s] %(message)s'
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

import os#, errno
import logging, logging.handlers

class GlobalLogs(object):
    """ Try to keep every log here """

    _logs = {}
    _logger = None
    _debug_level = None

    def __init__(self, debug_level=logging.DEBUG):
        """ Save a logger also for the object itself """
        super(GlobalLogs, self).__init__()
        self._debug_level = debug_level
        self._logger = self.get_logger(self.__class__.__name__)

    @staticmethod
    def get_formatter():
        """ specifications on how to write logs """
        return logging.Formatter(fmt=FORMAT, datefmt=DATE_FORMAT)

    def create_dir(self, directory):
        """ attempt to create dir, handle errors """
        if not os.path.exists(directory):
            try:
                os.makedirs(directory)
            except OSError:
                self._logger.error("Failed to create dir '" + directory + "'")

    def get_logger(self, log_name="Unknown"):
        """ Give a new logger if not saved before """
        if log_name not in self._logs:
            self._logs[log_name] = self.setup_istance(log_name)
        return self._logs[log_name]

    def setup_istance(self, log_name, logobj=None, write_to_screen=True, write_to_file=True):
        """ set file rotate and/or screen for other apps like flask """

# TO FIX - this should read from a fixed config file

        if logobj == None:
            # Create new logger if not provided
            logobj = logging.getLogger(log_name)
            if self._logger != None:
                self._logger.debug("Created new logger '" + log_name +"'")
        else:
            # Remove all old handlers on existing logger
            for hdlr in logobj.handlers:
                logobj.removeHandler(hdlr)
        logobj.setLevel(logging.DEBUG)

        if write_to_screen:
            handler = logging.StreamHandler()
            handler.setFormatter(GlobalLogs.get_formatter())
            logobj.addHandler(handler)

        if write_to_file:
            # check directory existence and use file inside
            self.create_dir(LOGDIR)
            # use the same file for all apps
            filepath = LOGDIR + "/" + LOGFILE
            # rotating file
            handler = logging.handlers.TimedRotatingFileHandler(filepath, when='D')
            handler.setFormatter(GlobalLogs.get_formatter())
            logobj.addHandler(handler)

        return logobj

""" In case i want to override the logging method
to save more complex data

        from message import _

        # string case
        if isinstance(message, basestring):
            method('string: \"%s\"', message)
        # structured - make use of serialization from message module
        else:
            method(_('', array=message))
"""

log = GlobalLogs()

# === The end ===
