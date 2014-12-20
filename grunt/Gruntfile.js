module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    var config=require("../config");
    var js=config.js;
    var css=config.css;

    grunt.initConfig({
          pkg : grunt.file.readJSON("package.json"),    
          tmod: {
              template: {
                 files:[{
                      src:config.root+"/"+js+"/"+config.templateHtml
                  }],
                  options: {
                      debug : false,
                      charset : "utf-8",
                      type: "cmd",
                      runtime:"patent.js",
                      minify:false,
                      combo:true,
                      cache:false,
                      dest:config.tpldest //一定是相对路径    
                  }
            }
          },
        transport : {
            options : {
                paths : [config.root+config.spm.base],
                alias: config.spm.alias
            },
            app1 : {
                options : {
                    idleading : ""
                },
                files : [
                    {
                        expand: true,
                        cwd : config.root+"/"+js,
                        src : config.gruntFile,
                        filter : 'isFile',
                        dest : config.root+'/build'
                    }
                ]
            }
        },
        concat : {
            options : {
                paths : [config.root+config.spm.base],
                include : 'relative'
            },
            app1 : {
                files: [
                    {
                        expand: true,
                        cwd: config.root+'/build',
                        src: ['**/*.js'],
                        dest: config.root+"/"+config.dest+"/"+js,
                        filter:"isFile",
                        ext: '.js'
                    }  
                ]
            }
        },
        uglify : {
            app : {
                files: [
                    {
                        expand: true,
                        cwd: config.root+"/"+config.dest+"/"+js,  
                        src: ['**/*.js', '!**/*-debug.js'],
                        dest: config.root+"/"+config.dest+"/"+js,    
                        filter:"isFile",
                        ext: '.js'
                    }
                ]
            }           
        },
        css_combo:{
            cssbuild:{
                options:{
                    debug:false,
                    compress:true
                },
                files:[{
                    expand:true,
                    cwd:config.root+"/"+css,
                    src:"**/*.css",
                    filter:"isFile",
                    dest:config.root+"/"+config.dest+"/"+css,
                    ext:".css"
                }]
            }
        },
          //压缩图片
         imagemin: {
           app: {
             options: {
                 optimizationLevel: 3
             },
             files: [
                 {
                    expand: true, 
                    cwd: config.root, 
                    src: config.img,   
                    dest: config.root+"/"+config.dest
                  }
             ]
           }
         },
        copy: {
              main: {
                    expand: true,
                    cwd: config.root+config.spm.base,
                    src: '**',
                    dest: config.root+"/"+config.dest+"/js",
                    filter: 'isFile'
              }
                 
        },
        clean : { 
            options:{
                force:true
            },
            spm : [config.root+"/build",config.root+"/build1"]
        },
         watch: {
              template: {
                  files: config.root+"/"+js+"/"+config.templateHtml+"/**",  
                  tasks: ['tmod'],
                  options: {
                      spawn: false
                  }
              }
          }
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');  
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css-combo');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-tmod');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build-styles', ['transport:styles', 'concat:styles', 'uglify:styles', 'clean']);
    grunt.registerTask('build-app1', ['transport', 'concat:app1', 'uglify', "css_combo","copy",'clean']);

   // grunt.registerTask("build-transport",["transport:app1"]);
    grunt.registerTask("build-imagemin",["imagemin"]);
    grunt.registerTask("build-tmod",["tmod"]);  
    grunt.registerTask("tmod-watch",["tmod","watch:template"]);    

};