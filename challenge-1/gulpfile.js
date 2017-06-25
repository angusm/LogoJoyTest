let gulp = require('gulp');

let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');

function handleError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('html', () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./bin'))
        .pipe(browserSync.stream());
});

gulp.task('css', () => {
    return gulp.src('./src/scss/challenge-1.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .on('error', handleError)
        .pipe(gulp.dest('./bin/css'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './bin/',
        },
    });
});

gulp.task('watch', ['css', 'html'], () => {
    browserSync.init({
        server: {
            baseDir: './bin/',
        },
    });
    gulp.watch('./src/*.html', ['html'])
        .on('error', handleError);
    gulp.watch('./src/scss/**/*.scss', ['css'])
        .on('error', handleError);
});

gulp.task('default', ['watch']);