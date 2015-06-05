# -*- coding: utf-8 -*-
""" Executor of shell commands """

import six, re, subprocess as shell
# Set log
from bpractices.logger import log
logger = log.get_logger(__name__)

class PyShell(object):
    """A handler for command processing via unix bash/shell"""

    cmd = []

    def __init__(self, command=None):
        super(PyShell, self).__init__()
        # Execute command if any
        if command != None:
            self.add_command(command)
            self.execute()

    def add_command(self, command):
        """ Split a command to be executed via python subprocess """

        if not isinstance(command, six.string_types):
            raise BaseException("Command must be string. Error with: "+ str(command))

        for piece in re.compile("\s+").split(command.strip()):
            self.cmd.append(piece)

        logger.debug("Added command: " + command)
        #print self.cmd

    def execute(self, cmd=None):
        """ Test """

        # Execute current command?
        if cmd == None:
            cmd = self.cmd
        # Print the command via log
        cmdstring = " ".join(cmd)
        logger.info("Executing:\t" + cmdstring)

        try:
            # Create the process
            proc = shell.Popen(cmd, stdout=shell.PIPE, stderr=shell.PIPE)
        except OSError, e:
            raise BaseException("Could not find command:" + e.__str__())

        # Wait for process to end
        out, err = proc.communicate()
        out = out.decode(encoding='UTF-8')

        # Handle output:
        # Status OK
        if proc.returncode == 0:
            if out != None and out != "":
                logger.info("Comm output: " + out.__str__())
        # Status ERR
        else:
            msg = "Could not process shell command:\n" + cmdstring + "\n" + \
                ". Error: " + err.__str__()
            logger.critical(msg)
            raise BaseException(msg)

