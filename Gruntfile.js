/*
 * grunt-twig-gettext
 * http://grunt-twig-gettext.monomelodies.nl
 *
 * Copyright (c) 2015 Marijn Ophorst
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        
        clean: {
            tests: ['tmp']
        },
        
        twig_gettext: {
            default_options: {
                options: {},
                files: {
                    'tmp/default_options': ['test/fixtures/template.twig']
                }
            },
            custom_options: {
                options: {
                    encoding: '16bit',
                    charset: 'UTF-8'
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/template.twig']
                }
            }
        },

        nodeunit: {
            tests: ['test/*_test.js']
        }    
    });
    
    grunt.loadTasks('tasks');
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    
    grunt.registerTask('test', ['clean', 'twig_gettext', 'nodeunit']);
    
    grunt.registerTask('default', ['jshint', 'test']);

};

