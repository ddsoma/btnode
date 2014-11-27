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
                alias: config.spm.alias
            },
            app1 : {
                options : {
                    idleading : ''
                },
                files : [
                    {
                        expand: true,
                        cwd : config.root+"/js",
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
                        dest: config.root+"/assets/js",
                        filter:"isFile",
                        ext: '.js'
                    }
                ]
            }
        },
        uglify : {
            app1 : {
                files: [
                    {
                        expand: true,
                        cwd: config.root+"/assets/js",
                        src: ['**/*.js', '!**/*-debug.js'],
                        dest: config.root+"/assets/js",
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
                    cwd:config.root+"/css",
                    src:"**/*.css",
                    filter:"isFile",
                    dest:config.root+"/assets/css",
                    ext:".css"
                }]
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
    grunt.loadNpmTasks('grunt-css-combo');
    grunt.registerTask('build-styles', ['transport:styles', 'concat:styles', 'uglify:styles', 'clean']);
    grunt.registerTask('build-app1', ['transport:app1', 'concat:app1', 'uglify:app1', 'clean',"css_combo"]);
    
//    grunt.registerTask('default', ['clean']);
};