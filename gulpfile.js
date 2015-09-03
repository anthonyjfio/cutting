var gulp = require('gulp')
  , critical = require('critical')
  , $    = require('gulp-load-plugins')();

var paths = {
  jadesrc: './src/**/*.jade',
  stylussrc: './src/**/*.styl',
  vendorsrc: './src/css/vendor/**/*.css',
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

  var Filter = $.filter(['**/*.styl'], {restore: true});

  gulp.src([
      paths.vendorsrc,
      paths.stylussrc
    ])
    .pipe(Filter)
    .pipe($.stylus({ compress: true }))
    .pipe(Filter.restore)
    .pipe($.concat('./css/main.css'))
    .pipe($.combineMq({ beutify: false }))
    .pipe($.uncss({
      html: ['./build/**/*.html'],
      ignore: [
        '.fade',
        '.fade.in',
        '.collapse',
        '.collapse.in',
        '.collapsing',
        /\.open/
        ]
    }))
    .pipe($.autoprefixer())
    .pipe($.minifyCss({ keepSpecialComments: false }))
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
    dest: 'css/main.css',
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
