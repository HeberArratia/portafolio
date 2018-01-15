'use strict';

/*
Gulp File 
Autor: Heber Arratia
Basado: Daniel Gillermo Romero 
*/

/*
 =============================================================
 * Dependencias
 =============================================================
*/
var gulp = require('gulp'),
    plumber = require('gulp-plumber'), //Controlar errores
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'), //Anadir auto-prefijos css
    sass = require('gulp-sass'), //Compilar Sass
    jade = require('gulp-jade'), //Compilar Jade
    uglify = require('gulp-uglify'), //Minificar JS
    concat = require('gulp-concat'), //Concatenar JS
    minifyCss = require('gulp-minify-css'),// Minificar CSS
    htmlmin = require('gulp-htmlmin'), //Minificar html
    imagemin = require('gulp-imagemin'), //Minificar imagenes
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync').create(); //Cambios en vivo

/*
 =============================================================
 * Compilaciones
 =============================================================
*/    

/**
 * Compila los archivos sass hijos directos de la carpeta `scss/`.
 * Agrega los prefijos propietarios de los navegadores.
 * Los archivos CSS generados se guardan en la carpeta `css/`.
 */

gulp.task('sass', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 versions']})
    ];

    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(plumber())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

/**
 * Compila los archivos jade hijos directos de la carpeta `jade/`.
 * Los archivos HTML generados se guardan en la carpeta raíz del proyecto.
 */

gulp.task('jade', function () {
    return gulp.src('./jade/*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
        .on('end', browserSync.reload);
});

/*
 =============================================================
 * Cambios en vivo
 =============================================================
*/    

/**
 * Variable de entorno.
 * En la terminal se puede definir de manera opcional el puerto para cualquiera
 * de las tareas watch, un ejemplo de uso sería:
 * PORT=8080 gulp watch:all
 */

var PORT = process.env.PORT || 7070;

/**
 * Recarga el HTML en el navegador.
 * Creado para quienes no usen Jade.
 */
gulp.task('html', function () {
    browserSync.reload('*.html');
});

/**
 * Recarga el navegador
 */

gulp.task('js', function () {
    browserSync.reload('*.js');
});

/**
 * Crea un servidor local
 * http://localhost:7070
 */

gulp.task('browser-sync', function () {
    browserSync.init({
        port: PORT,
        server: {
            baseDir: "./"
        },
        ui: {
            port: PORT + 1
        }
    });
});

/**
 * Ejecuta la tarea sass y queda escuchando los cambios de todos
 * los archivos Sass de la carpeta `scss/` y subcarpetas.
 */

gulp.task('watch:sass', function () {
    browserSync.watch('./scss/**/*.scss').on('change', function () {
        gulp.start('sass');
    });
});


/**
 * Ejecuta la tarea jade y queda escuchando los cambios de todos
 * los archivos jade de la carpeta `jade/` y subcarpetas.
 */

gulp.task('watch:jade', function () {
    browserSync.watch('./jade/**/*.jade').on('change', function () {
        gulp.start('jade');
    });
});


/**
 * Ejecuta la tarea html y queda escuchando los cambios de todos
 * los archivos HTML de la carpeta raíz del proyecto.
 * Creado para quienes no usen Jade.
 */

gulp.task('watch:html', function () {
    browserSync.watch('./*.html').on('change', function () {
        gulp.start('html');
    });
});


/**
 * Ejecuta la tarea js y queda escuchando los cambios de todos
 * los archivos Javascript.
 */

gulp.task('watch:js', function () {
    browserSync.watch('./js/**/*.js').on('change', function () {
        gulp.start('js');
    });
});


/**
 * Ejecuta las tareas watch:html y watch:sass
 * Creado para quienes no usen Jade.
 */

gulp.task('watch:html-sass', ['watch:html', 'watch:sass']);


/**
 * Ejecuta las tareas browser-sync, watch:sass, watch:jade y watch:js.
 */

gulp.task('watch:all', function () {
    gulp.start('browser-sync');
    gulp.start('watch:sass');
    gulp.start('watch:html');
    gulp.start('watch:js');
});

/*
 =============================================================
 * Producir
 =============================================================
*/    

gulp.task('produce',function(){
    gulp.start('minjs');
    gulp.start('mincss');
    gulp.start('minhtml');
});

/* Concatenar y minificar JS */

gulp.task('minconjs', function() {
    return gulp.src('./js/*.js')
    .pipe(concat('code.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dest/js'));
});

/* Minificar JS */

gulp.task('minjs', function() {
  return gulp.src('./js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dest/js'));
});

/* Minificar css*/

gulp.task('mincss', function() {
  return gulp.src('./css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dest/css'));
});

/* Minificar html*/

gulp.task('minhtml', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dest'))
});

/* Minificar imagenes*/

gulp.task('minimg', () => {
    return gulp.src('./img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dest/img'));
});

/*
 =============================================================
 * General
 =============================================================
*/    

/**
 * Ejecuta la tarea watch:all.
 */

gulp.task('default', ['watch:all']);
