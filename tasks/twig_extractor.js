/*
 * grunt-twig-gettext
 * http://grunt-twig-gettext.monomelodies.nl
 *
 * Copyright (c) 2015 Marijn Ophorst, Alvaro Maceda
 * Licensed under the MIT license.
 */

'use strict';

var Extractor = function(grunt, options) {
    this.grunt = grunt;
    this.options = options;
};

Extractor.prototype = (function() {

    var that;

    function transformTwigVariablesInGettextVariables(matches) {
        matches = matches.map(function (trans) {
            return trans[1].replace(/{{\s*(.*?)\s*}}/g, '%$1%');
        });
        return matches;
    }

    function formatTranslationsAccordingToPot(matches) {
        var generatedLines;

        generatedLines = matches.map(function (trans) {
            trans = trans.trim();
            var has_notes = /{% notes %}((\n|.)*?)({%|$)/g.exec(trans);
            if (has_notes) {
                trans = trans.replace(has_notes[0], has_notes[3]);
            }
            var has_plural = /{% plural .*?%}((\n|.)*?)$/g.exec(trans);
            if (has_plural) {
                trans = trans.replace(has_plural[0], '');
            }
            var lines = trans.split("\n");
            lines = lines.map(function (line) {
                line = ('' + line).replace(/\s$/, '');
                line = '"' + line.replace(/"/g, '\\"');
                return line;
            });
            trans = lines.join("\\n\"\n") + '"';
            var result;
            var ret = '';
            if (has_notes) {
                has_notes[1].split('\n').map(function (note) {
                    ret += '# ' + note + '\n';
                });
            }
            ret += "msgid " + trans + "\n";
            if (has_plural) {
                ret += "msgid_plural " + has_plural[1].split('\n').map(function (line) {
                        line = ('' + line).replace(/\s$/, '');
                        line = '"' + line.replace(/"/g, '\\"');
                        return line;
                    }).join("\\n\"\n") + "\"\n";
                return ret + "msgstr[0] \"\"\nmsgstr[1] \"\"";
            } else {
                return ret + "msgstr \"\"";
            }
        });

        return generatedLines;
    }

    function removeDuplicatedEntries(entries) {
        var unique = [];
        entries.map(function (match) {
            if (unique.indexOf(match) === -1) {
                unique.push(match);
            }
        });
        return unique;
    }

    function generatePoContents(entries) {
        var src = "#, fuzzy\n" +
            "msgid \"\"\n" +
            "msgstr \"\"\n" +
            "\"Language: \\n\"\n" +
            "\"MIME-Version: 1.0\\n\"\n" +
            "\"Content-Type: text/plain; charset=" + that.options.charset + "\\n\"\n" +
            "\"Content-Transfer-Encoding: " + that.options.encoding + "\\n\"\n\n" + entries.join("\n\n") + "\n";
        return src;
    }

    function appendInlineMatches(fileContents, currentMatches) {
        var result;
        var inline = /{%\s*trans\s*('|")(.*?)(\1)\s*%}/g;
        while (result = inline.exec(fileContents)) {
            result[1] = result[2]; // Text is in the second capture group
            currentMatches.push(result);
        }
    }

    function appendMultilineMatches(fileContents, currentMatches) {
        var result;
        var multiline = /{% trans %}((\n|.)*?){% endtrans %}/g;
        while (result = multiline.exec(fileContents)) {
            currentMatches.push(result);
        }
    }

    function appendFilterMatches(fileContents, currentMatches) {
        var result;

        var filter = /('|")(.*)(\1)\s*\|\s*trans\s*\W/g;
        while (result = filter.exec(fileContents)) {
            result[1] = result[2]; // Text is in the second capture group
            currentMatches.push(result);
        }
    }

    function obtainMatchesInFile(filepath) {
        var matchesInFile = [];
        var fileContents = that.grunt.file.read(filepath);

        appendInlineMatches(fileContents,matchesInFile);
        appendMultilineMatches(fileContents,matchesInFile);
        appendFilterMatches(fileContents,matchesInFile);

        return matchesInFile;
    }


    function obtainMatchesInAllFiles(files, matches) {
        files.map(function (filepath) {
            var matchesInFile = obtainMatchesInFile(filepath);
            matches = matches.concat(matchesInFile.sort(function (a, b) {
                return a.index < b.index ? -1 : 1;
            }));
        });
        return matches;
    }

    return {

        constructor:Extractor,

        // Public method
        generatePoContents:function(files) {

            that = this;

            var matches = [];

            matches = obtainMatchesInAllFiles(files, matches);
            matches = transformTwigVariablesInGettextVariables(matches);
            var entries = formatTranslationsAccordingToPot(matches);

            return generatePoContents(removeDuplicatedEntries(entries));
        }

    };
})();

module.exports = Extractor;