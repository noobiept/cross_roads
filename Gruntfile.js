const Fs = require('fs');
const Path = require('path');

const PACKAGE = JSON.parse(Fs.readFileSync("package.json", "utf8"));
const ROOT = "./";
const DEST = `./release/${PACKAGE.name} ${PACKAGE.version}/`;

module.exports = function( grunt )
{
grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

            // delete the destination folder
        clean: {
            release: [
                DEST, Path.join(ROOT, "scripts/**/*.js")
            ],
            libraries: [
                Path.join(ROOT, "libraries/*.js")
            ]
        },

            // copy the necessary files
        copy: {
            libraries: {
                files: [
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/easeljs/lib/"),
                        src: "easeljs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/preloadjs/lib/"),
                        src: "preloadjs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/soundjs/lib/"),
                        src: "soundjs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/tweenjs/lib/"),
                        src: "tweenjs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                ],
            },
            release: {
                expand: true,
                cwd: ROOT,
                src: [
                    'images/**',
                    'levels/**',
                    'libraries/**',
                    'music/**',
                    'index.html',
                    'package.json'
                ],
                dest: DEST
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: ROOT + 'css',
                    src: '*.css',
                    dest: DEST + 'css/'
                }]
            }
        },
    });


    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );

    // tasks
grunt.registerTask( 'update_libraries', [
    "clean:libraries",
    "copy:libraries"
]);
grunt.registerTask( 'default', [ 'clean', 'copy:libraries', 'copy:release', 'cssmin' ] );
};
