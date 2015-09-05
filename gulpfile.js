var gulp = require('gulp')
  , critical = require('critical')
  , browserSync = require('browser-sync').create()
  , reload = browserSync.reload
  , $    = require('gulp-load-plugins')();
  
var paths = {
  jadeSrc: './src/**/*.jade',
  stylusSrc: './src/**/*.styl',
  imageSrc: [
    './src/**/*.jpeg',
    './src/**/*.jpg',
    './src/**/*.svg',
    './src/**/*.png',
    './src/**/*.gif'
  ],
  destination: './build',
  cssSrc: './build/css/main.css',
  normalizeSrc: './src/css/vendor/normalize-css/normalize.css'
  // If adding addition css resources add them to the line below
  // And don't forget to add a comment after `normalize.css'`

};

gulp.task('html', function() {
  gulp.src(paths.jadeSrc)
    .pipe($.jade({ doctype: 'html' }))
    .pipe($.minifyInline())
    .on('error', $.util.log)
    .pipe(gulp.dest(paths.destination))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('css', function() {

  var Filter = $.filter(['**/*.styl'], {restore: true});

  gulp.src([
      paths.normalizeSrc,
      paths.stylusSrc
    ])
    .pipe(Filter)
    .pipe($.stylus({ compress: true }))
    .pipe(Filter.restore)
    .pipe($.concat(paths.cssSrc))
    .pipe($.combineMq({ beatify: false }))
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
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('image', function() {
  gulp.src(paths.imageSrc)
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

gulp.task('dev-server', function() {
  browserSync.init({
    server: paths.destination
  });

  gulp.watch(paths.jadeSrc, ['build', 'critical']);
  gulp.watch(paths.stylusSrc, ['build', 'critical']);
});


gulp.task('build', ['html', 'css', 'image'], function() {

});

gulp.task('dev', ['build', 'critical', 'dev-server'], function() {

});

gulp.task('default', ['build', 'critical'], function() {

});
