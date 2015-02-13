import unicodedata, types

def get_classes_from_module(mod):
    return dict([(name, cls) \
        for name, cls in mod.__dict__.items() if isinstance(cls, type)])

def get_original_pytype(s):
    """
    Try to check if string or unicode api input
    is actually a number (real or integer) or a string
    """

    new_value = None

    # Check float
    try:
        new_value = float(s)
    except ValueError:
        pass

    # Check unicode numeric
    if new_value == None:
        try:
            new_value = unicodedata.numeric(s)
        except (TypeError, ValueError):
            pass

    # Check integer
    if new_value != None and new_value.is_integer():
        new_value = int(new_value)

    # Check unicode string
    if new_value == None and isinstance(s, types.UnicodeType):
        new_value = s.encode('ascii', 'ignore')

    # Check normal string
    if new_value == None and isinstance(s, types.StringType):
        new_value = str(s)

    return new_value