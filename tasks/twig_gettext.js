/*
 * grunt-twig-gettext
 * http://grunt-twig-gettext.monomelodies.nl
 *
 * Copyright (c) 2015 Marijn Ophorst
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('twig_gettext', 'Extract i18n strings from Twig templates', function () {
        var options = this.options({
            charset: 'ASCII',
            encoding: '8bit'
        });

        this.files.forEach(function (f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                var twig = grunt.file.read(filepath);
                var matches = [];
                var result;
                var inline = /{% trans "(.*?)" %}/g;
                var multiline = /{% trans %}((\n|.)*?){% endtrans %}/g;
                while ((result = inline.exec(twig)) || (result = multiline.exec(twig))) {
                    matches.push(result);
                }
                matches = matches.sort(function (a, b) {
                    return a.index < b.index ? -1 : 1;
                });
                // Replace variables
                matches = matches.map(function (trans) {
                    return trans[1].replace(/{{\s*(.*?)\s*}}/g, '%$1%');
                });
                var unique = [];
                matches.map(function (trans) {
                    if (unique.indexOf(trans) == -1) {
                        unique.push(trans);
                    }
                });
                matches = unique;
                // Format according to .pot
                matches = matches.map(function (trans) {
                    var lines = trans.split("\n");
                    lines = lines.map(function (line) {
                        line = ('' + line).replace(/\s+$/, '');
                        line = '"' + line.replace(/"/, '\\"') + '"';
                        return line;
                    });
                    trans = lines.join("\n");
                    return "msgid " + trans + "\nmsgstr \"\"";
                });
                return matches.join("\n\n") + "\n";
            }).join("\n");

            src = "#, fuzzy\n" +
                "msgid \"\"\n" +
                "msgstr \"\"\n" +
                "\"Language: \\n\"\n" +
                "\"MIME-Version: 1.0\\n\"\n" +
                "\"Content-Type: text/plain; charset=" + options.charset + "\\n\"\n" +
                "\"Content-Transfer-Encoding: " + options.encoding + "\\n\"\n\n" + src;
            
            // Write the destination file.
            grunt.file.write(f.dest, src);
            
            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
