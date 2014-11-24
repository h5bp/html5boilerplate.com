'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var reworkSuit = require('rework-suit');
var runSequence = require('run-sequence');  // Temporary solution until Gulp 4
                                            // https://github.com/gulpjs/gulp/issues/355

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
    'last 2 versions',
    'ie >= 6',
    '> 1%'
];

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean:before', function (done) {
    require('del')([dirs.dist], done);
});

gulp.task('clean:after', function (done) {
    require('del')([
        dirs.dist + '/{css,css/**}',
        dirs.dist + '/{img,/img/**}',
        dirs.dist + '/{js,/js/**}'
    ], done);
});

gulp.task('copy', [
    'copy:html',
    'copy:misc'
]);

gulp.task('copy:html', function () {
    var assets = plugins.useref.assets();
    return gulp.src('src/index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(plugins.useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/index.html',
        '!' + dirs.src + '/{css,css/**}',
        '!' + dirs.src + '/{js,/js/**}'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('generate:main.css', function () {
    return gulp.src('src/css/index.css')
            .pipe(plugins.rework(reworkSuit({
                browsers: supportedBrowsers
            })))
            .pipe(plugins.cssBase64())
            .pipe(plugins.uncss({
                html: ['src/index.html']
            }))
            .pipe(plugins.csso())
            .pipe(plugins.rename('main.css'))
            .pipe(gulp.dest('src/css/'))
            .pipe(reload({ stream: true }));
});

gulp.task('lint:js', function () {
    return gulp.src([
        'gulpfile.js',
        dirs.dist + '/js/**/*.js',
        '!' + dirs.dist + '/js/jquery*.js'
    ]).pipe(reload({ stream: true, once: true }))
      .pipe(plugins.jshint())
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
    done);
});

gulp.task('default', ['build']);

gulp.task('serve', ['generate:main.css'], function () {

    browserSyncOptions.server = dirs.src;
    browserSync(browserSyncOptions);

    gulp.watch(['gulpfile.js'], ['lint:js']);
    gulp.watch([dirs.src + '/**/*.html', dirs.src + '/img/**/*'], reload);
    gulp.watch([dirs.src + '/css/**/*.css', '!' + dirs.src + '/css/main.css'], ['generate:main.css']);
    gulp.watch([dirs.src + '/js/**/*.js'], reload);

});

gulp.task('serve:build', ['build'], function () {
    browserSyncOptions.server = dirs.dist;
    browserSync(browserSyncOptions);
});
