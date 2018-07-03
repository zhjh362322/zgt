var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../database/model/userModel');
/* GET users listing. */
router.route('/login').get(function (req, res) {
    res.redirect('index');
}).post(function (req, res) {
    var formData = req.body;
    var password = req.body.password;
    var md5 = crypto.createHash('md5');
    var newPwd = md5.update(password).digest('hex');
    User.findOne({uid: formData.uid, password: newPwd, status: 1}, function (err, doc) {
        if(doc) {
            req.session.user = doc;
            res.send(200)
            // ajax提交不能render出来，action可以
            // res.render('welcome', {user: doc});
        } else {
            res.send('错误')
        }
    })
});
router.get('/logout', function(req, res) {
    delete req.session.user;
    res.redirect('/');
})
module.exports = router;
