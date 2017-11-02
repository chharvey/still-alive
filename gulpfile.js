const gulp         = require('gulp')
const pug          = require('gulp-pug')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')

gulp.task('pug:docs', function () {
  return gulp.src('docs/{index,phi,code,principles,base,obj,comp-typo,comp-ui,help,atom}.pug')
    .pipe(pug({
      basedir: './',
      locals: {
        Xmeter: require('xmeter'),
        Docs: require('./docs/_models/Docs.class.js'),
      },
    }))
    .pipe(gulp.dest('./docs/'))
})

gulp.task('lessc:docs', function () {
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
