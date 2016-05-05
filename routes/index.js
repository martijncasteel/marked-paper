var express = require('express');
var router = express.Router();

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var json = JSON.parse(process.env.posts).slice(-2, 2);

  var posts = json.reverse().map(function(item){

    // include html for each
    item.content = fs.readFileSync('./.cache/' + item.file + '.html', 'utf8');
  });

  res.render('index', {
    posts: json
  });
});

router.get('/posts', function(req, res, next) {
  var posts = JSON.parse(process.env.posts);

  var previous = posts.filter(function(item) {
    return item.file == req.query.previous
  });

  if( posts.indexOf(previous[0]) < 1){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    return
  }

  var post = posts[ posts.indexOf(previous[0]) -1 ]

  res.render('_post', {
    post: post,
    content: fs.readFileSync('./.cache/' + post.file + '.html', 'utf8')
  });
});

router.get(/\/([a-z\-]+)\/?$/, function(req, res, next) {
  var post = JSON.parse(process.env.posts).filter(function(item) {
    return item.file == req.params[0]
  });

  if(post.length < 1) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    return
  }

  res.render('post', {
    post: post[0],
    content: fs.readFileSync('./.cache/' + post[0].file + '.html', 'utf8')
  });
});

module.exports = router;
