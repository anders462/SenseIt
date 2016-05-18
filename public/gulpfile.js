var gulp = require('gulp'),
    runSequence = require('run-sequence'),
     uglify = require('gulp-uglify'),
     minifyHtml = require('gulp-minify-html'),
     minifyCss = require('gulp-minify-css'),
     rev = require('gulp-rev'),
    ////
    eslint = require('gulp-eslint'),
    friendlyFormatter = require("eslint-friendly-formatter"),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    browserSync = require('browser-sync'),
    del = require('del'),
    sass = require('gulp-sass');


gulp.task('default',function(callback){
  runSequence('build',callback);
});

gulp.task('build', function(callback){
  runSequence('clean','pre-process','usemin','imagemin','copyfonts', callback);
});

gulp.task('clean', function(){
  console.log("cleaning")
  return del(['dist']);
});

gulp.task('eslint', function () {
    return gulp.src(['app/**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('sass', function() {
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/styles/'));
});

gulp.task('pre-process', ['eslint','sass'], function(){
  console.log("Pre Processing")

});

gulp.task('usemin', function () {
  return gulp.src('./app/**/*.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()]
      }))
      .pipe(gulp.dest('dist/'));
});

// gulp.task('usemin', function() {
//   return gulp.src('./app/**/*.html')
//     .pipe(usemin({
//       css: [ rev() ],
//       html: [ minifyHtml({ empty: true }) ],
//       js: [ uglify(), rev() ],
//       inlinejs: [ uglify() ],
//       inlinecss: [ minifyCss(), 'concat' ]
//     }))
//     .pipe(gulp.dest('dist/'));
// });//

//Images
gulp.task('imagemin', function() {
	return gulp.src('app/images/*.*')
		.pipe(imagemin({ progressive: true }))
		.pipe(gulp.dest('dist/images'))
});


gulp.task('copyfonts', function() {
  console.log("copy")
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});
//
// // Watch
// gulp.task('watch', ['browser-sync'], function() {
//   // Watch .js files
//   gulp.watch('{app/**/*.js,./app/styles/**/*.css,./app/**/*.html,./app/**/*.scss}', ['usemin']);
//       // Watch image files
//   gulp.watch('app/images/**/*', ['imagemin']);
//
// });
//
// gulp.task('browser-sync', ['default'], function () {
//    var files = [
//       'app/**/*.html',
//       'app/styles/**/*.css',
//       'app/images/**/*.png',
//       'app/**/*.js',
//       'dist/**/*'
//    ];
//
//    browserSync.init(files, {
//       server: {
//          baseDir: "dist",
//          index: "index.html"
//       }
//    });
//         // Watch any files in public/dist/, reload on change
//   gulp.watch(['dist/**']).on('change', browserSync.reload);
//     });
//
//
