# grunt-twig-gettext

> Extract i18n string from Twig templates

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-twig-gettext --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-twig-gettext');
```

## The "twig_gettext" task

### Overview
In your project's Gruntfile, add a section named `twig_gettext` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  twig_gettext: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.charset
Type: `String`
Default value: `'ASCII'`

The character set for the .po file.

#### options.encoding
Type: `String`
Default value: `'8bit'`

The content transfer encoding for the .po file.

### Usage Examples

#### Default Options
Extract translatable strings from all Twig templates in a directory and its subdirectories:

```js
grunt.initConfig({
  twig_gettext: {
    options: {},
    files: {
      'dest/domain.po': ['src/**/*.twig', 'dist/**/*.twig'],
    },
  },
});
```

#### Custom Options
Input/output in UTF-8:

```js
grunt.initConfig({
  twig_gettext: {
    options: {
      charset: 'UTF-8'
    },
    files: {
      'dest/domain.po': ['src/**/*.twig'],
    },
  },
});
```

## Notes/caveats
- You should use tools like `msgcat` and `msguniq` to combine the generated
  `.po` file with translations extract from other sources (Javascript, PHP etc.)
  into a `.pot` file to use as a template.
- This Grunt task does not do any validation on the supplied Twig templates, so
  it's up to you to pass something valid.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

