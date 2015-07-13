'use strict';

var yeoman = require('yeoman-generator'),
  osLocale = require('os-locale'),
  join = require('path').join,
  _ = require('underscore'),
  chalk = require('chalk'),
  fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);


    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    this.coffee = this.options.coffee;

    this.pkg = require('../package.json');
  },

  askFor: function() {
    var done = this.async(),
      _this = this,
      baseLocale = JSON.parse(fs.readFileSync(join(_this.sourceRoot(),
        '../language/zh_CN.json')));

    //choose os locale
    osLocale(function(err, locale) {
      //=> 'en_US'
      //ps.最终成型前只支持中文（简体）、中文（繁体）、英文（美式）
      if (locale == 'zh_CN' || locale == 'zh_Hans') {
        _this.locale = _.extend(baseLocale, JSON.parse(fs.readFileSync(
          join(_this.sourceRoot(), '../language/' + locale +
            '.json'))));
      } else if (locale == 'zh_Hant' || locale == 'zh_HK' || locale ==
        'zh_MO') {
        _this.locale = _.extend(baseLocale, JSON.parse(fs.readFileSync(
          join(_this.sourceRoot(), '../language/zh_Hant.json'))));
      } else {
        _this.locale = _.extend(baseLocale, JSON.parse(fs.readFileSync(
          join(_this.sourceRoot(), '../language/en_US.json'))));
      }
      // welcome message
      if (!_this.options['skip-welcome-message']) {
        _this.log(require('yosay')());
        _this.log(chalk.magenta(_this.locale['welcome']));
      }

      var prompts = [{
        name: 'name',
        message: _this.locale['name'],
        default: 'myproject'
      }, {
        name: 'description',
        message: _this.locale['description'],
        default: 'This is a nuclear package!'
      }, {
        type: 'rawlist',
        name: 'cssmodel',
        message: _this.locale['cssmodel']['message'],
        choices: [{
          name: _this.locale['cssmodel']['choices']['less'],
          value: 'includeLess'
        }, {
          name: _this.locale['cssmodel']['choices']['sass'],
          value: 'includeSass'
        }, {
          name: _this.locale['cssmodel']['choices']['css'],
          value: 'includeCss'
        }]
      }, {
        type: 'checkbox',
        name: 'features',
        message: _this.locale['features']['message'],
        choices: [{
          name: _this.locale['features']['choices'][
            'bootstrap'
          ],
          value: 'includeBootstrap',
          checked: false
        }, {
          name: _this.locale['features']['choices']['jquery'],
          value: 'includeJquery',
          checked: true
        }, {
          name: _this.locale['features']['choices'][
            'modernizr'
          ],
          value: 'includeModernizr',
          checked: true
        }]
      }, {
        type: 'rawlist',
        name: 'devmodel',
        message: _this.locale['devmodel']['message'],
        choices: [{
          name: _this.locale['devmodel']['choices'][
            'templates'
          ],
          value: 'templates'
        }, {
          name: _this.locale['devmodel']['choices'][
            'fullstack'
          ],
          value: 'fullstack'
        }]
      }];

      _this.prompt(prompts, function(answers) {
        var features = answers.feature,
          cssmodel = answers.cssmodel,
          devmodel = answers.devmodel;

        function hasFeature(feat) {
          return features && features.indexOf(feat) !== -1;
        };

        function hasCssmodel(css) {
          return cssmodel && cssmodel.indexOf(css) !== -1;
        };

        function hasDevmodel(dev) {
          return devmodel && devmodel.indexOf(dev) !== -1;
        };
        //Common
        _this.appname = this._.slugify(answers.name);
        _this.description = answers.description;
        //Css Precompiled
        _this.includeLess = hasCssmodel('includeLess');
        _this.includeSass = hasCssmodel('includeSass');
        _this.includeLibSass = answers.libsass;
        _this.includeRubySass = !answers.libsass;
        //Module
        _this.includeCss = hasFeature('includeCss');
        _this.includeJquery = hasFeature('includeBootstrap');
        _this.includeBootstrap = hasFeature('includeJquery');
        _this.includeModernizr = hasFeature('includeModernizr');
        //project model
        _this.useTemplates = hasDevmodel('templates');
        _this.useFullstack = hasDevmodel('fullstack');

        done();
      }.bind(_this));
    });
  },

  gruntfile: function() {
    this.template('Gruntfile.js');
  },

  templatesJSON: function() {
    this.template('templatesConfig.json');
  },

  packageJSON: function() {
    this.template('_package.json', 'package.json');
  },

  git: function() {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  bower: function() {
    var bower = {
      name: this._.slugify(this.appname),

      description: this.description,
      private: true,
      dependencies: {}
    };

    if (this.includeBootstrap && !this.includeSass) {
      bower.dependencies['bootstrap'] = '~3.2.0';
    } else if (this.includeBootstrap && this.includeSass) {
      bower.dependencies['bootstrap-sass-official'] = '~3.2.0';
    } else {
      if (this.includeJquery) {
        bower.dependencies['jquery'] = '~1.11.1';
      }
      bower.dependencies['normalize.css'] = '~3.0.3';
    }

    if (this.includeModernizr) {
      bower.dependencies.modernizr = '~2.8.2';
    }

    this.copy('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  jshint: function() {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function() {
    this.copy('editorconfig', '.editorconfig');
  },

  mainStylesheet: function() {
    if (this.includeLess) {
      this.template('main.less', 'dev/less/main.less');
    } else if (this.includeSass) {
      this.template('main.scss', 'dev/scss/main.scss');
    } else {
      this.template('main.css', 'dev/styles/main.css');
    }
  },

  writeIndex: function() {
    this.indexFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), 'index.html')),
      this
    );

    // wire Bootstrap plugins
    if (this.includeBootstrap && !this.includeSass) {
      var bs = 'bower_components/bootstrap/js/';

      this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/plugins.js',
        sourceFileList: [
          bs + 'affix.js',
          bs + 'alert.js',
          bs + 'dropdown.js',
          bs + 'tooltip.js',
          bs + 'modal.js',
          bs + 'transition.js',
          bs + 'button.js',
          bs + 'popover.js',
          bs + 'carousel.js',
          bs + 'scrollspy.js',
          bs + 'collapse.js',
          bs + 'tab.js'
        ],
        searchPath: '.'
      });
    }

    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizedPath: 'scripts/main.js',
      sourceFileList: ['scripts/main.js'],
      searchPath: ['dev']
    });
  },

  app: function() {
    this.directory('dev');
    this.mkdir('dev/scripts');
    this.mkdir('dev/styles');
    this.mkdir('dev/images');
    this.write('dev/index.html', this.indexFile);

    if (this.coffee) {
      this.copy('main.coffee', 'dev/coffee/main.coffee');
    } else {
      this.copy('main.js', 'dev/scripts/main.js');
    }
  },

  install: function() {
    this.on('end', function() {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install'],
          'coffee': this.options.coffee
        }
      });

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
      }
    });
  }
});
