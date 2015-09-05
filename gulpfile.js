var gulp = require('gulp')
  , critical = require('critical')
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
    .pipe(gulp.dest(paths.destination));
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
    .pipe(gulp.dest(paths.destination));
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

gulp.task('watch', function() {
  gulp.watch(paths.jadeSrc, ['build', 'critical', 'reload']);
  gulp.watch(paths.stylusSrc, ['build', 'critical', 'reload']); 
});

gulp.task('reload', function() {
  gulp.src('')
    .pipe($.connect.reload())
});

// gulp.task('dev-server', function() {
//   gulp.src(paths.destination)
//     .pipe($.serverLivereload({
//       livereload: true,
//       open: true
//     }));
// })
gulp.task('dev-server', function() {
  $.connect.server({
    livereload: true,
    root: paths.destination
  });
});

gulp.task('build', ['html', 'css', 'image'], function() {

});

gulp.task('dev', ['build', 'critical', 'dev-server', 'watch'], function() {

});

gulp.task('default', ['build', 'critical'], function() {

});
