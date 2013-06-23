'use strict';

var fs = require('fs'),
    url = require('url'),
    toMD = require('to-markdown').toMarkdown,
    clc = require('cli-color'),
    request = require('request'),
    warn = clc.yellow,
    notice = clc.blue;

function addMeta(post) {

    var categories = [];
    post.category.forEach(function (item) {
        categories.push(item._);
    });

    return '' +
    '{{{' +
        '"title" : "' + post.title[0] + '",' +
        '"link" : "' + url.parse(post.link[0]).path + '",' +
        '"category" : "' + categories[0] + '",' +
        '"id" : "' + post['wp:post_id'][0] + '",' +
        '"date" : "' + post['wp:post_date_gmt'][0] + '"' +
    '}}}';
}

function formatGists(content) {
    var patt = /\[gist[^\]]*\]/g,
        gists = content.match(patt),
        gistId;

    if (gists && gists.length > 0) {
        gists.forEach(function (gist) {
            gistId = gist.match(/\d+/)[0];
            content = content.replace('[gist id=' + gistId + ']', '<script src="https://gist.github.com/akshayp/' + gistId + '.js"></script>');
        });
    }

    return content;
}

function addPost(post, blogPath) {
    var slug = post['wp:post_name'][0],
        content = toMD(post['content:encoded'][0]),
        wpContent = /http:\/\/www.akshayp.com\/wp-content\/uploads\/\d+\/\d+\//g;

    content = content.replace(wpContent, '/img/upload/');
    content = formatGists(content);
    content = addMeta(post) + '\n' + content;

    fs.writeFile(blogPath + '/_posts/' + slug + '.md', content);
}

function fetchAttachment(attachment) {
    var link = attachment['wp:attachment_url'][0],
        path = url.parse(link).path.split('/'),
        filename = path[path.length - 1],
        localpath = 'public/img/upload/' + filename;

    fs.exists(localpath, function (exists) {
        if (!exists) {
            console.info(notice('Fetching ' + filename + ' and adding it to public/img/upload'));
            request(link).pipe(fs.createWriteStream(localpath));
        }
    });
}

function addPage(page, blogPath) {
    var content = page['content:encoded'][0],
        name = page['wp:post_name'][0],
        title = page.title[0],
        pageContent = '<div class="post">\n\n' +
                      '<h2><a href="/' + name + '/" title="' + title + '">' + title + '</a></h2>';

    if (content.length > 0) {
        content = formatGists(content);
        pageContent = pageContent + content + '\n\n</div>';

        fs.writeFile(blogPath + '/views/' + name + '.handlebars', pageContent);
    } else {
        console.log(warn(name + ' has no content. Skipping.'));
    }
}

module.exports = {
    addPage: addPage,
    addPost: addPost,
    fetchAttachment: fetchAttachment
};