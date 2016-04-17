var express = require('express');
var router = express.Router();

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var json = JSON.parse(process.env.posts).slice(-3, 3);

  var posts = json.reverse().map(function(item){

    // include html for each
    item.content = fs.readFileSync('./.cache/' + item.file, 'utf8');
  });

  res.render('index', {
    posts: json
  });
});

router.get(/\/([a-z\-]+).html/, function(req, res, next) {

  var post = JSON.parse(process.env.posts).filter(function(item) {
    return item.file == req.params[0] + '.html'
  });

  if(post.length < 1) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    return
  }

  res.render('post', {
    post: post[0],
    content: fs.readFileSync('./.cache/' + post[0].file, 'utf8')
  });
});

module.exports = router;
