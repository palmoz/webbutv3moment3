const {src, dest, watch, series, parallel } =require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const uglifycss = require("gulp-uglifycss");
const sass = require('gulp-sass'); 
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');

// Sökvägar

const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/**/*.css",
    jsPath: "src/**/*.js",
    sassPath: "src/**/*.scss"
}

// Kopiera HTML filer
function copyHTML() {
    return src(files.htmlPath)
    .pipe(dest("pub")
    );
}

//Sammanslå och minifiera js-filer
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('pub/js')
        );
}

//Sammanslå och minifiera css-filer

function cssTask() {
    return src(files.cssPath)
        .pipe(concat('styles.css'))
        .pipe(uglifycss())
        .pipe(dest('pub/css')
        );
}

//Sass Task

function sassTask() {
    return src(files.sassPath)
       .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
       .pipe(concat('styles.css'))
       .pipe(sourcemaps.write('./maps'))
       .pipe(uglifycss())
       .pipe(dest('pub/css')
       );
}


//watcher
function watchTask() {
    watch([files.htmlPath, files.jsPath, files.sassPath, files.cssPath], 
        parallel(copyHTML, jsTask, sassTask, cssTask));
}


//Default Task
exports.default = series(
    parallel(copyHTML, jsTask, sassTask, cssTask),
    watchTask
);