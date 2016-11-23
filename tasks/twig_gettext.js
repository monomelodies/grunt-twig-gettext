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
            var matches = [];
            f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                var twig = grunt.file.read(filepath);
                var result;
                var inline1 = /{% trans "(.*?)" %}/g;
                var inline2 = /{% trans '(.*?)' %}/g;
                var multiline = /{% trans %}((\n|.)*?){% endtrans %}/g;
                var submatches = [];
                while ((result = inline1.exec(twig)) || (result = inline2.exec(twig)) || (result = multiline.exec(twig))) {
                    submatches.push(result);
                }
                matches = matches.concat(submatches.sort(function (a, b) {
                    return a.index < b.index ? -1 : 1;
                }));
            });

            // Replace variables
            matches = matches.map(function (trans) {
                return trans[1].replace(/{{\s*(.*?)\s*}}/g, '%$1%');
            });
            // Format according to .pot
            matches = matches.map(function (trans) {
                var lines = trans.trim().split("\n");
                lines = lines.map(function (line) {
                    line = ('' + line).replace(/\s$/, '');
                    line = '"' + line.replace(/"/g, '\\"');
                    return line;
                });
                trans = lines.join("\\n\"\n") + '"';
                var has_notes = /{% notes %}((\n|.)*?)({%|$)/g;
                var has_plural = /{% plural .*?%}((\n|.)*?)$/g;
                var result = undefined;
                var ret = '';
                if (result = has_notes.exec(trans)) {
                    ret += result[1].replace(/^"\s*/, '# ').replace(/"$/, '') + "\n";
                    trans = trans.replace(result[0], result[1]);
                }
                if (result = has_plural.exec(trans)) {
                    ret += "msgid_plural \"" + result[1] + "\"\n";
                    trans = trans.replace(result[0], '');
                }
                ret = "msgid " + trans + "\n" + ret;
                if (result) {
                    return ret + "msgstr[0] \"\"\nmsgstr[1] \"\"";
                } else {
                    return ret + "msgstr \"\"";
                }
            });
            // Make unique (at least inside the file :))
            var unique = [];
            matches.map(function (match) {
                if (unique.indexOf(match) == -1) {
                    unique.push(match);
                }
            });
            var src = "#, fuzzy\n" +
                "msgid \"\"\n" +
                "msgstr \"\"\n" +
                "\"Language: \\n\"\n" +
                "\"MIME-Version: 1.0\\n\"\n" +
                "\"Content-Type: text/plain; charset=" + options.charset + "\\n\"\n" +
                "\"Content-Transfer-Encoding: " + options.encoding + "\\n\"\n\n" + unique.join("\n\n") + "\n";
            
            // Write the destination file.
            grunt.file.write(f.dest, src);
            
            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
