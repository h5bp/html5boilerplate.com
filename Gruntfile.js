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

        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 6', 'ie 7', 'ie 8'],
                cascade: true
            },
            dist: {
                expand: true,
                src: '<%= settings.dir.dist %>/**/*.css'
            }
        },

        clean: {
            // List of files that will be removed before the
            // build process is started
            all: [
                '<%= settings.dir.dist %>'
            ]
        },

        connect: {
            options: {
                hostname: 'localhost',  // → Change this to '0.0.0.0' if
                                        // the server needs to be accessed
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
                    base: '<%= settings.dir.dist %>',

                    // Automatically open the webpage in the default browser
                    open: true
                }
            }
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

        concat: {
            css: {
                src: [
                    '<%= settings.dir.src %>/css/_normalize.css',
                    '<%= settings.dir.src %>/css/_base.css',
                    '<%= settings.dir.src %>/css/_utils.css',
                    '<%= settings.dir.src %>/css/_components.css',
                    '<%= settings.dir.src %>/css/_site.css',
                    '<%= settings.dir.src %>/css/_mq.css',
                    '<%= settings.dir.src %>/css/_print.css'
                ],
                dest: '<%= settings.dir.dist %>/css/main.css'
            }
        },

        filerev: {
            files: {
                src: [
                    '<%= settings.dir.dist %>/js/*.js',
                    '<%= settings.dir.dist %>/css/*.css',
                    '<%= settings.dir.dist %>/img/*.png'
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
                jshintrc: true
            }
        },

        validation: {
            files: {
                src: '<%= settings.dir.dist %>/index.html'
            },

            // In-depth explanation of the validation options:
            // https://github.com/praveenvijayan/grunt-html-validation#options
            options: {
                charset: 'utf-8',
                doctype: 'HTML5',
                failHard: true,
                reset: true
            }
        },

        // `htmlcompressor` is mainly use to minify and obfuscate the inline
        // scripts, as `htmlmin` doesn't have that feature yet
        htmlcompressor: {
            build: {
                files: {
                    '<%= settings.dir.dist %>/index.html': '<%= settings.dir.dist %>/index.html'
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
                       options, `htmlmin` takes care of that */
                }
            }
        },

        htmlmin: {
            build: {
                files: {
                    '<%= settings.dir.dist %>/index.html': '<%= settings.dir.dist %>/index.html'
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
                    removeCDATASectionsFromCDATA: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeEmptyElements: false,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
            }
        },

        cssmin: {
            minify: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: '*'
                },
                files: {
                    '<%= uncss.dist.dest %>': '<%= concat.css.dest %>'
                }
            }
        },

        uncss: {
            options: {
                ignoreSheets: [/fonts.googleapis/]
            },
            dist: {
                src: '<%= settings.dir.dist %>/index.html',
                dest: '<%= concat.css.dest %>'
            }
        },

        useminPrepare: {
            // List of HTML files from which to process the usemin blocks
            // https://github.com/yeoman/grunt-usemin#blocks
            html: '<%= settings.dir.src %>/index.html'
        },

        usemin: {
            // List of files for which to update asset references
            css: '<%= settings.dir.dist %>/css/*.css',
            html: '<%= settings.dir.dist %>/index.html'
        },

        watch: {
            files: '<%= settings.dir.src %>/**',
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            scripts: {
                files: '<%= jshint.files %>',
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
        'clean',
        'copy',
        'useminPrepare',
        'concat',
        'autoprefixer',
        'uncss',
        'cssmin',
        'filerev',
        'usemin',
        'htmlcompressor',
        'htmlmin'
    ]);

    // default task
    // (same as `build`, as `build` will be used more often)
    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('dev', [
        'clean',
        'copy',
        'useminPrepare',
        'concat',
        'autoprefixer',
        'filerev',
        'usemin',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('test', [
        'build',
        'jshint',
        'validation'
    ]);

};
