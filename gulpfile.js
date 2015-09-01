var gulp = require('gulp')
  , critical = require('critical')
  , $    = require('gulp-load-plugins')();

var paths = {
  jadesrc: './src/**/*.jade',
  stylussrc: './src/**/*.styl',
  normalizesrc: './src/css/vendor/normalize-css/normalize.css',
  imagesrc: [
    './src/**/*.jpeg',
    './src/**/*.jpg',
    './src/**/*.svg',
    './src/**/*.png',
    './src/**/*.gif'
  ],
  destination: './build/',
  htmlsrc: './build/index.html',
  csssrc: './build/css/main.css'
};

gulp.task('html', function() {
  gulp.src(paths.jadesrc)
    .pipe($.jade({ doctype: 'html' }))
    .pipe($.minifyInline())
    .on('error', $.util.log)
    .pipe(gulp.dest(paths.destination));
});

gulp.task('css', function() {

  // See todo section of readme for how to use filter
  // var Filter = $.filter(paths.stylussrc);

  gulp.src([
      paths.stylussrc,
      paths.normalizesrc
    ])
    // .pipe(Filter)
    .pipe($.stylus({ compress: true }))
    // .pipe(Filter.restore)
    .pipe($.concat('main.css'))
    .pipe($.uncss({ html: ['./build/**/*.html'] }))
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.destination));
});

gulp.task('image', function() {
  gulp.src(paths.imagesrc)
    .pipe($.imagemin({
      optimizationLevel: 7,
      progressive: true,
      iterlaced: true
    }))
    .pipe(gulp.dest(paths.destination));
});

gulp.task('critical', ['build'], function() {
  critical.generate({
    base: './build/',
    src: 'index.html',
    dest: './build/critical.html',
    minify: true,
    dimensions: [{
      width: 350,
      height: 575
    }, {
      width: 500,
      height: 575
    }, {
      width: 1300,
      height: 900
    }]
  }, function(err, output) {
    critical.inline({
      base: './build',
      src: 'index.html',
      dest: './build/index.html',
      minify: true
      })
  })
});

gulp.task('watch', function() {
  gulp.watch(paths.jadesrc, ['html']);
  gulp.watch(paths.stylussrc, ['css']);
});


gulp.task('build', ['html', 'css', 'image'], function() {

});

gulp.task('default', ['build', 'critical', 'watch'], function() {

});
