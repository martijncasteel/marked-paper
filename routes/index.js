var express = require('express');
var router = express.Router();

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir('./cache', function(err, items) {

    res.render('index', {
      posts: items.filter(function(item){

        // only html files
        return item.indexOf('.html')>=0
      }).map(function(item){

        //append path to each
        return '../cache/' + item
      })
    });

  });
});

module.exports = router;
