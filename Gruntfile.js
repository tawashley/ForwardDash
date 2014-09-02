module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    //Default Task
    grunt.registerTask('default', [
    	'todo',
        'sass',
        'autoprefixer',
        //'cssmin',
        //'concat',
        //'jshint',
        //'uglify',
        'connect:livereload',
        'watch'
    ]);

   	//@TODO: CSSMin
   	//@TODO: JSHint
   	//@TODO: Uglify
   	//@TODO: Add watch handlers for js changes

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
        	}
        },

        // Watchers
        watch: {
            sass: {
                files: [
                	'<%= config.dashboard %>/<%= config.css.dir %>/<%= config.sass.dir %>/**/*.scss'
                ],
                tasks: [
                	'sass',
                	'autoprefixer'/*,
                	'cssmin'*/
                ]
            },
            // js: {
            //     files: [
            //         '<%= config.js.concatDir %>/*.js'
            //     ],
            //     tasks: ['concat', 'jshint', 'uglify']
            // },
            // gruntfile: {
            // 	files: [
            // 		'Gruntfile.js'
            // 	],
            // 	tasks: [
            // 		'jshint:gruntfile'
            // 	]
            // },
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

        // cssmin: {
        //     main: {
        //         expand: true,
        //         cwd: '<%= config.css.dir %>',
        //         src: '<%= config.css.fileName %>.css',
        //         dest: '<%= config.css.dir %>',
        //         ext: '.min.css'
        //     }
        // },


        // Script tasks
        // concat: {
        //     main: {
        //         src: [
        //             '<%= config.js.concatDir %>/*.js'
        //         ],
        //         dest: '<%= config.js.rootDir %>/<%= config.js.fileName %>.js'
        //     }
        // },

        // jshint: {
        //     options: {
        //         jshintrc: true,
        //         reporter: require('jshint-stylish')
        //     },
        //     main: '<%= config.js.rootDir %>/<%= config.js.fileName %>.js',
        // },

        // uglify: {
        //     options: {
        //         booleans: true,
        //         comparisons: true,
        //         conditionals: true,
        //         dead_code: true,
        //         drop_console: true,
        //         drop_debugger: true,
        //         join_vars: true,
        //         loops: true,
        //         mangle: false,
        //         unused: true
        //     },
        //     main: {
        //         src: '<%= config.js.rootDir %>/<%= config.js.fileName %>.js',
        //         dest: '<%= config.js.rootDir %>/<%= config.js.fileName %>.min.js'
        //     }
        // }
    });
};
