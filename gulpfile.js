var gulp = require('gulp')
var rename = require('gulp-rename')
var pug = require('gulp-pug')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var clean_css = require('gulp-clean-css')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('pug:docs', function () {
  return gulp.src('docs/{index,phi,code,principles,base,obj,comp-typo,comp-ui,help,atom}.pug')
    .pipe(pug({
      basedir: './',
      locals: {
        Docs: require('./docs/_models/Docs.class.js'),
      },
    }))
    .pipe(gulp.dest('./docs/'))
})

gulp.task('lessc:docs', function () {
  return gulp.src('docs/styles/docs.less')
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./docs/styles/'))
})

gulp.task('lessc:core', function () {
  return gulp.src('still-alive.less')
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('minify', ['lessc:core'], function () {
  return gulp.src('still-alive.css')
    .pipe(sourcemaps.init())
    .pipe(clean_css())
    .pipe(rename('still-alive.min.css'))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./'))
})

gulp.task('build', ['pug:docs', 'lessc:docs', 'minify'])
