'use strict';

//npm i -D gulp gulp-jade babel-preset-es2015 gulp-sass gulp-combine-mq gulp-minify-css gulp-rigger gulp-babel gulp-uglify gulp-autoprefixer gulp-imagemin gulp.spritesmith gulp-html-replace multipipe gulp-sourcemaps gulp-cache gulp-rename gulp-clean gulp-newer gulp-if gulp-concat merge-stream gulp-connect-multi gulp-notify gulp-size run-sequence gulp-zip

/*******************************************************************************
 DEPENDENCIES
 *******************************************************************************/

const gulp         = require('gulp'),
	  sass         = require('gulp-sass'),
	  combineMq    = require('gulp-combine-mq'),
	  minifyCSS    = require('gulp-minify-css'),
	  rigger       = require('gulp-rigger'),
	  babel        = require('gulp-babel'),
	  uglify       = require('gulp-uglify'),
	  autoprefixer = require('gulp-autoprefixer'),
	  imagemin     = require('gulp-imagemin'),
	  spritesmith  = require('gulp.spritesmith'),
	  htmlreplace  = require('gulp-html-replace'),
	  multipipe    = require('multipipe'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  cache        = require('gulp-cache'),
	  rename       = require('gulp-rename'),
	  clean        = require('gulp-clean'),
	  newer        = require('gulp-newer'),
	  gulpIf       = require('gulp-if'),
	  concat       = require('gulp-concat'),
	  merge        = require('merge-stream'),
	  connect      = require('gulp-connect-multi')(),
	  notify       = require('gulp-notify'),
	  size         = require('gulp-size'),
	  runSequence  = require('run-sequence'),
	  zip          = require('gulp-zip');

// Starting Production version `NODE_ENV=production npm start build` 
// will lead to assembly without sourcemaps and minify files
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';


/*******************************************************************************
 FILE / PATH / SHIM  CONFIG
 *******************************************************************************/

var folders = {
	src: './src',
	dest: './dist',
	bower: './src/components',
	sassIncludePaths: ['src/components'],
	componentsPath: 'src/components'
};


var config = {
	autoprefixer: {
		def: [
			'last 2 version',
			'> 1%',
			'safari 5',
			'ie 8',
			'ie 9',
			'opera 12.1',
			'ios 6',
			'android 4'
		],
		mobile: [
			'ios 6',
			'android 4'
		]
	}
};


/*******************************************************************************
 CLEAN TASK
 *******************************************************************************/
gulp.task('clean', function () {
	return gulp.src([folders.dest + '/'], {read: false})
		.pipe(clean());
});


/*******************************************************************************
 CSS TASK
 *******************************************************************************/

gulp.task('sass', function () {
	return multipipe(
		gulp.src(folders.src + '/scss/*.scss'),
		gulpIf(isDev, sourcemaps.init()),
		sass({
			//includePaths: folders.sassIncludePaths,
			outputStyle: 'expanded'
		}),
		autoprefixer.apply(config.autoprefixer.def),
		gulpIf(!isDev, rename({suffix: '.min'})),
		gulpIf(!isDev, combineMq()),
		gulpIf(isDev, sourcemaps.write()),
		gulpIf(!isDev, minifyCSS()),
		gulp.dest(folders.dest + '/css'),
		size()
	).on('error', notify.onError(function (err) {
		return {
			title: 'SASS Error',
			message: err.message
		}
	}));
});


/*******************************************************************************
 JAVASCRIPT TASK
 *******************************************************************************/

gulp.task('js', function () {
	return multipipe(
		gulp.src(folders.src + '/js/*.js'),
		gulpIf(isDev, sourcemaps.init()),
		babel({
			presets: ['es2015']
		}),
		concat('main.js'),
		gulpIf(!isDev, rename({suffix: '.min'})),
		gulpIf(isDev, sourcemaps.write()),
		gulpIf(!isDev, uglify()),
		gulp.dest(folders.dest + '/js'),
		size()
	).on('error', notify.onError(function (err) {
		return {
			title: 'JS Error',
			message: err.message
		}
	}));
});

gulp.task('vendors:copy', function () {
	return gulp.src(folders.src + '/js/vendors/**')
		.pipe(gulp.dest(folders.dest + '/js/vendors'));
});


/*******************************************************************************
 IMAGES / SPRITE TASK
 *******************************************************************************/

gulp.task('images', function () {
	return multipipe(
		gulp.src(folders.src + '/images/*.*'),
		cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})),
		gulp.dest(folders.dest + '/images'),
		size()
	);
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(folders.src + '/images/sprite/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss',
		padding: 10,
		imgPath: '../images/sprite.png',
		cssVarMap: function (sprite) {
			sprite.name = 's-' + sprite.name
		}
	}));
	var imgStream = spriteData.img.pipe(gulp.dest(folders.dest + '/images'));
	var cssStream = spriteData.css.pipe(gulp.dest(folders.src + '/scss/modules/'));
	return merge(imgStream, cssStream);
});


/*******************************************************************************
 FONT TASK
 *******************************************************************************/

gulp.task('fonts', function () {
	return gulp.src(folders.src + '/fonts/**')
		.pipe(gulp.dest(folders.dest + '/fonts'));
});

/*******************************************************************************
 TEMPLATE TASK
 *******************************************************************************/

gulp.task('html', function () {
	return multipipe(
		gulp.src(folders.src + '/*.html'),
		rigger(),
		gulpIf(!isDev, htmlreplace({
			'css': 'css/style.min.css',
			'js': 'js/main.min.js'
		})),
		gulp.dest(folders.dest)
	)
});

/*******************************************************************************
 SERVER TASK
 *******************************************************************************/

// Connect
gulp.task('connect', connect.server({
	root: [folders.dest],
	port: 9000,
	livereload: true
}));


/*******************************************************************************
 BUILD TASK
 *******************************************************************************/

gulp.task('default', function (callback) {
	runSequence(
		['clean', 'sprite'],
		['js', 'vendors:copy', 'sass', 'images', 'fonts', 'html'],
		callback
	);
});

gulp.task('build', ['default'], function () {

	return gulp.src(folders.dest + '/**/*')
		.pipe(zip('project.zip'))
		.pipe(gulp.dest('.'))
		.pipe(notify('Build successfull'));
});


// Watch
gulp.task('watch', ['default', 'connect'], function () {
	// Watch for changes in `app` folder
	gulp.watch([
		folders.dest + '/**/*.{html,shtml,php,xml,json}',
		folders.dest + '/css/**/*.css',
		folders.dest + '/js/**/*.js',

		folders.dest + '/images/*',
	], function (event) {
		return gulp.src(event.path)
			.pipe(connect.reload());
	});

	// Watch .scss files
	gulp.watch(folders.src + '/scss/**/*.scss', ['sass']);

	// Watch .js files
	gulp.watch(folders.src + '/js/**/*.js', ['js']);

	// Watch image files
	gulp.watch(folders.src + '/images/*', ['images']);

	// Watch sprite files
	gulp.watch(folders.src + '/images/sprite', ['sprite']);

	// Watch html files
	gulp.watch([folders.src + '/*.*', folders.src + '/template/**/*'], ['html']);

});
