module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {
            posts: req.poet.getPosts(0, 10)
        });
    });

    app.get('/:post', function (req, res) {
        var post = req.poet.getPost(req.params.post);

        if (post) {
            res.render('post', { post: post });
        } else {
            res.send(404, 'Sorry cant find that!');
        }
    });

    app.get('*', function ( req, res ) {
        res.send(404, 'Sorry cant find that!');
    });
};