var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../database/model/userModel');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/', function(req, res) {
  var formData = req.body;
  var password = req.body.password;
  var md5 = crypto.createHash('md5');
  var newPwd = md5.update(password).digest('hex');
  formData.password = newPwd;
  var user = new User(formData);

  user.save(function(err, doc) {
    if(err) {
      res.send({code: 500});
    } else {
      res.send(doc);
    }
  });
});
module.exports = router;
