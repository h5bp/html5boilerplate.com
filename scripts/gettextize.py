#!/usr/bin/env python
# encoding: utf-8;

from __future__ import with_statement

import re, os, sys
from optparse import OptionParser
from subprocess import PIPE, Popen
from gettext import translation

parse_re = re.compile ( r'{% blocktrans %}(.+?){% endblocktrans %}' )
escape_re = re.compile( r'(\')' )
blankout_re = re.compile( r'\S' )

localedir = "./locale"
languages = [ 'en_US', 'de_DE' ]

class LocalizerGettextException( BaseException ):
    pass

class Localizer( object ):
    GETTEXT = 0
    PUTTEXT = 1

    XGETTEXT_CMD    = u'xgettext -L Perl --from-code=utf-8 -o - -'
    MSGUNIQ_CMD     = u'msguniq --to-code=utf-8 "%s"'
    MSGMERGE_CMD    = u'msgmerge -q "%s" "%s"'

    def __init__( self, dir, domain ):
        self.dir        = dir
        self.domain     = domain
        self.localebase = './locale'
        self.buildbase  = './build'

    def localedir( self, locale ):
        return os.path.join( self.localebase, locale, 'LC_MESSAGES' )

    def mopath( self, locale ):
        return os.path.join( self.localedir( locale ), "%s.mo" % self.domain )

    def popath( self, locale ):
        return os.path.join( self.localedir( locale ), "%s.po" % self.domain )

    def potpath( self, locale ):
        return os.path.join( self.localedir( locale ), "%s.pot" % self.domain )

    def gettextize( self, file, locale ):
        src     = self.templatize( file, Localizer.GETTEXT, locale )

        basedir = self.localedir( locale )
        if not os.path.isdir( basedir ):
            os.makedirs( basedir)
        pofile = self.popath( locale )
        potfile = self.potpath( locale )

        if os.path.exists( potfile ):
            os.unlink( potfile )

        msgs, errors = _popen( Localizer.XGETTEXT_CMD, src )
        msgs = re.sub( r'#: standard input:(\d+)', r'#: %s:\1' % file, msgs )

        if os.path.exists( potfile ):
            msgs = '\n'.join( dropwhile( len, msgs.split( '\n' ) ) )
        else:
            msgs = msgs.replace( u'charset=CHARSET', u'charset=UTF-8' )

        with open( potfile, 'ab' ) as f:
            f.write( msgs )

        if os.path.exists( potfile ):
            msgs, errors = _popen( Localizer.MSGUNIQ_CMD % potfile)
            if errors:
                raise LocalizerGettextException( u"`msguniq` errors: %s" % errors )

            with open( potfile, 'wb' ) as f:
                f.write( msgs )

            if os.path.exists(pofile):
                msgs, errors = _popen( Localizer.MSGMERGE_CMD % ( pofile, potfile ) )
                if errors:
                    raise LocalizerGettextException( u"`msmerge` errors: %s" % errors )

            with open( pofile, 'wb' ) as f:
                f.write( msgs )

            os.unlink( potfile )

    def puttextize( self, file, locale ):
        l10n    = translation( domain=self.domain, localedir=self.localebase, languages=[ locale ] )
        src     = self.templatize( file=file, type=Localizer.PUTTEXT, locale=locale, l10n=l10n )

        outfile = re.sub( r'^\./src', r'./build/%s' % locale, file )
        dir = os.path.normpath( os.path.join( os.path.dirname( outfile ) ) )
        if not os.path.isdir( dir ):
            os.makedirs( dir )

        with open( outfile, 'wb' ) as f:
            f.write( src.encode( 'utf-8' ) )

    def compile( self, locale ):
        mo          = self.mopath( locale )
        po          = self.popath( locale )
        cmd         = 'msgfmt --check-format -o "%s" "%s"' % ( mo, po )
        (msgs, errors ) = _popen( cmd )
        if errors:
            raise LocalizerGettextException( u"`msgfmt` errors: %s" % errors )

    def templatize( self, file, type, locale, l10n=None ):
        with open( file, 'rU' ) as f:
            src     = f.read()
            newsrc  = []
            blocks  = re.split( r'{% blocktrans %}', src )
            
            for block in blocks:
                try:
                    ( pre, post ) = re.split( r'{% endblocktrans %}', block )
                    if type is Localizer.GETTEXT:
                        newsrc.append( u" gettext('%s') " % escape_re.sub( r'\\\1', pre ) )
                        newsrc.append( blankout_re.sub( u'X', post ) )
                    else:
                        newsrc.append( self.translate( pre, l10n ) )
                        newsrc.append( post )
                except ValueError:  # No `post`
                    if type is Localizer.GETTEXT:
                        newsrc.append( blankout_re.sub( u'X', block ) )
                    else:
                        newsrc.append( block )

        return ''.join( newsrc )

    def translate( self, string, l10n ):
        return l10n.ugettext( string )

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
    parser.add_option(  "-c", "--compile", dest="compile", default=False, action="store_true",
                        help="Compile all `.po` files into `.mo` binaries." )
    parser.add_option(  "-r", "--render", dest="render", default=False, action="store_true",
                        help="Render all files in their respective languages." )
                        
    (options, args) = parser.parse_args()

    l10n = Localizer( dir='omg', domain=options.domain )

    if options.compile:
        for locale in languages:
            l10n.compile( locale )
    elif options.render:
        for locale in languages:
            l10n.puttextize( args[ 0 ], locale )
    else:
        if args[ 0 ]:
            for locale in languages:
                src = l10n.gettextize( args[ 0 ], locale )

if __name__ == "__main__":
    sys.exit(main())
