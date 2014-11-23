# -*- coding: utf-8 -*-
"""
In case something bad happens i should be able to save any error
inside an Exception collector
[ N.B. with a static logger inside ]
"""

import sys, os, inspect
from bpractices.logger import log

class LoggedError(Exception):
    """
    An object to log Exceptions.
    warning: This cannot work without a logger.Logger class
    Feel free to use your own Exception or a standard one
    """

    def __init__(self, msg='No msg', obj=None, log_obj=None):
        super(LoggedError, self).__init__()

        self.last_error = msg
        self.exception = obj

        """
        # To get last caller...
        curframe = inspect.currentframe()
        calframe = inspect.getouterframes(curframe, 2)
        print calframe
        print 'caller name:', calframe[1][3]

        # Find out file name and line number:
        # http://stackoverflow.com/a/1278740
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        msg += "\t[@" + fname + ":" + exc_tb.tb_lineno.__str__() + "]"
        """

        # Static logging or use the obj received
        if log_obj == None:
            log_obj = log.get_logger(self.__class__.__name__)

        # Smart add of exception messagge only for adminer
        try:
            msg += ". " + self.exception.__str__()
        except Exception:
            log_obj.info("Trapped exception has no string message")

        # warning, error or critical? how to check?
        log_obj.warning(msg)

    def __str__(self):
        return self.last_error
