/*global describe, beforeEach, it, after*/
'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    helpers = require('yeoman-generator').test,
    assert = require('assert');

describe('poet generator', function () {

    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('poet:app', [
                '../../app'
            ]);

            done();
        }.bind(this));
    });

    after(function (done) {
        fs.remove(path.join(__dirname, 'temp'), function () {
            done();
        });
    });

    it('creates expected files and parses wordpress export', function (done) {
        var expected = [
            'test/.jshintrc',
            'test/app.js',
            'test/routes.js',
            'test/package.json',
            'test/views/layouts/main.handlebars',
            'test/views/partials/footer.handlebars',
            'test/views/partials/nav.handlebars',
            'test/views/partials/post.handlebars',
            'test/views/index.handlebars',
            'test/views/post.handlebars',
            'test/_posts/test-post.md',
            'test/.jshintrc',
            'test/.travis.yml'
        ], app = this.app;

        helpers.mockPrompt(this.app, {
            'blogName': 'test',
            'parseWordpress': '../blog.xml'
        });

        app.run({}, function () {
            app.on('poet:processed', function () {
                helpers.assertFiles(expected);
                assert.equal(app.postCount, 3);
                assert.equal(app.attachmentCount, 2);
                assert.equal(app.pageCount, 2);

                done();
            });
        });
    });
});