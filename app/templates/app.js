'use strict';

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    app     = express(),
    poet    = require('poet')(app),
    hbs;

app.use(poet.middleware());
app.use(express.static('public'));
app.use(app.router);
require('./routes')(app);

poet.set({
    postsPerPage: 10
})
.createPostRoute('/:post', 'post')
.init();


hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {}
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.configure('production', function () {
    app.use(express.errorHandler());
    app.enable('view cache');
});

app.listen(3000);