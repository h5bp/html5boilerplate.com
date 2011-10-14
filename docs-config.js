// ## defaults configuration file for documentation generation

// from the root repo 
//
//    h5bp-docs --config docs-config.js
//
// this file may be placed elsewhere, --config path is relative to the command line pwd.

exports = module.exports = {
  // --server, when set to true, will start a connect static server once generation is done
  server: false,

  // server port used if --server flag provided
  port: 8080,

  // src folder, this is where the markdown files are
  src: "./docs/wiki-upstream",

  // destination folder, place where the generated files will land
  dest: "./src/docs",

  // a single layout files with a {{ content }} placeholder.
  layout: "./docs/layout.html",

  // assets folder
  // - putting a false value will prevent the assets copy.
  // - ommiting assets assets copy the public folder in h5bp-docs package.
  assets: false,

  // allowed extensions, all other files are ignored 
  ext: ['md', 'markdown', 'mkd'],

  // baseurl, only used with --server flag. ex: docs
  baseurl: '/docs',

  // Enable verbose output (defaults true)
  verbose: true
};
