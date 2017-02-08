var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var secrets = require('../secrets');

router.post('/push', function(req, res, next) {
  var payload = JSON.stringify(req.body);

  var hash = crypto.createHmac("sha1", secrets.github_token).update(payload).digest("hex");

  if (req.headers["x-hub-signature"] === "sha1=" + hash){

    var spawn = require('child_process').spawn;
    var child = spawn('./pull.sh');

    child.stdout.on('data', (data) => {
      res.json({
        "hub-delivery": req.headers["x-github-delivery"],
        "hub-event": req.headers["x-github-event"],
        "response": 'data.toString()',

        "commit": req.body.after,
        "messages": req.body.commits
      })
    });

    return
  }

 res.status(403).json({"reponse": "forbidden"});
});

module.exports = router;
