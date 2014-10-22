module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['specs/server/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src: '',
        dest: ''
      }
    },

    jshint: {
      files: [
        'server.js',
        'server/**/*.js',
        'specs/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'lib/*.js',
          'server/modules/faceRecognition/lib/**/*.js'
        ]
      }
    },

    cssmin: {
      build: {
        src: 'client/style.css',
        dest: 'client/dist/style-min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'server.js',
          'server/**/*.js',
          'client/*.js'
        ],
        tasks: [
          'test'
        ]
      },
      css: {
        files: 'client/*.css',
        tasks: ['cssmin']
      }
    },
    concat: {   
      libs: {
        src: ['client/lib/underscore.js', 'client/lib/jquery.js', 'bootstrap.mim.css'],
        dest: 'client/dist/client-libs.js'
      }
    },

    shell: {
      options: {
        stderr: false
      },
      upToProdServer: {
        command: 'git push azure master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('deploy', function(){
    grunt.task.requires('build');
    grunt.task.run(['shell:upToProdServer']);
    // add your deploy tasks here
  });
 
  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['deploy']);

    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('all', ['build', 'upload']);

};
