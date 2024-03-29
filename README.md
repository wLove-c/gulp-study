@[TOC](前端构建工具Gulp.js知多少(webpack/gulp/grunt))
### 写在前面
> 前几天在更新webpack知识的时候，想起来三年前用过的前端构建工具gulp/grunt,遂写个笔记总结一下，出来混总是要还的，忘得七七八八了...

阅读本文章之前，相信你已经对前端构建工具(webpack、gulp、grunt)有一定的认知和了解了，那么他们之间究竟有什么区别呢？
### 什么是gulp？
gulp文档上面有这么一句话$\color{blue} {用自动化构建工具增强你的工作流程！} $ ，也就是说 gulp是一个自动化构建工具；
gulp的一些功能如下(包括但不限于):
![自动化构建工具gulp](https://upload-images.jianshu.io/upload_images/11447772-631953087e459269.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### gulp或grunt和webpack的区别
其实Webpack和另外两个并没有太多的可比性
* Gulp/Grunt是一种能够优化前端的开发流程的工具，而WebPack是一种模块化的解决方案，不过Webpack的优点使得Webpack在很多场景下可以替代Gulp/Grunt类的工具。

* Grunt和Gulp的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。
![Grunt和Gulp的工作流程](https://upload-images.jianshu.io/upload_images/11447772-d87610855f28fd9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。
![Webpack的工作方式](https://upload-images.jianshu.io/upload_images/11447772-cdea13333a46b8f2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**上述内容转自@zhangwang的[入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f)**

### gulp起步
傻瓜式起步照搬官网文档
1.安装
```
// 全局安装
$ npm install -g gulp
或者
$ npm install --global gulp

// 作为项目的开发依赖（devDependencies）安装：
$ npm install --save-dev gulp
```
2.在项目根目录下创建一个名为 gulpfile.js 的文件：
```
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```
3.运行 gulp：
```
$ gulp
```
默认的名为 default 的任务（task）将会被运行，在这里，这个任务并未做任何事情。
具体详情可以查看[gulpjs.com文档](https://www.gulpjs.com.cn/docs/)

### 项目搭建
新建一个项目gulp-test
环境:
```
$ node -v // v9.1.0
$ npm -v // 6.5.0
```
1.新建文件以下文件如下
```
gulp-test/
          css/
               index.scss
           js/
               helloworld.js
           index.html
           gulpfile.js
```
其中 **gulpfile.js** 是我们gulp的配置文件，启动gulp默认会找个这个文件并执行；
2.接下来安装依赖
```
$ npm init
```
一直按回车Enter初始化package.json文件(小技巧: **npm iniy -y** 可以免去繁琐的enter步骤)
此时我们的目录结构是这样了
```
gulp-test/
          css/
               index.scss
           js/
               helloworld.js
           index.html
           gulpfile.js
           package.json
```
安装依赖
```
npm i --save-dev gulp        // gulp自动化构建工具
npm i --save-dev gulp-uglify //js压缩
npm i --save-dev gulp-concat //文件合并
npm i --save-dev gulp-jshint //js语法检测
npm i --save-dev gulp-rename //文件重命名
npm i --save-dev gulp-sass //sass编译工具
npm i --save-dev gulp-minify-css //css压缩
npm i --save-dev del       //文件删除
// 以下三选一
npm i --save-dev gulp-connect       // 自动刷新页面
npm i --save-dev  browser-sync       // 自动刷新页面
npm i --save-dev gulp-livereload       // 自动刷新页面
```
这里页面实时刷新只讲这个**gulp-connect** ，其他详情可以参照[Browsersync](http://www.browsersync.cn/docs/gulp/)和文章[gulp-livereload](http://www.ydcss.com/archives/702)

安装完依赖后配置gulpfile.js如下:
```javascript
// 定义依赖项和插件
const gulp=require('gulp');
const  uglify=require('gulp-uglify'); //js压缩
const  concat=require('gulp-concat'); //文件合并
const jshint = require('gulp-jshint'); //js语法检测
const rename = require('gulp-rename'); // 重命名
const sass = require('gulp-sass'); // 编译scss
const  minifycss = require('gulp-minify-css'); // 压缩css
// const livereload = require('gulp-livereload'); // 自动刷新页面
const  del = require('del'); //文件删除
const connect = require('gulp-connect'); // 自动刷新页面

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
  gulp.start('my-task-js', 'my-task-css', 'watch', 'server' );
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

```
大概讲解一下gulpfile.js:
```javascript
// ...
// 定义名为 "my-task" 的任务压缩js
gulp.task('my-task-js', function(){
  gulp.src('./js/*.js')
    .pipe(jshint()) //js检测
    .pipe(uglify()) //js压缩
    .pipe(concat('all.js')) //合并为all.js
    .pipe(rename({suffix: '.min'})) // 重命名为all.mim.js
    .pipe(gulp.dest('./dist/js')) //输出到/dist/js目录
    .pipe(connect.reload()) // 更新页面
});
// ...
```
**gulp.task**是gulp的api 定义一个使用 [Orchestrator](https://github.com/robrich/orchestrator) 实现的任务（task）
如上我们定义了**my-task-js**，**my-task-css**，**html**，**clean**，**default**，**watch**，**server**等任务，其中:

* **my-task-js** 是将 符合所提供的匹配模式的js 进行检测(gulp-jshint)、压缩(gulp-uglify)、合并(gulp-concat)、重命名(gulp-rename)、输出(gulp.dest)到/dist/js目录下；


* **my-task-css** 是将 符合所提供的匹配模式的sass进行编译(gulp-sass)、压缩(gulp-uglify)、合并(gulp-concat)、重命名(gulp-rename)、输出(gulp.dest)到/dist/css目录下；


* **html**  是将 符合所提供的匹配模式的html进行监听，如果有变化则connect.reload()


* **clean** 是如果任务重新启动时 删除旧文件；


* **default** gulp默认启动的任务


* **watch** gulp的api 监视文件，并且可以在文件发生改动时候做一些事情。它总会返回一个 EventEmitter 来发射（emit） change 事件。


* **server** 依赖gulp-connect启动一个服务器

```
gulp.task('server', function() {
  connect.server({
    port: 8080, //指定端口号，在浏览器中输入localhost:8080就可以直接访问生成的html页面
    root: './', //指定html文件起始的根目录
    livereload: true //启动实时刷新功能（配合上边的connect.reload()方法同步使用）
  });
});
```
配置完gulpfile.js之后，我们给js和css及html加点东西:

首先js/helloworld.js
```
// helloworld.js
console.log('hello world')
```
css/index.scss
```
// index.scss

// 变量测试
$fontColor:  #red;
$backColor: aqua;
// 嵌套类测试
div {
  p {
    font-weight: bold;
    font-size: 20px;
    color: $fontColor;
  }
}

div{
  background: $backColor;
}
```
index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>gulp-study</title>
	<link href=/dist/css/all.min.css rel=stylesheet>
</head>
<body>
	<div id="firstDiv">
		<p>我是gulp</p>
		<p>hello world</p>
	</div>
<p>我是p标签</p>
<p>我是p标签</p>
</body>
<script src="/dist/js/all.min.js"></script>
</html>

```
运行gulp
```
$ gulp
```
![运行输出](https://upload-images.jianshu.io/upload_images/11447772-658fdd8778eee60b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

------
浏览器效果:
![效果](https://upload-images.jianshu.io/upload_images/11447772-71e06d521d7296ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来我们修改helloworld.js来看看是否能实时刷新
修改如下:
```
// helloworld.js
console.log('hello world');

let firstDiv =  document.getElementById('firstDiv')

console.log(firstDiv)

```
按保存之后，终端给我们报了一个错:
![Unhandled 'error' event](https://upload-images.jianshu.io/upload_images/11447772-ccc18ca2147541e1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

查看js发现我们用了es6语法的声明语句$\color{red}{let}$ 但当前gulp无法处理es6语法，有问题解决问题，es6=>es5

解决方案:
安装gulp-babel babel-core babel-preset-es2015
```
npm i  --save-dev  gulp-babel babel-core babel-preset-es2015
```
gulpfile.js修改如下:
```javascript
// ...
const babel = require('gulp-babel');
// ...
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
// ...

```
运行
```
$ gulp
```
依然报上面的错；找了一些原因发现，虽然安装了相关依赖，却没有配置.babelrc文件，即babel还没转化es6

根目录添加.babelrc文件
```
{
	"presets": ["es2015"]
}

```
重新运行:
```
$ gulp
```
![结果如下](https://upload-images.jianshu.io/upload_images/11447772-ebca2eebe090db0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

查看dist下的js文件
![let已经转化成var](https://upload-images.jianshu.io/upload_images/11447772-d6e0cd882a9255d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

改变helloworld.js检查页面是否刷新
```javascript
// helloworld.js
console.log('hello world');

let firstDiv =  document.getElementById('firstDiv')

console.log(firstDiv)
firstDiv.style.backgroundColor = 'yellow';

```
保存，页面的天空蓝换成你们喜欢的yellow颜色
![页面的天空蓝换成你们喜欢的yellow颜色](https://upload-images.jianshu.io/upload_images/11447772-b754da4517d86f46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

修改index.scss 查看是否会刷新页面
```scss
// index.scss

// 变量测试
$fontColor:  #red;
$backColor: aqua;
// 嵌套类测试
div {
  p {
    font-weight: bold;
    font-size: 20px;
    color: $fontColor;
  }
}

div{
  background: $backColor;
  width: 400px;
  height: 400px;
  margin: 0 auto;
}


```
![页面更新正常](https://upload-images.jianshu.io/upload_images/11447772-2c4df6498e367b28.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后修改index.html 查看是否会刷新页面
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>gulp-study</title>
	<link href=/dist/css/all.min.css rel=stylesheet>
</head>
<body>
	<div id="firstDiv">
		<p>我是gulp</p>
		<p>hello world</p>
	</div>
<div>
	<p>我是真的皮</p>
</div>
</body>
<script src="/dist/js/all.min.js"></script>
</html>

```
![输出完美](https://upload-images.jianshu.io/upload_images/11447772-ffbb4620ab84a644.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 此次项目源码请转@[王一诺gulp-study](https://github.com/wLove-c/gulp-study)


### 文章最后
今天主要学习了gulp的简单项目搭建及实时更新配置；其实gulp类似于grunt的弱化版，但更简单好用，只是插件会少一些，目前主流的项目搭建工具主要是webpack，但依然有不少项目还用着gulp或者grunt

扩展:
> [webpack中文网](https://www.webpackjs.com/concepts/)

> [gulpjs中文网](https://www.gulpjs.com.cn/docs/)

> [gruntjs中文网](https://www.gruntjs.net/getting-started)

下面还有一些楼主的学习笔记:
> @[webpack4+加vue2+从零开始搭设vue项目](https://www.jianshu.com/p/10fbaa365f0c)

> @[nginx部署/代理/跨域](https://www.jianshu.com/p/c577582581b1)

有兴趣的可以多多交流@[楼主博客](https://wlove-c.github.io/)




