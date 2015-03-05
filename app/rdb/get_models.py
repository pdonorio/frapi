"""
Recover all models available and set them up inside one vector
"""

# Data models from DB ORM
from rdb import data_models
# Recover info from a module inspect
from bpractices.utilities import get_classes_from_module

# Get the list of ORM classes/models
clss = get_classes_from_module(data_models)
# Resources factory: create as many as there are ORM models
models = {}
for (name, data_model) in clss.iteritems():
    # Skip the basic models
    if name == "RethinkModel" or name == "GenericORMModel":
        continue
    #print name
    models[name] = data_model
