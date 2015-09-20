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

    //coffee
    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    this.coffee = this.options.coffee;

    this.pkg = require('../package.json');
  }
});
