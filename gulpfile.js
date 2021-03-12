// 定义依赖项和插件
const gulp=require('gulp');
const  uglify=require('gulp-uglify'); //js压缩
const  concat=require('gulp-concat'); //文件合并
const jshint = require('gulp-jshint'); //js语法检测
const babel = require('gulp-babel');
const rename = require('gulp-rename'); // 重命名
const sass = require('gulp-sass'); // 编译scss
const  minifycss = require('gulp-minify-css'); // 压缩css
// const livereload = require('gulp-livereload'); // 自动刷新页面
const  del = require('del'); //文件删除
const connect = require('gulp-connect'); // 自动刷新页面

// 起服务
gulp.task('server', function() {
  connect.server({
    port: 8080, //指定端口号，在浏览器中输入localhost:8080就可以直接访问生成的html页面
    root: './', //指定html文件起始的根目录
    livereload: true //启动实时刷新功能（配合上边的connect.reload()方法同步使用）
  });
});

// 定义名为 "my-task" 的任务压缩js
gulp.task('my-task-js', function(){
  gulp.src('./js/*.js')
    .pipe(babel())
    .pipe(jshint())
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload())
});


// 定义名为 "my-task-css" 的任务编译scss压缩css
gulp.task('my-task-css', function() {
  gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('all.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist/css'))

});
// 重新更新html
gulp.task('html', function(){
  gulp.src('*.html')
    .pipe(gulp.dest('dist/html'))
    .pipe(connect.reload())
})

//执行压缩前，先删除以前压缩的文件
gulp.task('clean', function() {
  return del(['./dist/css/all.css', './dist/css/all.min.css', './dist/all.js','./dist/all.min.js', './dist/html'])
});
// 定义默认任务

gulp.task('default',['clean'],function() {
  gulp.start('my-task-js', 'my-task-css','watch','server' );
});
// 任务监听
gulp.task('watch', function() {
  // Watch.js files
  gulp.watch('./js/*.js', ['my-task-js']);
  // Watch .scss files
  gulp.watch('./css/*.scss', ['my-task-css']);
  // Watch .html files
  gulp.watch('./*.html', ['html']);
  // Watch any files in dist/, reload on change
  // gulp.watch(['dist/!**']).on('change', livereload.changed);
});
