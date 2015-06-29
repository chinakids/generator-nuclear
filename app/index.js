'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var osLocale = require('os-locale');
var chalk = require('chalk');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
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

  askFor: function () {
    var done = this.async(),
        _this = this;

    //choose os locale
    osLocale(function (err, locale) {
      //=> 'en_US'
      //ps.最终成型前只支持中文（简体）、中文（繁体）、英文（美式）
      if(locale == 'zh_CN' || locale == 'zh_Hans'){
        _this.locale = JSON.parse(fs.readFileSync(join(_this.sourceRoot(), '../language/'+locale+'.json')));
      }else if(locale == 'zh_Hant' || locale == 'zh_HK' || locale == 'zh_MO'){
        _this.locale = JSON.parse(fs.readFileSync(join(_this.sourceRoot(), '../language/zh_Hans.json')));
      }else{
        _this.locale = JSON.parse(fs.readFileSync(join(_this.sourceRoot(), '../language/en_US.json')));
      }
      // welcome message
      if (!_this.options['skip-welcome-message']) {
        _this.log(require('yosay')());
        _this.log(chalk.magenta(_this.locale.welcome));
      }

      var prompts = [{
          name: 'name',
          message: _this.locale.name,
          default: 'myproject'
        },{
          name: 'description',
          message: _this.locale.description,
          default: 'This is a nuclear package!'
        },{
          type: 'checkbox',
          name: 'features',
          message: _this.locale.features,
          choices: [{
            name: 'Bootstrap',
            value: 'includeLess',
            checked: false
          },{
            name: 'Less',
            value: 'includeLess',
            checked: true
          },{
            name: 'Modernizr',
            value: 'includeModernizr',
            checked: true
          }]
      }];

      _this.prompt(prompts, function (answers) {
        var features = answers.features;

        function hasFeature(feat) {
          return features && features.indexOf(feat) !== -1;
        }
        _this.appname = this._.slugify(answers.name);
        _this.description = answers.description;

        _this.includeLess = hasFeature('includeLess');
        _this.includeBootstrap = hasFeature('includeBootstrap');
        _this.includeModernizr = hasFeature('includeModernizr');

        //this.includeLibLess = answers.libless;

        done();
      }.bind(_this));
    });
  },

  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  packageJSON: function () {
    this.template('_package.json', 'package.json');
  },

  git: function () {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  bower: function () {
    var bower = {
      name: this._.slugify(this.appname),

      description: this.description,
      private: true,
      dependencies: {}
    };

    if (this.includeBootstrap) {
      var bs = 'bootstrap';
      bower.dependencies[bs] = '~3.2.0';
    } else {
      bower.dependencies.jquery = '~1.11.1';
      bower.dependencies['normalize.css'] = '~3.0.3';
    }

    if (this.includeModernizr) {
      bower.dependencies.modernizr = '~2.8.2';
    }

    this.copy('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  jshint: function () {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function () {
    this.copy('editorconfig', '.editorconfig');
  },

  mainStylesheet: function () {
    var css = 'main.' + (this.includeLess ? 'le' : 'c') + 'ss';
    this.template(css, 'app/'+(this.includeLess ? 'less' : 'style')+'/' + css);
  },

  writeIndex: function () {
    this.indexFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), 'index.html')),
      this
    );

    // wire Bootstrap plugins
    if (this.includeBootstrap && !this.includeLess) {
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
      searchPath: ['app', '.tmp']
    });
  },

  app: function () {
    this.directory('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);

    if (this.coffee) {
      this.copy('main.coffee', 'app/scripts/main.coffee');
    } else {
      this.copy('main.js', 'app/scripts/main.js');
    }
  },

  install: function () {
    this.on('end', function () {
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
