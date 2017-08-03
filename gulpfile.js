var gulp = require('gulp')
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
  gulp.src('docs/css/src/kss.less')
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./docs/css/'))
  return gulp.src('docs/css/src/docs.less')
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./docs/css/'))
})

gulp.task('lessc:core', function () {
  return gulp.src(__dirname + '/css/src/still-alive.less')
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./css/'))
    .pipe(sourcemaps.init())
    .pipe(clean_css())
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./css/'))
})

gulp.task('build', ['pug:docs', 'lessc:docs', 'lessc:core'])
