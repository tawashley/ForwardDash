module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    //Default Task
    grunt.registerTask('default', [
        'sass',
        'autoprefixer',
        'cssmin',
        'concat',
        'jshint',
        'uglify',
        'watch'
    ]);

    //@TODO
        //autoprefixer sass
        //compile sass from all widget folders into one file, minify

        //concat all js from widgets folder into one file, minify
        //add watch handlers for scss, js changes

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // usage '<%= config.foo %>'
        config: {

        },

        //=CSS related tasks
        sass: {
            options: {
                style: 'expanded',
                sourcemap: true
            },
            main: {
                files: {
                    '<%= config.css.dir %>/<%= config.css.fileName %>.css':'<%= config.sass.dir %>/<%= config.sass.fileName %>.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 9']
            },
            main: {
                expand: true,
                flatten: true,
                src: '<%= config.css.dir %>/<%= config.css.fileName %>.css',
                dest: '<%= config.css.dir %>'
            }
        },

        cssmin: {
            main: {
                expand: true,
                cwd: '<%= config.css.dir %>',
                src: '<%= config.css.fileName %>.css',
                dest: '<%= config.css.dir %>',
                ext: '.min.css'
            }
        },

        //=JS related tasks
        concat: {
            main: {
                src: [
                    '<%= config.js.concatDir %>/*.js'
                ],
                dest: '<%= config.js.rootDir %>/<%= config.js.fileName %>.js'
            }
        },

        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },
            main: '<%= config.js.rootDir %>/<%= config.js.fileName %>.js',
        },

        uglify: {
            options: {
                booleans: true,
                comparisons: true,
                conditionals: true,
                dead_code: true,
                drop_console: true,
                drop_debugger: true,
                join_vars: true,
                loops: true,
                mangle: false,
                unused: true
            },
            main: {
                src: '<%= config.js.rootDir %>/<%= config.js.fileName %>.js',
                dest: '<%= config.js.rootDir %>/<%= config.js.fileName %>.min.js'
            }
        },

        watch : {
            options: {
                livereload: true,
            },

            sass: {
                files: [
                    '*.scss', '<%= config.sass.dir %>/*.scss', '<%= config.sass.dir %>/*/*.scss'
                ],
                tasks: ['sass', 'autoprefixer', 'cssmin']
            },

            js: {
                files: [
                    '<%= config.js.concatDir %>/*.js'
                ],
                tasks: ['concat', 'jshint', 'uglify']
            }
        }
    });
};