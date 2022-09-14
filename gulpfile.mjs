import gulp from 'gulp';
import browserSync from 'browser-sync';
import { deleteSync } from 'del';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpCSSBase64 from 'gulp-css-base64';
import gulpCSSO from 'gulp-csso';
import gulpESLint from 'gulp-eslint';
import gulpHTMLMin from 'gulp-htmlmin';
import gulpRename from 'gulp-rename';
import gulpReplace from 'gulp-replace';
import gulpRework from 'gulp-rework';
import gulpSmoosher from 'gulp-smoosher';
import gulpUnCSS from 'gulp-uncss';
import gulpUseRef from 'gulp-useref';
import reworkNpm from 'rework-npm';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const dirs = pkg['h5bp-configs'].directories;
const reload = browserSync.reload;
const browserSyncOptions = {

  logPrefix: 'H5BP',
  notify: false,
  port: 8080
};

async function cleanBefore() {
  deleteSync([dirs.dist]);

}

async function cleanAfter() {
  deleteSync([
    dirs.dist + '/{css,css/**}',
    dirs.dist + '/{img,/img/**}',
    dirs.dist + '/{js,/js/**}'
  ]);
}

function copyHTML() {
  console.log('copyHTML');
  return gulp.src(dirs.src + '/index.html')
    .pipe(gulpReplace(/{{h5bp-version}}/g, pkg.version))
    .pipe(gulpUseRef())
    .pipe(gulp.dest('docs'));
}

function copyCSS() {
  console.log('copyCSS');
  return gulp.src(dirs.src + '/css/main.css')
    .pipe(gulp.dest(dirs.dist + '/css/'));
}


function copyMisc() {
  console.log('copyMisc');
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
}
function generateMainCSS() {
  return gulp.src(dirs.src + '/css/index.css')
    .pipe(gulpRework(reworkNpm()))
    .pipe(gulpAutoprefixer())
    .pipe(gulpCSSBase64())
    .pipe(gulpUnCSS({
      html: [dirs.src + '/index.html']
    }))
    .pipe(gulpCSSO())
    .pipe(gulpRename('main.css'))
    .pipe(gulp.dest(dirs.src + '/css/'));
}

function lintJS() {
  return gulp.src([
    'gulpfile.mjs',
    dirs.src + '/js/**/*.js',
  ]).pipe(gulpESLint())
    .pipe(gulpESLint.results(results => {
      console.log(`Total Results: ${results.length}`);
      console.log(`Total Warnings: ${results.warningCount}`);
      console.log(`Total Errors: ${results.errorCount}`);
    }))
    .pipe(gulpESLint.failAfterError());
}

function minifyHTML() {
  // In-depth information about the `htmlmin` options:
  // https://github.com/kangax/html-minifier#options-quick-reference
  var htmlminOptions = {
    collapseBooleanAttributes: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  };

  return gulp
    .src([dirs.dist + "/index.html"])
    .pipe(gulpSmoosher())
    .pipe(gulpHTMLMin(htmlminOptions))
    .pipe(gulp.dest(dirs.dist));
}
function browserSyncFn() {
  browserSyncOptions.server = dirs.src;
  browserSync(browserSyncOptions);

  gulp.watch([dirs.src + "/**/*.html"], reload);

  gulp.watch(
    [
      dirs.src + "/css/**/*.css",
      dirs.src + "/img/**/*",
      "!" + dirs.src + "/css/main.css",
    ],
    gulp.series(generateMainCSS)
  );

  gulp.watch([dirs.src + "/js/**/*.js", "gulpfile.mjs"], gulp.parallel(reload));
}

gulp.task("serve", gulp.series(generateMainCSS, browserSyncFn));

gulp.task(
  "build",
  gulp.series(
    gulp.parallel(cleanBefore),
    generateMainCSS,
    copyHTML,
    copyCSS,
    copyMisc,
    minifyHTML,
    cleanAfter
  )
);

gulp.task(
  "serve:build",
  gulp.series("build", function () {
    browserSyncOptions.server = dirs.dist;
    browserSync(browserSyncOptions);
  })
);
