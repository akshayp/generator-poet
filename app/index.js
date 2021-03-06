'use strict';

var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    clc = require('cli-color'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    parseutils = require('./utils.js'),
    notice = clc.blue;

var PoetGenerator = module.exports = function PoetGenerator() {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(PoetGenerator, yeoman.generators.Base);

PoetGenerator.prototype.askFor = function askFor() {
    var cb = this.async(),
        prompts;

    console.log(this.yeoman);

    prompts = [{
        'name': 'blogName',
        'message': 'What do you want to call your blog?'
    }, {
        'name': 'parseWordpress',
        'message': 'If you would like to parse a wordpress export enter the file path',
        'default': false
    }, {
        'name': 'githubUser',
        'message': 'Github user id to format gists',
        'default': ''
    }, {
        'name': 'oldBlogDomain',
        'message': 'Domain for your old blog',
        'default': ''
    }];

    this.prompt(prompts, function (props) {
        this.blogName = props.blogName;
        this.parseWordpress = props.parseWordpress;
        this.githubUser = props.githubUser;
        this.oldBlogDomain = props.oldBlogDomain;
        cb();
    }.bind(this));
};

PoetGenerator.prototype.app = function app() {
    var blog = this.blogName,
        parseWordpress = this.parseWordpress,
        githubUser = this.githubUser,
        oldDomain = this.oldBlogDomain,
        self = this;

    console.log(notice('\u2708 Bootstrapping Blog'));

    this.mkdir(blog);
    this.mkdir(blog + '/_posts');
    this.mkdir(blog + '/public/css');
    this.mkdir(blog + '/public/js');
    this.mkdir(blog + '/public/img');
    this.mkdir(blog + '/public/img/upload');
    this.mkdir(blog + '/views/layouts');
    this.mkdir(blog + '/views/partials');

    if (parseWordpress && fs.existsSync(parseWordpress)) {

        fs.readFile(parseWordpress, function (err, data) {
            console.log(notice('\u2708 Parsing Wordpress Export'));

            parser.parseString(data, function (err, result) {
                var data = result.rss.channel[0],
                    items = data.item,
                    type, postCount = 0, attachmentCount = 0, pageCount = 0;

                items.forEach(function (item) {
                    type = item['wp:post_type'][0];

                    if (type === 'attachment') {
                        parseutils.fetchAttachment(item, blog);
                        attachmentCount++;
                    } else if (type === 'page') {
                        parseutils.addPage(item, blog);
                        pageCount++;
                    } else if (type === 'post') {
                        parseutils.addPost(item, blog, githubUser, oldDomain);
                        postCount++;
                    }
                });

                //Expose for tests
                self.postCount = postCount;
                self.attachmentCount = attachmentCount;
                self.pageCount = pageCount;

                self.emit('poet:processed');

                self.log.ok(postCount + ' posts parsed and added to _posts');
                self.log.ok(attachmentCount + ' attachments processed');
                self.log.ok(pageCount + ' pages processed and added to views');
            });
        });
    }

    this.copy('app.js', blog + '/app.js');
    this.copy('routes.js', blog + '/routes.js');
    this.copy('_package.json', blog + '/package.json');
    this.copy('main.handlebars', blog + '/views/layouts/main.handlebars');
    this.copy('footer.handlebars', blog + '/views/partials/footer.handlebars');
    this.copy('nav.handlebars', blog + '/views/partials/nav.handlebars');
    this.copy('post.handlebars', blog + '/views/partials/post.handlebars');
    this.copy('index.handlebars', blog + '/views/index.handlebars');
    this.copy('single_post.handlebars', blog + '/views/post.handlebars');
    this.copy('test-post.md', blog + '/_posts/test-post.md');
};

PoetGenerator.prototype.projectfiles = function projectfiles() {
    var blog = this.blogName;

    this.copy('jshintrc', blog + '/.jshintrc');
    this.copy('travis.yml', blog + '/.travis.yml');
};