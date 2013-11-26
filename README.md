# [html5boilerplate.com](http://html5boilerplate.com/) source code

The HTML5 Boilerplate website is a simple static site.

* The development code is in the `src` directory.
* The build process relies on [Grunt](http://gruntjs.com) (a
  [Node.js](http://nodejs.org) task runner).
* The Grunt configuration is found in `Gruntfile.js` file.

## Setup

1. Install [Node.js and npm](http://nodejs.org/download/).
2. [Install Grunt's command line interface (CLI)
   globally](http://gruntjs.com/getting-started#installing-the-cli):
   `npm install -g grunt-cli`.
3. Run `npm install`.

## Development

You should be able to work almost entirely in the `src` directory.

While developing run `grunt dev`. This will open the website in your default
browser and automatically update it whenever changes are made to any of the
files contained in the page. Also, it will lint the code and inform you about
any suspicious language usage.

## Build

When you have finished your changes, make sure that the distribution package
is correct by running `grunt build` and then checking the output.
