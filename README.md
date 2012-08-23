# html5boilerplate.com source code

The HTML5 Boilerplate website is a simple static site.

* The development code is in the `src` directory.
* The build process relies on grunt - a Node.js build script. The grunt
  configuration is found in `grunt.js` and the individual tasks are found in
  the `tasks` directory.

## Development setup

1. Install Node.js and npm
2. Install grunt globally: `npm install -g grunt`.
3. Run `npm install`.

You should be able to work almost entirely in the `src` directory.

When you have finished your changes, make sure that the distribution package is
correct by running `grunt build` and then checking the output.

If you need to modify the grunt tasks or configuration, please run `grunt lint`
and make sure that there are no errors before committing code.
