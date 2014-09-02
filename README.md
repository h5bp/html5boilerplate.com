# [html5boilerplate.com](http://html5boilerplate.com/)

[![Build Status](https://travis-ci.org/h5bp/html5boilerplate.com.svg)](https://travis-ci.org/h5bp/html5boilerplate.com)
[![devDependency Status](https://david-dm.org/h5bp/html5boilerplate.com/dev-status.svg)](https://david-dm.org/h5bp/html5boilerplate.com#info=devDependencies)

The HTML5 Boilerplate website is a simple static site.

* The development code is in the
  [`src`](https://github.com/h5bp/html5boilerplate.com/tree/master/src)
  directory.
* The build process relies on [Grunt](http://gruntjs.com) (a
  [Node.js](http://nodejs.org) task runner).
* The Grunt configurations can be found in the
  [`Gruntfile.js`](https://github.com/h5bp/html5boilerplate.com/blob/master/Gruntfile.js)
  file.

## Setup

1. Install [Node.js and npm](http://nodejs.org/download/).
2. [Install Grunt's command line interface (CLI)
   globally](http://gruntjs.com/getting-started#installing-the-cli):
   `npm install -g grunt-cli`.
3. Run `npm install`.

## Development

You should be able to work almost entirely in the
[`src`](https://github.com/h5bp/html5boilerplate.com/tree/master/src) directory.

While developing run `grunt dev` as this will open the website in your default
browser and automatically update it whenever changes are made to the page or any
of the files contained in the page.

## Build

When you have finished your changes, make sure that the distribution package is
correct by running `grunt test` and then checking the output.

## Deploy

This step is done automatically: the server will
[periodically pull](https://github.com/h5bp/html5boilerplate.com/wiki) from
the `server-content` branch, branch that will be updated by Travis CI every
time a commit is pushed to the `master` branch and the tests pass.
