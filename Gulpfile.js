require('longjohn');
var gulp       = require('gulp');
var karma      = require('gulp-karma');
var refresh    = require('gulp-livereload');
var livereload = require('tiny-lr');

var server = livereload();

var testFiles = [
  'index.js',
  'test/spec/*.js'
];

gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }));
});

gulp.task('pjs', function(cb) {

  gulp.watch(testFiles, function(event) {
    return gulp.src(testFiles)
      .pipe(refresh(server));

  });

});

gulp.task('default', function() {
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'test/karma.conf.js',
      action: 'watch'
    }));
});
