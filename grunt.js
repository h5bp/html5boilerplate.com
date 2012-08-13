module.exports = function(grunt) {
    'use strict';

    // readOptionalJSON
    // by Ben Alman
    // https://gist.github.com/2876125
    function readOptionalJSON( filepath ) {
        var data = {};
        try {
            data = grunt.file.readJSON( filepath );
            grunt.verbose.write( "Reading " + filepath + "..." ).ok();
        } catch(e) {}
        return data;
    }

    // Project configuration.
    grunt.initConfig({
        dir: {
            src: 'src',
            dest: 'dist'
        },

        lint: {
            grunt: ['grunt.js']
        },

        min: {
            'dist/js/main.min.js': '<%= dir.src %>/js/main.js'
        },

        mincss: {
            'dist/css/main.min.css': [
                '<%= dir.src %>/css/_normalize.css',
                '<%= dir.src %>/css/_base.css',
                '<%= dir.src %>/css/_utils.css',
                '<%= dir.src %>/css/_components.css',
                '<%= dir.src %>/css/_site.css',
                '<%= dir.src %>/css/_mq.css',
                '<%= dir.src %>/css/_print.css'
            ]
        },

        jshint: {
            options: readOptionalJSON('.jshintrc')
        },

        watch: {
            lint: {
                files: '<config:lint.grunt>',
                tasks: ['lint']
            }
        }
    });

    grunt.loadTasks('tasks');
    // Default task.
    grunt.registerTask('default', ['watch']);
    // Build task.
    grunt.registerTask('build', ['clean', 'copy', 'min', 'mincss', 'usemin']);
};
