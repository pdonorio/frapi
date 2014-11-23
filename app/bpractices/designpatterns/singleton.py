"""
# === Singleton - Design Pattern ===

Examples of Singleton Patterns
    - taken from "Learning Python Design Patterns" by Gennadiy Zlobin
"""

# === Singleton Python 2 implementation ===

class Singleton(object):
    """
    This is the class that implements *the Singleton pattern* in a classic way
    """
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Singleton, cls).__new__(cls)
        return cls.instance

class Borg(object):
    """
    This is the class that implements the ***borg*** Singleton pattern for subClassing!
    """
    _shared_state = {}
    def __new__(cls, *args, **kwargs):
        obj = super(Borg, cls).__new__(cls, *args, **kwargs)
        obj.__dict__ = cls._shared_state
        return obj
