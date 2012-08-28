/**
 * Task: copy
 * Description: Copy 'src' to 'dist'
 */

module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('copy', function() {
        var fs = require('fs');
        var path = require('path');
        var srcDir = grunt.template.process(grunt.config('dir.src'));
        var destDir = grunt.template.process(grunt.config('dir.dest'));

        grunt.log.write('Copying file(s) from ' + srcDir + ' to ' + destDir + '...');
        // Recursively copy the files in 'src' directory
        grunt.file.recurse(srcDir, function(absDir, rootDir, subDir, filename) {
            grunt.file.copy(absDir, path.join(destDir, subDir, filename));
        });
        grunt.log.ok();
    });
};
