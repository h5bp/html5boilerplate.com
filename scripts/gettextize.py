#!/usr/bin/env python
# encoding: utf-8;

from __future__ import with_statement

import re, os, sys
from optparse import OptionParser
from subprocess import PIPE, Popen

parse_re = re.compile ( r'{% blocktrans %}(.+?){% endblocktrans %}' )
escape_re = re.compile( r'(\')' )
blankout_re = re.compile( r'\S' )

localedir = "./locale"
languages = [ 'en_US', 'de_DE' ]

def _popen(cmd, stdin=None):
    """
    Friendly wrapper around Popen for Windows
    """
    p = Popen(cmd, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE, close_fds=os.name != 'nt', universal_newlines=True)
    return p.communicate(stdin)

def main():
    parser = OptionParser()
    parser.add_option(  "-d", "--domain", dest="domain", default='messages', metavar='DOMAIN',
                        help="The localization's 'domain' (used to create the message file's name)" )
    (options, args) = parser.parse_args()

    # from pprint import pprint

    if args[ 0 ]:
        with open( args[ 0 ], 'rU' ) as f:
            src = f.read()
            newsrc = []
            blocks = re.split( r'{% blocktrans %}', src )
            for block in blocks:
                try:
                    ( pre, post ) = re.split( r'{% endblocktrans %}', block )
                    newsrc.append( " gettext('%s') " % escape_re.sub( r'\\\1', pre ) )
                    newsrc.append( blankout_re.sub( 'X', post ) )
                except ValueError:  # No `post`
                    newsrc.append( blankout_re.sub( 'X', block ) )
        src = ''.join( newsrc )
        # print src

        cmd = "xgettext -L Perl --from-code UTF-8 -o - -"

        for locale in languages:
            basedir = os.path.join( localedir, locale, 'LC_MESSAGES' )
            if not os.path.isdir( basedir ):
                os.makedirs( basedir)

            pofile = os.path.join( basedir, '%s.po' % options.domain )
            potfile = os.path.join( basedir, '%s.pot' % options.domain )

            if os.path.exists(potfile):
                os.unlink(potfile)

            msgs, errors = _popen(cmd, src)
            msgs = re.sub( r'#: standard input:(\d+)', r'#: %s:\1' % args[ 0 ], msgs )
            print msgs

            if os.path.exists(potfile):
                # Strip the header
                msgs = '\n'.join( dropwhile( len, msgs.split( '\n' ) ) )
            else:
                msgs = msgs.replace( 'charset=CHARSET', 'charset=UTF-8' )

            with open( potfile, 'ab' ) as f:
                f.write(msgs)

            if os.path.exists(potfile):
                msgs, errors = _popen('msguniq --to-code=utf-8 "%s"' % potfile)
                if errors:
                    raise CommandError("errors happened while running msguniq\n%s" % errors)

                with open(potfile, 'w') as f:
                    f.write(msgs)

                if os.path.exists(pofile):
                    msgs, errors = _popen('msgmerge -q "%s" "%s"' % (pofile, potfile))
                    if errors:
                        raise CommandError("errors happened while running msgmerge\n%s" % errors)

                with open(pofile, 'wb') as f:
                    f.write(msgs)

                os.unlink(potfile)

if __name__ == "__main__":
    sys.exit(main())
