var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res, next) {
    var name = req.params.name;
    if(name == 'headpic') {
        res.render('upload/headpic', {title: '上传'});
    } else {
        res.render('upload/swiper', {title: '上传'});
    }
});
router.get('/welcome', function(req, res, next) {
    res.render('welcome');
});
module.exports = router;
