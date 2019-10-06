'use strict';

const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

function serve() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 9000
    });

    watch(['*.html', 'src/js/*.js'], series(js, reload));
    watch('src/css/*.css', css);
}

function reload(done) {
    browserSync.reload();
    done();
}

function css() {
    return src('src/css/app.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('build/css/'))
    .pipe(browserSync.stream());
}

function js() {
    return src(['src/js/autocomplete.js', 'src/js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(terser())
    .pipe(dest('build/js/'));
}

exports.default = serve;