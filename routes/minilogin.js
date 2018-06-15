var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Plant = require('../database/model/plantModel');
var User = require('../database/model/userModel');

// 此路由只接受小程序请求，其他请求返回404
var err = new Error('Not Found');
err.status = 404;

router.post('/', function(req, res, next) {
    var data = req.body;
    var md5 = crypto.createHash('md5');
    var newPwd = md5.update(data.password).digest('hex');
    if(data.from === 'mini') {
        User.findByUid(data.uid, function(err, doc) {
            if(err) {
                res.status(500).json({code: -1, msg: '网络出错'})
            } else if(doc && doc.password == newPwd && doc.status == 1) {
                // 1 子公司； 2 加盟商； 0 管理员
                if(doc.level == 1) {
                    User.findCompany(doc._id, function(err, rst) {
                        res.status(200).json(rst);
                    })
                } else if(doc.level == 2) {
                    User.findPlant(doc._id, function(err, rst) {
                        res.status(200).json(rst);
                    })
                } else {
                    doc.password = '';
                    res.status(200).json(doc);
                }
            } else {
                res.status(200).json({code: 0, msg: '帐号密码不正确'});
            }
        });
    } else {
        next(err);
    }
})

module.exports = router;

// {
//     from: 'mini',
//     uid: '15077777777',
//     password: '123'
// }