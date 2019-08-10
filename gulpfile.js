var gulp       = require('gulp'), // Подключаем Gulp
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	pngquant		 = require('imagemin-pngquant'),
	plumber 	 	 = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

	gulp.task('browser-sync', function() { // Создаем таск browser-sync
		browserSync({ // Выполняем browserSync
			server: { // Определяем параметры сервера
				baseDir: 'ops' // Директория для сервера - app
			},
			notify: false // Отключаем уведомления
		});
	});

	gulp.task('sass', function (){ // Создаем таск Sass
		return gulp.src('ops/css/sass/main.sass') // Берем источник
			.pipe(plumber())
			.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
			.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
			.pipe(gulp.dest('ops/css/sass')) // Выгружаем результата в папку app/css
			.pipe(browserSync.reload({stream: true}))// Обновляем CSS на странице при изменении
	});


gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('ops/css/main.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('ops/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
	gulp.watch('ops/css/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('ops/index.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('ops/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('ops/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean','img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'ops/css/sass/main.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('ops/css/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('ops/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('ops/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
