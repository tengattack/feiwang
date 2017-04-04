'use strict'

const gulp = require('gulp')
const ejs = require('gulp-ejs')

gulp.task('html', function () {
  return gulp.src('views/*.ejs')
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(gulp.dest('.'))
})

gulp.task('default', [ 'html' ])
