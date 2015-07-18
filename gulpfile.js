var gulp = require('gulp'),
    $    = require('gulp-load-plugins')();

var paths = {
  jadesrc: './src/**/*.jade',
  stylussrc: './src/**/*.styl',
  destination: './build'
};

gulp.task('html', function() {
  gulp.src(paths.jadesrc)
    .pipe($.jade({ doctype: 'html' }))
    .on('error', $.util.log)
    .pipe(gulp.dest('./build'));
});

gulp.task('css', function() {
  gulp.src(paths.stylussrc)
    .pipe($.stylus({ compress: true }))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.destination));
});

gulp.task('watch', function() {
  gulp.watch(paths.jadesrc, ['html']);
  gulp.watch(paths.stylussrc, ['css']);
});

gulp.task('run', ['html', 'css', 'watch'], function() {

});
