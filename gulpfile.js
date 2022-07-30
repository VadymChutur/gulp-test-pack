let gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  autoPrefixer = require('gulp-autoprefixer'),
  clean = require('gulp-clean');

gulp.task('gulp-clean', async function () {
  return gulp.src('dist').pipe(clean());
});

gulp.task('sass', function () {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(autoPrefixer({ browsers: ['last 2 versions'] }))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scss', function () {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(autoPrefixer({ browsers: ['last 2 versions'] }))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function () {
  return gulp
    .src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/magnific-popup/dist/magnific-popup.css',
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function () {
  return gulp
    .src([
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('app/*.html', gulp.parallel('html'));
  gulp.watch('app/js**/*.js', gulp.parallel('script'));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
});

gulp.task('html', function () {
  return gulp.src('app/**/*.html').pipe(browserSync.reload({ stream: true }));
});

gulp.task('script', function () {
  return gulp.src('app/js/**/*.js').pipe(browserSync.reload({ stream: true }));
});

gulp.task('export', function () {
  let buildHtml = gulp.src('app/**/*.html').pipe(gulp.dest('dist'));

  let buildCss = gulp.src('app/css/**/*.css').pipe(gulp.dest('dist/css'));

  let buildJs = gulp.src('app/js/**/*.js').pipe(gulp.dest('dist/js'));

  let buildFonts = gulp.src('app/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));

  let buildImg = gulp.src('app/img/**/*.*').pipe(gulp.dest('dist/img'));
});

gulp.task('build', gulp.series('export', 'gulp-clean'));

gulp.task(
  'default',
  gulp.parallel('css', 'scss', 'sass', 'js', 'browser-sync', 'watch')
);
