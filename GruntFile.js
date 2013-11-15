


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  nodewebkit: {
    options: {
        force_download : false,
        version: '0.8.0',
        build_dir: './webkitbuilds', // Where the build version of my node-webkit app is saved
        mac: true, // We want to build it for mac
        win: true, // We want to build it for win
        linux32: true, // We don't need linux32
        linux64: true // We don't need linux64
    },
    src: ['./**/*'] // Your node-wekit app
  },
})

// Load the plugin for nodewebkit build
grunt.loadNpmTasks('grunt-node-webkit-builder');


 // Default task(s).
grunt.registerTask('default', ['nodewebkit']);

};






