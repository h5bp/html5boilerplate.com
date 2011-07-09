
## updating the docs
    
    # has to happen from -site folder
    cd src/docs/wiki-upstream/ && git pull origin master && cd ../../..
    h5bp-docs --verbose --server --src src/docs/wiki-upstream/ --dest src/docs/ --baseurl /docs/
    
_from a fresh repo, will most likely need a `git submodule update --init` to get the wiki files_

## docs folder structure


    layout.html                     # main layout file, a mustache template
    |
    public/                         # default assets folder (css, js, img, ...) copied over /{baseurl}/public/
      |
      +- css/                       # copied over /{baseurl}/public/css
        |
        +- style.css
        |
      +- js/                        # copied over /{baseurl}/public/js
      |
      +- ...                        # etc.
    |
    wiki-upstream/                  # src folder, usually a git clone or submodule to the project wiki
    |
    wiki-site/                      # or any other directory name, usually defined using --dest option
    
    
Even if it's possible to run the command with src/docs as --dest options, things become messy. generated website would go along files like the wiki-upstream, layout files may be overriden. It's best to dissociate src folder, dest one and files used to generate the website (layout file as --layout, public folder and assets as --assets) + issue with .htaccess file (see note below)

docs files used to generate the website could also go in other folder as long as h5bp-docs knows where to locate the files.

## Configuration

The order of precedence for conflicting settings is:

* Command-line flags
* a special --config flag. a path to a local config.js file.
* Defaults (h5bp-docs/conf/config.js)

This is the defaults:

```javascript
{
  // --server, when set to true, will start a connect static server once generation is done
  server: false,
  
  // server port used if --server flag provided
  port: 4000,
  
  // destination folder, place where pages are generated
  dest: "./dest",
  
  // a single layout files with {{{ content }}} placeholder
  // this is a relative path, the default one use h5bp-docs index.html
  layout: "./index.html",
  
  // baseurl, allow you to prefix href to page and static assets with {{baseurl}} in the layout template
  baseurl: '/docs/',
  
  // allowed extensions, all other files are ignored 
  ext: ['md', 'markdown', 'mkd'],
  
  // Enable verbose output (defaults false)
  verbose: false
}
```

## Notes

##### dest not empty

_Note: You may have the following stack trace with .htaccess file:-

    Writing Home Page to  /path/to/generated/website/docs/index.html
    h5bp-docs:  .htaccess  ->  .htaccess/index.html

    fs.js:221
      return binding.open(path, stringToFlags(flags), mode);
                     ^/path/to/generated/website/docs/index.html
    Error: EBADF, Bad file descriptor '/path/to/generated/html5boilerplate-site/src/docs/.htaccess/index.html'
    
By deleting the .htaccess, h5bp-docs can create the /.htaccess/ folder and write to its index.html file. We may just warn the user and pass along the next file if for any reasong, there is conflicting files in dest folder.

##### non-recursive mkdir

that's something which is not supported yet and would need a little bit of rewrite, but it totally possible to generate to a folder that already exists, the last part of the --dest option, say `--dest path/to/folder`, if  path/to, or path/to/folder exists, generation will still works (basically, h5bp-docs is only able to create only one folder for the destination output).

## Things to be done

* may introduce a --config flag that allows to overide config settings with a config.js file local to the repo
* recursive mkdir 
    
      