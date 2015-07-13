/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'dev',
    dist: 'dist'
  };

  <% if (useTemplates) {%>
  //Get templates config
  var templatesConfig = grunt.file.readJSON('templatesConfig.json');
  <% } %>
  // Define the configuration for all the tasks
  grunt.initConfig({

      // Project settings
      config: config,

      // Watches files for changes and runs tasks based on the changed files
      watch: {
        bower: {
          files: ['bower.json'],
          tasks: ['wiredep']
        },
        <% if (coffee) { %>
        coffee: {
          files: [
            '<%%= config.app %>/scripts/{,*/}*.{coffee,litcoffee,coffee.md}'
          ],
          tasks: ['coffee:dist']
        },
        coffeeTest: {
          files: ['test/spec/{,*/}*.{coffee,litcoffee,coffee.md}'],
          tasks: ['coffee:test', 'test:watch']
        },
        <% } else { %>
        js: {
          files: ['<%%= config.app %>/scripts/{,*/}*.js'],
          tasks: ['jshint'],
          options: {
            livereload: '<%%= connect.options.livereload %>'
          }
        },
        jstest: {
          files: ['test/spec/{,*/}*.js'],
          tasks: ['test:watch']
        },
        <% } %>
        gruntfile: {
          files: ['Gruntfile.js']
        },
        <% if (includeLess) { %>
        less: {
          files: ['<%%= config.app %>/less/{,*/}*.{less}'],
          tasks: ['less:server', 'autoprefixer']
        },
        <% } %>
        <% if (includeSass) { %>
        sass: {
          files: ['<%%= config.app %>/scss/{,*/}*.{scss,sass}'],
          tasks: ['sass:server', 'autoprefixer']
        },
        <% } %>
        styles: {
          files: ['<%%= config.app %>/styles/{,*/}*.css'],
          tasks: ['newer:copy:styles', 'autoprefixer']
        },
        livereload: {
          options: {
            livereload: '<%%= connect.options.livereload %>'
          },
          files: [
            '<%%= config.app %>/{,*/}*.html',
            '<%%= config.app %>/styles/{,*/}*.css', <% if (coffee) { %>
            '<%%= config.app %>/scripts/{,*/}*.js', <% } %>
            '<%%= config.app %>/images/{,*/}*'
          ]
        }
      },

      // The actual grunt server settings
      connect: {
        options: {
          port: 9000,
          open: true,
          livereload: 35729,
          // Change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost'
        },
        livereload: {
          options: {
            middleware: function(connect) {
              return [
                connect().use('/bower_components', connect.static(
                  './bower_components')),
                connect.static(config.app)
              ];
            }
          }
        },
        test: {
          options: {
            open: false,
            port: 9001,
            middleware: function(connect) {
              return [
                connect.static('test'),
                connect().use('/bower_components', connect.static(
                  './bower_components')),
                connect.static(config.app)
              ];
            }
          }
        },
        dist: {
          options: {
            base: '<%%= config.dist %>',
            livereload: false
          }
        }
      },

      // Empties folders to start fresh
      clean: {
        dist: {
          files: [{
            dot: true,
            src: [
              '<%%= config.dist %>/*',
              '!<%%= config.dist %>/.git*'
            ]
          }]
        },
      },

      // Make sure code styles are up to par and there are no obvious mistakes
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        all: [
          'Gruntfile.js',
          '<%%= config.app %>/scripts/{,*/}*.js',
          '!<%%= config.app %>/scripts/vendor/*',
          'test/spec/{,*/}*.js'
        ]
      },

      <% if (testFramework === 'mocha') { %>
      // Mocha testing framework configuration options
      mocha: {
        all: {
          options: {
            run: true,
            urls: [
              'http://<%%= connect.test.options.hostname %>:<%%= connect.test.options.port %>/index.html'
            ]
          }
        }
      },

      <% } else if (testFramework === 'jasmine') { %>

      // Jasmine testing framework configuration options
      jasmine: {
        all: {
          options: {
            specs: 'test/spec/{,*/}*.js'
          }
        }
      },
      <% } %>

      <% if (coffee) { %>
      // Compiles CoffeeScript to JavaScript
      coffee: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%%= config.app %>/coffee',
            src: '{,*/}*.{coffee,litcoffee,coffee.md}',
            dest: '<%%= config.app %>/scripts',
            ext: '.js'
          }]
        },
        test: {
          files: [{
            expand: true,
            cwd: 'test/spec',
            src: '{,*/}*.{coffee,litcoffee,coffee.md}',
            dest: '<%%= config.test %>/spec',
            ext: '.js'
          }]
        }
      },
      <% } %>

      <% if (includeLess) { %>
      // Compiles less to CSS and generates necessary files if requested
      less: {
        options: {
          compress: true,
          sourceMap: true,
          yuicompress: false
        },
        dist: {
          files: [{
            expand: true,
            cwd: '<%= config.app %>/less',
            src: ['{,*/}*.less'],
            dest: '<%= config.app %>/styles',
            ext: '.min.css'
          }]
        },
        server: {
          files: [{
            expand: true,
            cwd: '<%= config.app %>/less',
            src: ['{,*/}*.less'],
            dest: '<%= config.app %>/styles',
            ext: '.min.css'
          }]
        }
      },
      <% } %>

      <% if (includeSass) { %>
      // Compiles Sass to CSS and generates necessary files if requested
      sass: {
        options: {
          <% if (includeLibSass) { %>
          sourceMap: true,
            includePaths: ['bower_components']
          <% } else { %>
          loadPath: 'bower_components'
          <% } %>
        },
        dist: {
          files: [{
            expand: true,
            cwd: '<%%= config.app %>/scss',
            src: ['*.{scss,sass}'],
            dest: '<%%= config.app %>/styles',
            ext: '.min.css'
          }]
        },
        server: {
          files: [{
            expand: true,
            cwd: '<%%= config.app %>/scss',
            src: ['*.{scss,sass}'],
            dest: '<%%= config.app %>/styles',
            ext: '.min.css'
          }]
        }
      },
      <% } %>

      // Add vendor prefixed styles
      autoprefixer: {
        options: {
          browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
        },
        dist: {
          files: [{
            expand: true,
            cwd: '<%%= config.dist %>/styles/',
            src: '{,*/}*.css',
            dest: '<%%= config.dist %>/styles/'
          }]
        }
      },

      // Automatically inject Bower components into the HTML file
      wiredep: {
        app: {
          ignorePath: /^<%= config.app %>\/|\.\.\//,
          src: ['<%%= config.app %>/index.html']
          <% if (includeBootstrap) { %>,
          <% if (includeSass) { %>
          exclude: [
            'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
          ]
          <% } else { %>
          exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
          <% } } %>
        }
        <% if (includeSass) { %>,
        sass: {
          src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
          ignorePath: /(\.\.\/){1,2}bower_components\//
        }
        <% } %>
      },

      // Renames files for browser caching purposes
      filerev: {
        dist: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '<%%= config.dist %>/images/{,*/}*.*',
            '<%%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%%= config.dist %>/*.{ico,png}'
          ]
        }
      },

      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files. Creates configurations in memory so
      // additional tasks can operate on them
      useminPrepare: {
        options: {
          dest: '<%%= config.dist %>'
        },
        html: '<%%= config.app %>/index.html'
      },

      // Performs rewrites based on rev and the useminPrepare configuration
      usemin: {
        options: {
          assetsDirs: [
            '<%%= config.dist %>',
            '<%%= config.dist %>/images',
            '<%%= config.dist %>/styles'
          ]
        },
        html: ['<%%= config.dist %>/{,*/}*.html'],
        css: ['<%%= config.dist %>/styles/{,*/}*.css']
      },

      // The following *-min tasks produce minified files in the dist folder
      imagemin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%%= config.app %>/images',
            src: '{,*/}*.{gif,jpeg,jpg,png}',
            dest: '<%%= config.dist %>/images'
          }]
        }
      },

      svgmin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%%= config.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%%= config.dist %>/images'
          }]
        }
      },

      htmlmin: {
        dist: {
          options: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeAttributeQuotes: true,
            removeCommentsFromCDATA: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            // true would impact styles with attribute selectors
            removeRedundantAttributes: false,
            useShortDoctype: true
          },
          files: [{
            expand: true,
            cwd: '<%%= config.dist %>',
            src: '{,*/}*.html',
            dest: '<%%= config.dist %>'
          }]
        }
      },

      <% if (useTemplates) { %>
      regexReplace: {
        default: {
          options: {
            //edit templatesConfig.json
            regex: templatesConfig
          },
          files: [{
            expand: true,
            cwd: '<%%= config.app %>/',
            src: '{,*/}*.html',
            dest: 'templates/',
            ext: '.html'
          }]
        }
      },
      <% } %>

      // By default, your `index.html`'s <!-- Usemin block --> will take care
      // of minification. These next options are pre-configured if you do not
      // wish to use the Usemin blocks.
      // cssmin: {
      //   dist: {
      //     files: {
      //       '<%%= config.dist %>/styles/main.css': [
      //         '.tmp/styles/{,*/}*.css',
      //         '<%%= config.app %>/styles/{,*/}*.css'
      //       ]
      //     }
      //   }
      // },
      // uglify: {
      //   dist: {
      //     files: {
      //       '<%%= config.dist %>/scripts/scripts.js': [
      //         '<%%= config.dist %>/scripts/scripts.js'
      //       ]
      //     }
      //   }
      // },
      // concat: {
      //   dist: {}
      // },

      // Copies remaining files to places other tasks can use
      copy: {
        dist: {
          files: [{
              expand: true,
              dot: true,
              cwd: '<%%= config.app %>',
              dest: '<%%= config.dist %>',
              src: [
                '*.{ico,png,txt}',
                'images/{,*/}*.webp',
                '{,*/}*.html',
                'styles/fonts/{,*/}*.*'
              ]
            }
            <% if (includeBootstrap) { %>, {
              expand: true,
              dot: true,
              cwd: '<% if (includeLess) { %> .
              <%
            } else {
              %>
              bower_components / bootstrap / dist <%
            } %>
              ',
              src: '<% if (includeLess) { %> bower_components / bootstrap /
                fonts
                /*<%
                            } else {
                              %>fonts/*<%
                            } %>',
                          dest: '<%%= config.dist %>'
                        }<% } %>]
                      }
                    },

                    <% if (includeModernizr) { %>
                    // Generates a custom Modernizr build that includes only the tests you
                    // reference in your app
                    modernizr: {
                      dist: {
                        devFile: 'bower_components/modernizr/modernizr.js',
                        outputFile: '<%%= config.dist %>/scripts/vendor/modernizr.js',
                        files: {
                          src: [
                            '<%%= config.dist %>/scripts/{,*/
            } * .js ',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '!<%%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },
    <% } %>

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [<% if (coffee) {  %>
        'coffee:dist'
        <% } %>
        <% if (coffee && !includeCss) {  %>, <% } %>
        <% if (includeLess) { %>
        'less:server'
        <% } %>
        <% if (includeSass) { %>
        'sass:server'
        <% } %>
      ],
      test: [<% if (coffee) { %>
        'coffee'
        <% } %>
      ],
      dist: [<% if (coffee) { %>
        'coffee', <% } %>
        <% if (includeLess) { %>
        'less', <% } %>
        <% if (includeSass) { %>
        'sass', <% } %>
        'imagemin',
        'svgmin'
      ]
    }
  });


grunt.registerTask('serve',
  'start the server and preview your app, --allow-remote for remote access',
  function(target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

grunt.registerTask('server', function(target) {
  grunt.log.warn(
    'The `server` task has been deprecated. Use `grunt serve` to start a server.'
  );
  grunt.task.run([target ? ('serve:' + target) : 'serve']);
});

grunt.registerTask('test', function(target) {
  if (target !== 'watch') {
    grunt.task.run([
      'concurrent:test',
      'autoprefixer'
    ]);
  }

  grunt.task.run([
    'connect:test', <% if (testFramework === 'mocha') { %>
    'mocha'
    <% } else if (testFramework === 'jasmine') { %>
    'jasmine'
    <% } %>
  ]);
});

grunt.registerTask('build', [
  'clean:dist',
  'wiredep',
  'useminPrepare',
  'concurrent:dist',
  'autoprefixer',
  'concat',
  'cssmin',
  'uglify',
  'copy:dist', <% if (includeModernizr) { %>
  'modernizr', <% } %>
  'filerev',
  'usemin', <% if (useTemplates) { %>
  'regexReplace', <% } %>
  'htmlmin'
]);

grunt.registerTask('default', [
  'newer:jshint',
  'test',
  'build'
]);
};
