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
  }
});
