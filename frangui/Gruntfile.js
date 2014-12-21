module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: 'dist/bower.js'
      }
    },
  });
}

grunt.loadNpmTasks('grunt-bower-concat');

