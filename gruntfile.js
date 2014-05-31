module.exports = function(grunt) {

  // LiveReload的默认端口号，你也可以改成你想要的端口号
  var lrPort = 35729;
  // 使用connect-livereload模块，生成一个与LiveReload脚本
  // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
  var lrSnippet = require('connect-livereload')({
    port: lrPort
  });
  // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
  var lrMiddleware = function(connect, options) {
    return [
      // 把脚本，注入到静态文件中
      lrSnippet,
      // 静态文件服务器的路径
      connect.static(String(options.base)),
      // 启用目录浏览(相当于IIS中的目录浏览)
      connect.directory(String(options.base))
      ];
    };

  // 项目配置
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src: ['src/js/*.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: 'js',
          src: 'script.js',
          dest: 'js',
          ext: 'script-min.js'
        }],
        options: {
          banner: '/*! Creat by <%= pkg.author %> @<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }
      }
    },

    cssmin: {
      compress: {
        files: [{
          expand: true,
          cwd: 'css',
          src: 'style.css',
          dest: 'css',
          ext: 'style-min.css'
        }],
        options: {
          banner: '/*! Creat by <%= pkg.author %> @<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'img/origin',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'img'
        }],
        options: {
                  //解决图片压缩0KB的Bug
                  cache: false
                }

              }
            },

            compass: {
              dev: {
                options: {
                  config: 'config.rb'
                }
              }
      }, // compass: https://github.com/gruntjs/grunt-contrib-compass

      // for livereload
      connect: {
        options: {
          // 服务器端口号
          port: 8080,
          hostname: 'localhost',
          base: '.'
        },
        livereload: {
          options: {
            // 通过LiveReload脚本，让页面重新加载。
            middleware: lrMiddleware
          }
        }
      }, //connect: https://github.com/gruntjs/grunt-contrib-connect
      // 监控文件变化, 然后 打包/刷新浏览器
      watch: {
        html: {
          files: ['*.html']
        },
        sass: {
          files: ['sass/*.scss'],
          tasks: ['compass:dev']
        },
        javascript: {
          files: ['js/script.js']
        },
        livereload: {
          options: {
            livereload: lrPort
          },
          files: ['*.html','css/style.css','js/script.js','sass/*.scss'],
        }
      },

    });

  // 加载提供任务的插件
  //JS合并工具
  grunt.loadNpmTasks('grunt-contrib-concat');
  //JS压缩工具
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //sass编译工具
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //监测单个文件修改
  grunt.loadNpmTasks('grunt-newer');
  //图片压缩工具
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  //CSS压缩工具
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // build
  grunt.registerTask('build', ['compass', 'uglify', 'cssmin', 'imagemin']);
  //默认任务为Build
  grunt.registerTask('default', ['build']);
  // livereload, 监控文件修改, 然后刷新浏览器
  grunt.registerTask('live', ['connect', 'watch']);


};