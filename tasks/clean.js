/**
 * Task: clean
 * Description: Remove the 'dist' directory
 * Dependencies: rimraf
 */

module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('clean', 'Clean "dist" directory', function() {
        grunt.helper('clean', grunt.config('dir.dest'));
    });

    grunt.registerHelper('clean', function(path) {
        grunt.log.write('Cleaning "' + path + '"...');

        try {
            require('rimraf').sync(path);
            grunt.log.ok();
        } catch (e) {
            grunt.log.error();
            grunt.verbose.error(e);
            grunt.fail.warn('Clean operation failed.');
        }
    });
};
