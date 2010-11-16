#!/usr/bin/env python
# encoding: utf-8;

###########################################################################
#
#   static_gettext: Localization for static documents
#   http://projects.mikewest.org/static_gettext/
#   
#   Version:    0.11
#
#   static_gettext is an internationalization framework for static,
#   plaintext documents and templates. It’s geared towards straightforward
#   translation of static websites, but can be easily used for any set of
#   files you’d like to translate as a group.
#
#   (c)2010 Mike West, BSD licensed ( http://github.com/mikewest/static_gettext/blob/master/LICENSE.markdown )
#

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
    DEFAULT_EXTS   = [ '.html', '.js', '.css', '.xml', '.txt', '.markdown' ]
      
    ESCAPE_RE       = re.compile( r'(\')' )
    BLANKOUT_RE     = re.compile( r'\S' )

    XGETTEXT_CMD    = u'xgettext -L Perl --from-code=utf-8 -o - -'
    MSGUNIQ_CMD     = u'msguniq --to-code=utf-8 "%s"'
    MSGMERGE_CMD    = u'msgmerge -q "%s" "%s"'

    def __init__( self, domain, inputbase, localebase, outputbase, languages, extensions=None ):
        self.dir        = dir
        self.domain     = domain
        self.inputbase  = inputbase
        self.localebase = localebase
        self.outputbase = outputbase
        self.languages  = languages
        if extensions is None:
            self.extensions = Localizer.DEFAULT_EXTS
        else:
            self.extensions = extensions

    @staticmethod
    def gettextIsAvailable():
        requirements = { 'xgettext': False, 'msguniq': False , 'msgmerge': False }
        for path in os.environ["PATH"].split( os.pathsep ):
            for name in requirements:
                file = os.path.join( path, name )
                if not(requirements[name]) and os.path.exists(file) and os.access(file, os.X_OK):
                    requirements[name] = True;

        for name in requirements:
            if not requirements[name]:
                return False

        return True

    @staticmethod
    def getLocaleDirection( locale ):
        # Directionality culled from http://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
        langToDir = {
            "ar":   "rtl",  # Arabic
            "arc":  "rtl",  # Aramaic
            "dv":   "rtl",  # Divehi
            "fa":   "rtl",  # Persian
            "ha":   "rtl",  # Hausa
            "he":   "rtl",  # Hebrew
            "ks":   "rtl",  # Kashmiri
            "ku":   "rtl",  # Kurdish
            "ps":   "rtl",  # Pashto
            "ur":   "rtl",  # Urdu
            "yi":   "rtl"   # Yiddish
        }
        return langToDir.get( locale, "ltr" )

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
        if extension in self.extensions:
            src = self.templatize( file=file, type=Localizer.PUTTEXT, locale=locale, l10n=l10n )

            # Replace `{{ LANGUAGE_CODE }}` with a BCP47 language tag:
            src = src.replace( r'{{ LANGUAGE_CODE }}', locale.lower().replace( '_', '-' ) )

            # Replace `{{ LANGUAGE_DIRECTION }}` with `ltr` or `rtl`, depending:
            src = src.replace( r'{{ LANGUAGE_DIRECTION }}', Localizer.getLocaleDirection( locale ) ) 

            with open( outfile, 'wb' ) as f:
                f.write( src.encode( 'utf-8' ) )
        else:
            copyfile( file, outfile )

    def gettext( self, locale ):
        self.xgettext_preprocessing( locale )
        for root, dirs, files in os.walk( self.inputbase ):
            for name in files:
                basename, extension = os.path.splitext( name )
                if extension in self.extensions:
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
            blocks  = re.split( r'{% blocktrans (?:with "((?:\\"|[^"])*)" as (\w+) )?%}|<blocktrans>|<!-- blocktrans -->|/\* blocktrans \*/', src )

            ( value, key ) = ( None, None )
            while len( blocks ) > 0:
                block = blocks.pop(0)
                if len(blocks) >= 2:
                    ( nextValue, nextKey ) = ( blocks.pop(0), blocks.pop(0) )
                else:
                    ( nextValue, nextKey ) = ( None, None )
                try:
                    ( pre, post ) = re.split( r'{% endblocktrans %}|</blocktrans>|<!-- /blocktrans -->|/\* /blocktrans \*/', block )
                    if type is Localizer.GETTEXT:
                        newsrc.append( u" gettext('%s') " % Localizer.ESCAPE_RE.sub( r'\\\1', pre ) )
                        newsrc.append( Localizer.BLANKOUT_RE.sub( u'X', post ) )
                    else:
                        if key is not None and value is not None:
                            newsrc.append( self.translate( pre, l10n ).replace( "{{ %s }}" % key, value ) )
                        else:
                            newsrc.append( self.translate( pre, l10n ) )

                        newsrc.append( post )
                except ValueError:  # No `post`
                    if type is Localizer.GETTEXT:
                        newsrc.append( Localizer.BLANKOUT_RE.sub( u'X', block ) )
                    else:
                        newsrc.append( block )

                ( value, key ) = ( nextValue, nextKey )

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
    parser.add_option(  "-m", "--make-messages", dest="makemessages", default=False, action="store_true",
                        help="Generate message files in target languages" )
    parser.add_option(  "-b", "--build", dest="build", default=False, action="store_true",
                        help="Build localizations in target languages" )
    parser.add_option(  "-l", "--locale", dest="localebase", default="./locale", metavar="DIR",
                        help="The directory where the .po/.mo files ought be located" )
    parser.add_option(  "-o", "--output", dest="outputbase", default="./build", metavar="DIR",
                        help="The directory into which translated files ought be rendered." )
    parser.add_option(  "-i", "--input", dest="inputbase", default="./src", metavar="DIR", 
                        help="The directory from which to read the translation templates." )
    parser.add_option(  "-e", "--extensions", dest="extensions", default=".html,.js,.css,.txt,.xml,.markdown", metavar=".EXT1,.EXT2,.EXT3,...",
                        help="File extensions which ought to be parsed for translatable strings (Defaults to `.html,.js,.css,.txt,.xml,.markdown`)" )
    parser.add_option(  "--languages", dest="languages", default="en_US,de_DE", metavar="LANG1,LANG2,LANG3,...",
                        help="A comma seperated list of the languages in which translations should be made. (Defaults to `en_US,de_DE`)" )

    (options, args) = parser.parse_args()
    options.languages = options.languages.split( ',' )
    options.extensions = options.extensions.split( ',' )

    l10n = Localizer(   domain=options.domain, outputbase=options.outputbase, 
                        inputbase=options.inputbase, localebase=options.localebase,
                        languages=options.languages, extensions=options.extensions )
    
    if not Localizer.gettextIsAvailable():
        parser.error( "Couldn't find `gettext` in your PATH.  Can you please verify that it's correctly installed? (See http://www.gnu.org/software/gettext/#downloading )" );
    else:
        if options.build:
            for locale in options.languages:
                l10n.compile( locale )
                l10n.puttext( locale )
        else:
            for locale in options.languages:
                src = l10n.gettext( locale )

if __name__ == "__main__":
    sys.exit(main())
