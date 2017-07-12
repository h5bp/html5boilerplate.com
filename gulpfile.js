'use strict';

var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var reworkNpm = require('rework-npm');
var runSequence = require('run-sequence');  // Temporary solution until Gulp 4
                                            // https://github.com/gulpjs/gulp/issues/355
var gzip = require('gulp-gzip');

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;
var reload = browserSync.reload;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var browserSyncOptions = {

    // In-depth information about the options:
    // http://www.browsersync.io/docs/options/

    logPrefix: 'H5BP',
    notify: false,
    port: 8080
};

var supportedBrowsers = [

    // In-depth information about the options:
    // https://github.com/postcss/autoprefixer#browsers

    'last 2 versions',
    'ie > 8',
    '> 1%'
];

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean:before', function (done) {
    del([dirs.dist]).then(function () {
        done();
    });
});

gulp.task('clean:after', function (done) {
    del([
        dirs.dist + '/{css,css/**}',
        dirs.dist + '/{img,/img/**}',
        dirs.dist + '/{js,/js/**}'
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    'copy:html',
    'copy:css',
    'copy:misc'
]);

gulp.task('copy:html', function () {
    return gulp.src(dirs.src + '/index.html')
        .pipe(plugins.replace(/{{h5bp-version}}/g, pkg.version))
        .pipe(plugins.useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:css', function () {
    return gulp.src(dirs.src + '/css/main.css')
        .pipe(gulp.dest(dirs.dist + '/css/'));
});


gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/index.html',
        '!' + dirs.src + '/{css,css/**}'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('generate:main.css', function () {
    return gulp.src(dirs.src + '/css/index.css')
            .pipe(plugins.rework(reworkNpm()))
            .pipe(plugins.autoprefixer({
                browsers: supportedBrowsers
            }))
            .pipe(plugins.cssBase64())
            .pipe(plugins.uncss({
                html: [dirs.src + '/index.html']
            }))
            .pipe(plugins.csso())
            .pipe(plugins.rename('main.css'))
            .pipe(gulp.dest(dirs.src + '/css/'))
            .pipe(reload({ stream: true }));
});

gulp.task('lint:js', function () {
    return gulp.src([
        'gulpfile.js',
        dirs.src + '/js/**/*.js',
    ]).pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.if(!browserSync.active, plugins.jshint.reporter('fail')));
});

gulp.task('minify:html', function () {

    // In-depth information about the `htmlmin` options:
    // https://github.com/kangax/html-minifier#options-quick-reference
    var htmlminOptions = {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true
    };

    return gulp.src([
        dirs.dist + '/index.html'
    ]).pipe(plugins.smoosher())
      .pipe(plugins.htmlmin(htmlminOptions))
      .pipe(gulp.dest(dirs.dist));

});
// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', function (done) {
    runSequence(
        ['clean:before', 'lint:js'],
        'generate:main.css',
        'copy',
        'minify:html',
        'clean:after',
        'compress',
    done);
});


gulp.task('compress', function() {
   gulp.src(dirs.dist + '/**/*.{css,html,ico,js,svg,txt,xml}')
        .pipe(gzip())
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('default', ['build']);

gulp.task('serve', ['generate:main.css'], function () {

    browserSyncOptions.server = dirs.src;
    browserSync(browserSyncOptions);

    gulp.watch([
        dirs.src + '/**/*.html'
    ], reload);

    gulp.watch([
        dirs.src + '/css/**/*.css',
        dirs.src + '/img/**/*',
        '!' + dirs.src + '/css/main.css'
    ], ['generate:main.css']);

    gulp.watch([
        dirs.src + '/js/**/*.js',
        'gulpfile.js'
    ], ['lint:js', reload]);

});

gulp.task('serve:build', ['build'], function () {
    browserSyncOptions.server = dirs.dist;
    browserSync(browserSyncOptions);
});
