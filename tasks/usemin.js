/**
 * Task: usemin
 * Description: Reference the minified CSS/JS in the HTML
 */

module.exports = function(grunt) {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var crypto = require('crypto');

    grunt.registerTask('usemin', 'Version the minified CSS/JS and reference it in the HTML', function() {
        var destDir = grunt.config('dir.dest');
        var destHtml = path.join(destDir, 'index.html');
        var destCss = path.join(destDir, 'css/main.min.css');
        var destJs = path.join(destDir, 'js/main.min.js');

        // Hash and rename the CSS
        var hashCss = grunt.helper('md5', destCss);
        var newCssName = 'css/main-' + hashCss + '.min.css';
        fs.renameSync(destCss, path.join(destDir, newCssName));

        // Hash and rename the JS
        var hashJs = grunt.helper('md5', destJs);
        var newJsName = 'js/main-' + hashJs + '.min.js';
        fs.renameSync(destJs, path.join(destDir, newJsName));

        // Convert the HTML to use the new file names
        var content = grunt.file.read(destHtml);
        content = content.replace('href="css/main.css"', 'href="' + newCssName + '"');
        content = content.replace('src="js/main.js"', 'src="' + newJsName + '"');
        grunt.file.write(destHtml, content);
        grunt.log.writeln('File "' + destHtml + '" updated to use minified and versioned CSS/JS.');
    });

    /**
     * The 'md5' helper is a basic wrapper around crypto.createHash
     */
    grunt.registerHelper('md5', function(filepath) {
        var hash = crypto.createHash('md5');
        hash.update(fs.readFileSync(filepath));
        grunt.log.write('Hashing ' + filepath + '...').ok();
        return hash.digest('hex');
    });
};
