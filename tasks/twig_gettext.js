/*
 * grunt-twig-gettext
 * http://grunt-twig-gettext.monomelodies.nl
 *
 * Copyright (c) 2015 Marijn Ophorst, Alvaro Maceda
 * Licensed under the MIT license.
 */

'use strict';
var Extractor = require('./twig_extractor.js');

module.exports = function (grunt) {

    grunt.registerMultiTask('twig_gettext', 'Extract i18n strings from Twig templates', function () {
        var options = this.options({
            charset: 'ASCII',
            encoding: '8bit'
        });

        this.files.forEach(function (f) {
            var matches = [];

            var files = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            var extractor = new Extractor(grunt, options);
            var poContents = extractor.generatePoContents(files);

            // Write the destination file.
            grunt.file.write(f.dest, poContents);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
