module.exports = function (grunt) {

    'use strict';

    // Load Grunt tasks automatically
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    grunt.initConfig({

        // ---------------------------------------------------------------------
        // | Project Settings                                                  |
        // ---------------------------------------------------------------------

        settings: {
            // Configurable paths
            dir: {
                src: 'src',
                dist: 'dist'
            }
        },

        // ---------------------------------------------------------------------
        // | Tasks Configurations                                              |
        // ---------------------------------------------------------------------

        clean: {
            // List of files that will be removed before the
            // build process is started
            all: [
                '.tmp', // used by the `usemin` task
                '<%= settings.dir.dist %>'
            ],

            // List of files no longer required after the build
            // process is completed
            tmp: [
                '.tmp'  // used by the `usemin` task
            ]
        },

        connect: {
            options: {
                hostname: 'localhost',  // → Change this to '0.0.0.0' if
                                        // the server needs to be access
                                        // from outside of the LAN
                livereload: 35729,
                port: 8080              // → 8080 is used as it is the official
                                        // alternate to port 80 (default port
                                        // for HTTP), and it doesn't require
                                        // root access:
                                        // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
            },
            livereload: {
                options: {
                    base: '<%= settings.dir.src %>',

                    // Automatically open the webpage in the default browser
                    open: true
                }
            },
        },

        copy: {
            files: {
                cwd: '<%= settings.dir.src %>/',
                dest: '<%= settings.dir.dist %>/',
                dot: true,
                expand: true,
                src: [
                    // copy all files
                    '**',

                    // except: files from the `css/` and `js/` directory
                    // (other tasks will handle the copying of these files)
                    '!css/*',
                    '!js/*'
                ]
            }
        },

        filerev: {

            files: {
                src: [
                    '<%= settings.dir.dist %>/js/*.js',
                    '<%= settings.dir.dist %>/css/*.css'
                ]
            },

            options: {
                algorithm: 'sha1',
                length: 7
            }
        },

        jshint: {
            files: [
                'Gruntfile.js',
                '<%= settings.dir.src %>/js/*.js'
            ],
            options: {
                // Search for `.jshintrc` files relative to files being linted
                jshintrc: true,

                // List of files that will be ignored by the linter
                ignores: [
                    '<%= settings.dir.src %>/js/html5shiv.js'
                ]
            }
        },

        // `htmlcompressor` is mainly use to minify and obfuscate the inline
        // scripts, as `htmlmin` doesn't have that feature
        htmlcompressor: {
            build: {
                files: {
                    '<%= settings.dir.dist %>/index.html': '<%= settings.dir.dist %>/index.html',
                    // DO NOT minify the 404 page! (the page needs to have more
                    // than 512 bytes in order for IE to display it)
                    // http://www.404-error-page.com/404-error-page-too-short-problem-microsoft-ie.shtml
                },

                // In-depth explanation of the minifier options:
                // http://code.google.com/p/htmlcompressor/#Compressing_HTML_and_XML_files_from_a_command_line
                options: {
                    compressCss: true,
                    compressJs: true,
                    jsCompressor: 'closure',
                    type: 'html'
                    /* there is no need to enable the other
                       obtions, `htmlmin` takes care of that */
                }
            }
        },

        htmlmin: {
            build: {
                files: {
                    '<%= settings.dir.dist %>/index.html': '<%= settings.dir.dist %>/index.html',
                    // DO NOT minify the 404 page! (the page needs to have more
                    // than 512 bytes in order for IE to display it)
                    // http://www.404-error-page.com/404-error-page-too-short-problem-microsoft-ie.shtml
                },

                // HTML minifier options in-depth explanation:
                // http://perfectionkills.com/experimenting-with-html-minifier/#options
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeEmptyElements: false,
                    removeOptionalTags: true,
                    removeCDATASectionsFromCDATA: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                },
            }
        },

        uglify: {
            options: {
                // Preserve all comments that start with a bang (!) or include a
                // closure compiler style directive (@preserve @license @cc_on)
                preserveComments: 'some'
            }
        },

        usemin: {
            // List of files for which to update asset references
            css: '<%= settings.dir.dist %>/css/*.css',
            html: '<%= settings.dir.dist %>/index.html'
        },

        useminPrepare: {
            // List of HTML files from which to process the usemin blocks
            // https://github.com/yeoman/grunt-usemin#blocks
            html: '<%= settings.dir.src %>/index.html'
        },

        watch: {
            files: '<%= settings.dir.src %>/**',
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            scripts: {
                files: '<%= settings.dir.src %>/js/*.js',
                tasks: 'jshint',
                options: {
                    spawn: false,
                }
            }
        }

    });

    // -------------------------------------------------------------------------
    // | Main Tasks                                                            |
    // -------------------------------------------------------------------------

    // build task
    grunt.registerTask('build', [
        'clean:all',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'filerev',
        'usemin',
        'htmlcompressor',
        'htmlmin',
        'clean:tmp'
    ]);

    // default task
    // (same as `build`, as `build` will be used more often)
    grunt.registerTask('default', [
        'build'
    ]);

    // development task
    grunt.registerTask('dev', [
        'connect:livereload',
        'watch'
    ]);

};
