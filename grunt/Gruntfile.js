module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    var config=require("../config");
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),
        transport : {
            options : {
                paths : [config.root+config.spm.base],
                alias: config.spm.alias,
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },
            app1 : {
                options : {
                    idleading : ''
                },
                files : [
                    {
                        expand: true,
                        cwd : config.root,
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
                        src: config.gruntFile,
                        dest: config.root+"/assets",
                        ext: '.js'
                    }
                ]
            }
        },
        uglify : {
            styles : {
                files: [
                    {
                        expand: true,
                        cwd: config.root+"/assets",
                        src: ['styles/**/*.js', '!styles/**/*-debug.js'],
                        dest: config.root+"/assets",
                        ext: '.js'
                    }
                ]
            },
            app1 : {
                files: [
                    {
                        expand: true,
                        cwd: config.root+"/assets",
                        src: ['**/*.js', '!**/*-debug.js'],
                        dest: config.root+"/assets",
                        ext: '.js'
                    }
                ]
            }
        },
        clean : {
            options:{
                force:true
            },
            spm : [config.root+'/build']
        }
    });
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build-styles', ['transport:styles', 'concat:styles', 'uglify:styles', 'clean']);
    grunt.registerTask('build-app1', ['transport:app1', 'concat:app1', 'uglify:app1', 'clean']);
//    grunt.registerTask('default', ['clean']);
};