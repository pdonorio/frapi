# === Factory - Design Pattern ===

"""
Factory is creating
"""

class SimpleFactory(object):
    """ Simple factorying """

    @staticmethod # This decorator allows to run method without class instance
    def build_connection(protocol):
        if protocol == 'http':
            return "http" #create obj
        elif protocol == 'ftp':
            return "ftp"
        else:
            raise RuntimeError('Unknown protocol')

if __name__ == '__main__':
    protocol = raw_input('Which Protocol to use? (http or ftp): ')
    protocol = SimpleFactory.build_connection(protocol)
    #use obj
    print protocol
