'use strict'

// Include gulp
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const express = require('express')
const directory = require('serve-index')
const browser = require('open')
const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const eventStream = require('event-stream')
const jsManifest = require('./src/js/manifest.json')

// scripts
gulp.task('scripts', function (done) {
  const tasks = Object.keys(jsManifest).map((bundle) => {
    return gulp.src(jsManifest[bundle], { cwd: 'src/js' })
      .pipe(concat(bundle))
      .pipe(gulp.dest('./dist'))
  })

  eventStream.merge(tasks).on('end', done)
})

gulp.task('scripts-prod', function (done) {
  const tasks = Object.keys(jsManifest).map((bundle) => {
    return gulp.src(jsManifest[bundle], { cwd: 'src/js' })
      .pipe(concat(bundle))
      .pipe(gulp.dest('./dist'))
      .pipe(rename({suffix: '.min', extname: '.js'}))
      .pipe(uglify())
      .pipe(gulp.dest('./dist'))
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
    .pipe(gulp.dest('./dist'))
  return stream
})

// watch Files For Changes
gulp.task('watch', ['scripts', 'styles'], function () {
  const app = express()
  app.use(express.static('./'))
  app.use(directory('./'))
  app.listen(8090)
  browser('http://localhost:8090/examples/index.html', 'Google Chrome')
  gulp.watch(['src/js/*.js', 'src/**/*.scss'], ['scripts', 'styles'])
})

// copy dist files for examples
gulp.task('copy', function () {
  gulp.src('./dist/**')
    .pipe(gulp.dest('./examples/dist/'))
})

// tasks aliases
gulp.task('default', ['scripts', 'styles'])
gulp.task('build', ['scripts-prod', 'styles'])
