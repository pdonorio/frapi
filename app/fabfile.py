# -*- coding: utf-8 -*-
"""
Fabric from opbeat

Launch a release:
$ docker run -it -v (pwd):/opt -w /opt/app frapi_devapi fab register_deployment:/opt

"""

from fabric.api import runs_once, lcd, local, task
from fabric.context_managers import shell_env
from security.config import DevelopmentConfig

@task
@runs_once
def register_deployment(git_path):
    with(lcd(git_path)):
        with shell_env(URL=DevelopmentConfig.OPBEAT_RELURL, BEAR=DevelopmentConfig.OPBEAT_BEAR):
            local('curl $URL'
                  ' -H "Authorization: Bearer $BEAR "'
                  ' -d rev=`git log -n 1 --pretty=format:%H`'
                  ' -d branch=`git rev-parse --abbrev-ref HEAD`'
                  ' -d status=completed')

"""
Call register_deployment with a local path
that contains a .git directory after a release has been deployed.
"""