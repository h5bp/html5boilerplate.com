#!/usr/bin/env python
# encoding: utf-8;

from __future__ import with_statement

import re, os, sys
from optparse import OptionParser
from subprocess import PIPE, Popen
from gettext import translation
from itertools import dropwhile
import codecs
from shutil import copyfile

class LocalizerGettextException( BaseException ):
    pass

class Localizer( object ):
    GETTEXT = 0
    PUTTEXT = 1
    TEMPLATE_EXTS   = [ '.html', '.js', '.css', '.xml', '.txt', '.markdown' ]
      
    ESCAPE_RE       = re.compile( r'(\')' )
    BLANKOUT_RE     = re.compile( r'\S' )

    XGETTEXT_CMD    = u'xgettext -L Perl --from-code=utf-8 -o - -'
    MSGUNIQ_CMD     = u'msguniq --to-code=utf-8 "%s"'
    MSGMERGE_CMD    = u'msgmerge -q "%s" "%s"'

    def __init__( self, domain, inputbase, localebase, outputbase, languages ):
        self.dir        = dir
        self.domain     = domain
        self.inputbase  = inputbase
        self.localebase = localebase
        self.outputbase = outputbase
        self.languages  = languages

    def localedir( self, locale ):
        return os.path.join( self.localebase, locale, 'LC_MESSAGES' )

    def mopath( self, locale ):
        return os.path.join( self.localedir( locale ), "%s.mo" % self.domain )

    def popath( self, locale ):
        return os.path.join( self.localedir( locale ), "%s.po" % self.domain )

    def potpath( self, locale ):
        return os.path.join( self.localedir( locale ), "%s.pot" % self.domain )

    def xgettext( self, file, locale ):
        src     = self.templatize( file, Localizer.GETTEXT, locale )

        potfile = self.potpath( locale )

        msgs, errors = _popen( Localizer.XGETTEXT_CMD, src.encode( 'utf-8' ) )
        msgs = re.sub( r'#: standard input:(\d+)', r'#: %s:\1' % file, msgs )
        if os.path.exists( potfile ):
            msgs = '\n'.join( dropwhile( len, msgs.split( '\n' ) ) )
        else:
            msgs = msgs.replace( u'charset=CHARSET', u'charset=UTF-8' )

        with open( potfile, 'ab' ) as f:
            f.write( msgs )

    def xgettext_preprocessing( self, locale ):
        basedir = self.localedir( locale )
        if not os.path.isdir( basedir ):
            os.makedirs( basedir)

        potfile = self.potpath( locale )
        if os.path.exists( potfile ):
            os.unlink( potfile )

    def xgettext_postprocessing( self, locale ):
        pofile  = self.popath( locale )
        potfile = self.potpath( locale )

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
        outfile = re.sub( r'^\%s' % self.inputbase, r'%s/%s' % ( self.outputbase, locale ), file )
        dir     = os.path.normpath( os.path.join( os.path.dirname( outfile ) ) )

        if not os.path.isdir( dir ):
            os.makedirs( dir )

        basename, extension = os.path.splitext( file )
        if extension in Localizer.TEMPLATE_EXTS:
            src = self.templatize( file=file, type=Localizer.PUTTEXT, locale=locale, l10n=l10n )
            with open( outfile, 'wb' ) as f:
                f.write( src.encode( 'utf-8' ) )
        else:
            copyfile( file, outfile )

    def gettext( self, locale ):
        self.xgettext_preprocessing( locale )
        for root, dirs, files in os.walk( self.inputbase ):
            for name in files:
                basename, extension = os.path.splitext( name )
                if extension in Localizer.TEMPLATE_EXTS:
                    self.xgettext( os.path.join( root, name ), locale )
        self.xgettext_postprocessing( locale )

    def puttext( self, locale ):
        for root, dirs, files in os.walk( self.inputbase ):
            for name in files:
                self.puttextize( os.path.join( root, name ), locale )

    def compile( self, locale ):
        mo          = self.mopath( locale )
        po          = self.popath( locale )
        cmd         = 'msgfmt --check-format -o "%s" "%s"' % ( mo, po )
        (msgs, errors ) = _popen( cmd )
        if errors:
            raise LocalizerGettextException( u"`msgfmt` errors: %s" % errors )

    def templatize( self, file, type, locale, l10n=None ):
        with codecs.open( file, 'rU', 'utf-8' ) as f:
            src     = f.read()
            newsrc  = []
            blocks  = re.split( r'{% blocktrans %}|<blocktrans>|<!-- blocktrans -->|/\* blocktrans \*/', src )
            
            for block in blocks:
                try:
                    ( pre, post ) = re.split( r'{% endblocktrans %}|</blocktrans>|<!-- /blocktrans -->|/\* /blocktrans \*/', block )
                    if type is Localizer.GETTEXT:
                        newsrc.append( u" gettext('%s') " % Localizer.ESCAPE_RE.sub( r'\\\1', pre ) )
                        newsrc.append( Localizer.BLANKOUT_RE.sub( u'X', post ) )
                    else:
                        newsrc.append( self.translate( pre, l10n ) )
                        newsrc.append( post )
                except ValueError:  # No `post`
                    if type is Localizer.GETTEXT:
                        newsrc.append( Localizer.BLANKOUT_RE.sub( u'X', block ) )
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
    parser.add_option(  "-l", "--locale", dest="localebase", default="./locale", metavar="DIR",
                        help="The directory where the .po/.mo files ought be located" )
    parser.add_option(  "-o", "--output", dest="outputbase", default="./build", metavar="DIR",
                        help="The directory into which translated files ought be rendered." )
    parser.add_option(  "-i", "--input", dest="inputbase", default="./src", metavar="DIR", 
                        help="The directory from which to read the translation templates." )
    parser.add_option(  "--languages", dest="languages", default="en_US,de_DE", metavar="LANG1,LANG2,LANG3...",
                        help="A comma seperated list of the languages in which translations should be made." )

    (options, args) = parser.parse_args()
    options.languages = options.languages.split( ',' )

    l10n = Localizer(   domain=options.domain, outputbase=options.outputbase, 
                        inputbase=options.inputbase, localebase=options.localebase,
                        languages=options.languages )

    if options.compile:
        for locale in options.languages:
            l10n.compile( locale )
    elif options.render:
        for locale in options.languages:
            l10n.puttext( locale )
    else:
        for locale in options.languages:
            src = l10n.gettext( locale )

if __name__ == "__main__":
    sys.exit(main())
