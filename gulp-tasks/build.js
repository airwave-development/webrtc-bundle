var gulp = require('gulp');

var fs = require('fs');
var concat = require('gulp-concat');
var browserify = require('browserify');
var runSequence = require('run-sequence');
/* jshint ignore:start */


gulp.task('build', function(callback) {
    runSequence([
        'build:hark',
        'build:adapter',
        'build:getusermedia',
        'build:rtcpeerconnection'
    ], 'build:concat-webrtcbundles', callback);
});

gulp.task('build:hark', function() {
    return browserify({
            standalone: 'hark'
        })
        .require('hark')
        .bundle()
        .pipe(fs.createWriteStream('./src/hark.bundle.js'));
});

gulp.task('build:adapter', function() {
    return browserify()
        .require('webrtc-adapter')
        .bundle()
        .pipe(fs.createWriteStream('./src/adapter.bundle.js'));
});

gulp.task('build:getusermedia', function() {
    return browserify({
            standalone: 'getUserMedia'
        })
        .add('./src/getusermedia')
        .external('webrtc-adapter')
        .bundle()
        .pipe(fs.createWriteStream('./src/getusermedia.bundle.js'));
});

gulp.task('build:rtcpeerconnection', function() {
    return browserify({
            standalone: 'PeerConnection'
        })
        .add('./src/rtcpeerconnection')
        .external('webrtc-adapter')
        .bundle().pipe(fs.createWriteStream('./src/rtcpeerconnection.bundle.js'));
});

gulp.task('build:concat-webrtcbundles', function() {
    return gulp.src([
        './src/hark.bundle.js',
        './src/adapter.bundle.js',
        './src/getusermedia.bundle.js',
        './src/rtcpeerconnection.bundle.js'
    ]).pipe(concat('webrtc-bundle.js')).pipe(gulp.dest('./dist/'));
});

/* jshint ignore:end */
