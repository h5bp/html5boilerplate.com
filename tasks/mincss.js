/**
 * Task: mincss
 * Description: Minify CSS files
 * Dependencies: clean-css
 */

module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('mincss', 'Minify CSS files', function() {
        var srcFiles = [];
        var destFile = grunt.template.process(this.target);

        this.data.forEach(function(file) {
            file = grunt.template.process(file);
            srcFiles.push(grunt.file.expandFiles(file));
        });

        var sourceCode = grunt.helper('concat', srcFiles);
        var taskOutput = grunt.helper('mincss', sourceCode);

        if (taskOutput.length > 0) {
            grunt.file.write(destFile, taskOutput);
            grunt.log.writeln('File "' + destFile + '" created.');
            grunt.helper('min_max_info', taskOutput, sourceCode);
        }
    });

    grunt.registerHelper('mincss', function(source) {
        try {
            return require('clean-css').process(source);
        } catch (e) {
            grunt.log.error(e);
            grunt.fail.warn('CSS minification failed.');
        }
    });
};
