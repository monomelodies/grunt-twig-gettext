'use strict';

var grunt = require('grunt');

exports.twig_gettext = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    default_options: function (test) {
        var actual = grunt.file.read('tmp/default_options');
        var expected = grunt.file.read('test/expected/default_options');
        test.equal(actual, expected, 'Extracts strings from Twig templates.');
        test.done();
    },
    custom_options: function (test) {
        var actual = grunt.file.read('tmp/custom_options');
        var expected = grunt.file.read('test/expected/custom_options');
        test.equal(actual, expected, 'Accepts custom charset/encoding.');
        test.done();
    }
};

