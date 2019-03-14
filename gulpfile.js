'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('./styles/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./styles/'))
  });

//   gulp.task('serve', function() {

//     browserSync.init({
//         server: "./app"
//     });

//     gulp.watch('./app/styles/style.scss', gulp.series('sass'));
//     gulp.watch("app/*.html").on('change', browserSync.reload);
// });
   
  gulp.task('sass:watch', function () {
    gulp.watch('./styles/style.scss', gulp.series('sass'));
  });