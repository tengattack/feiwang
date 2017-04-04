'use strict'

const gulp = require('gulp')
const ejs = require('gulp-ejs')
const removeHtmlComments = require('gulp-remove-html-comments')
const htmlBeautify = require('gulp-html-beautify')

const beautifyOpts = {
  indent_size: 2,
  preserve_newlines: false,
  space_after_anon_function: true,
  extra_liners: [],
}

gulp.task('html', function () {
  return gulp.src('views/*.ejs')
    .pipe(ejs({}, { /*rmWhitespace: true*/ }, { ext: '.html' }))
    .pipe(removeHtmlComments())
    .pipe(htmlBeautify(beautifyOpts))
    .pipe(gulp.dest('.'))
})

gulp.task('debug', function () {
  return gulp.watch('views/**/*.ejs', [ 'html' ])
})

gulp.task('default', [ 'html' ])
gulp.task('dev', [ 'debug' ])
