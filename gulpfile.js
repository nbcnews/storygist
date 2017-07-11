'use strict'

// Include gulp
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const browserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const sequence = require('gulp-sequence')
const eventStream = require('event-stream')
const jsManifest = require('./src/js/manifest.json')

var distLoc = 'build'

if (process.argv[3] === '--dist') {
  distLoc = 'dist'
}

// scripts
gulp.task('scripts', function (done) {
  const tasks = Object.keys(jsManifest).map((bundle) => {
    return gulp.src(jsManifest[bundle], { cwd: 'src/js' })
      .pipe(concat(bundle))
      .pipe(gulp.dest(distLoc))
      .pipe(browserSync.stream())
  })

  eventStream.merge(tasks).on('end', done)
})

gulp.task('scripts-prod', function (done) {
  const tasks = Object.keys(jsManifest).map((bundle) => {
    return gulp.src(jsManifest[bundle], { cwd: 'src/js' })
      .pipe(concat(bundle))
      .pipe(gulp.dest('./' + distLoc))
      .pipe(rename({suffix: '.min', extname: '.js'}))
      .pipe(uglify())
      .pipe(gulp.dest('./' + distLoc))
  })

  eventStream.merge(tasks).on('end', done)
})

// styles
gulp.task('styles', function () {
  var stream = gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourceComments: false
    }).on('error', sass.logError))
    .pipe(cssnano({safe: true,
      discardComments: false,
      autoprefixer: {
        browsers: 'last 5 version',
        add: true
      }
    }))
    .pipe(sourcemaps.write('.', {includeContents: false}))
    .pipe(gulp.dest('./' + distLoc))
    .pipe(browserSync.stream())
  return stream
})

// watch Files For Changes
gulp.task('serve', ['styles', 'scripts'], function () {
  browserSync.init({
    server: './',
    online: true,
    index: 'index.html',
    startPath: '/examples'
  })

  gulp.watch('./src/**/*.scss', ['styles'])
  gulp.watch('./src/js/*.js', ['scripts'])
  gulp.watch('./examples/**/*.html').on('change', browserSync.reload)
})

// copy dist files for examples
gulp.task('copy', function () {
  gulp.src('./' + distLoc + '/**')
    .pipe(gulp.dest('./examples/' + distLoc))
})

gulp.task('mytask', function () {
  console.log(process.argv)
})

// tasks aliases
gulp.task('default', ['scripts', 'styles'])
gulp.task('build', ['mytask', 'scripts-prod', 'styles'])
gulp.task('deploy', sequence('scripts-prod', 'styles', 'copy'))
