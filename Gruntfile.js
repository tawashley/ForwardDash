module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    //Default Task
    grunt.registerTask('default', [
    	'todo',
        'sass',
        'autoprefixer',
        'cssmin',
        'jshint',
        'concat',
        'uglify',
        'connect:livereload',
        'watch'
    ]);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Configuration
        config: {
        	dashboard: 'dashboard',
        	docs: 'docs',
        	css: {
        		dir: 'styles',
        		outputFileName: 'main'
        	},
        	sass: {
        		dir: 'sass',
        		inputFileName: 'forward_dash'
        	},
        	js: {
        		concatDir: 'modules',
        		dir: 'scripts',
        		outputFileName: 'main'
        	}
        },

        // Watchers
        watch: {
            sass: {
                files: [
                	'<%= config.dashboard %>/<%= config.css.dir %>/<%= config.sass.dir %>/**/*.scss'
                ],
                tasks: [
                	'sass:main',
                	'autoprefixer:main',
                	'cssmin:main'
                ]
            },
            js: {
                files: [
                    '<%= config.dashboard %>/<%= config.js.dir %>/<%= config.js.concatDir %>/**/*.js'
                ],
                tasks: [
                	'concat:main',
                	'jshint:main',
                	'uglify:main'
            	]
            },
            gruntfile: {
            	files: [
            		'Gruntfile.js'
            	],
            	tasks: [
            		'jshint:gruntfile'
            	]
            },
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'dashboard/{,*/}*.{js,css}'
				]
			}
        },

		// Local server
        connect: {
			options: {
				port: 8080,
				livereload: 35730,
				useAvailablePort: true,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: '.'
				}
			}
		},


		// Project tasks
		todo: {
			options: {
				colophon: true,
				file: 'TODO.md',
				marks: [{
		          	name: 'todo',
		          	pattern: /@(todo)/i,
		          	color: 'blue'
	        	}],
      			title: '[<%= pkg.title%> TODO list:](<%= pkg.homepage %>)',
  				usePackage: true
			},
			main: [
				'<%= config.dashboard %>/**/*.{html,js,scss}',
				'<%= config.docs %>/**/*.{html,js,scss}',
				'Gruntfile.js'
			]
		},


		// Style tasks
        sass: {
            options: {
                style: 'expanded',
                sourcemap: true
            },
            main: {
                files: {
                    '<%= config.dashboard %>/<%= config.css.dir %>/<%= config.css.outputFileName %>.css': '<%= config.dashboard %>/<%= config.css.dir %>/<%= config.sass.dir %>/<%= config.sass.inputFileName %>.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                	'last 2 version', 'ie 9'
            	]
            },
            main: {
                expand: true,
                flatten: true,
                src: '<%= config.dashboard %>/<%= config.css.dir %>/<%= config.css.outputFileName %>.css',
                dest: '<%= config.dashboard %>/<%= config.css.dir %>'
            }
        },

        cssmin: {
            main: {
                expand: true,
                cwd: '<%= config.dashboard %>/<%= config.css.dir %>',
                src: '<%= config.css.outputFileName %>.css',
                dest: '<%= config.dashboard %>/<%= config.css.dir %>',
                ext: '.min.css'
            }
        },


        // Script tasks
        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },
            main: '<%= config.dashboard %>/<%= config.js.dir %>/<%= config.js.concatDir %>/*.js',
            gruntfile: 'Gruntfile.js'
        },

        concat: {
            main: {
                src: [
                    '<%= config.dashboard %>/<%= config.js.dir %>/<%= config.js.concatDir %>/*.js'
                ],
                dest: '<%= config.dashboard %>/<%= config.js.dir %>/<%= config.js.outputFileName %>.js'
            }
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
                src: '<%= config.dashboard %>/<%= config.js.dir %>/<%= config.js.outputFileName %>.js',
                dest: '<%= config.dashboard %>/<%= config.js.dir %>/<%= config.js.outputFileName %>.min.js'
            }
        }
    });
};
