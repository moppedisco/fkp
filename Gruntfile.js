module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'assets/css/main.css' : 'assets/sass/main.scss'
        }
      }
    },
    concat: {
      dist: {
        src: ['assets/js/vendor/jquery-1.11.3.min.js','assets/js/vendor/ScrollMagic.min.js','assets/js/vendor/lightgallery.js','assets/js/vendor/lightgallery-video.js','assets/js/vendor/TweenMax.min.js','assets/js/vendor/barba.js','assets/js/main.js'],
        dest: 'assets/build/index.js',
      },
    },
    autoprefixer: {
      options: {
        map: true
      },
      dist:{
        files:{
          'assets/css/main.css' : 'assets/css/main.css'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass','autoprefixer']
      },
      js: {
        files: 'assets/js/main.js',
        tasks:['concat']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
}
