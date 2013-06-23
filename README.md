# Generator-poet
[![Build Status](https://travis-ci.org/akshayp/generator-poet.png?branch=master)](https://travis-ci.org/akshayp/generator-poet) [![Coverage Status](https://coveralls.io/repos/akshayp/generator-poet/badge.png)](https://coveralls.io/r/akshayp/generator-poet) ![Dependency Status](https://david-dm.org/akshayp/generator-poet.png)

A generator for Yeoman to bootstrap a blog powered by [Poet](http://jsantell.github.io/poet/). In addition to setting up the basic directories needed it also lets you import a wordpress export file and parse it into markdown files that can then be used to view your old posts powered by Poet.

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-poet`
- Run: `yo poet`

## Importing an existing wordpress blog
- Export your blog to an xml file using these [instructions](http://en.support.wordpress.com/export/#export-your-content-to-another-blog-or-platform)
- Install yeoman and the poet generator`npm install -g yo generator-poet`
- Run: `yo poet`
- Select your blog name
- Type out the file path where your wordpress backup is located
- `cd yourblogname; npm install; node app`
- Point your browser to `http://localhost:3000`
- Profit

## Known Issues
- Lack of autocomplete while picking a file path for the wordpress export

## Future Enhancements
- Bootstrap barebones CSS using [Pure CSS](http://purecss.io/)
- Use HTML5 boilerplate as a starter template

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
