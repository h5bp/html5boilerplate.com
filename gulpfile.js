'use strict';

var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var reworkNpm = require('rework-npm');
var runSequence = require('run-sequence');  
var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;
var reload = browserSync.reload;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var browserSyncOptions = {

  // In-depth information about the options:
  // https://www.browsersync.io/docs/options/

  logPrefix: 'H5BP',
  notify: false,
  port: 8080
};

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
    .pipe(gulp.dest('docs'));
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
    dirs.src + '/js/main.js',
  ])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.results(results => {
      console.log(`Total Results: ${results.length}`);
      console.log(`Total Warnings: ${results.warningCount}`);
      console.log(`Total Errors: ${results.errorCount}`);
    }))
    .pipe(plugins.eslint.failAfterError());
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', function (done) {
  runSequence(
    ['clean:before', 'lint:js'],
    'generate:main.css',
    'copy',
    'clean:after',
    done);
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
