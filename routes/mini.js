var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Plant = require('../database/model/plantModel');
var User = require('../database/model/userModel');
var Quotation = require('../database/model/quotationModel');
var Consignment = require('../database/model/consignmentModel');
var Shipper = require('../database/model/shipperModel');
var Company = require('../database/model/companyModel');
// 此路由只接受小程序请求，其他请求返回404
var err = new Error('Not Found');
err.status = 404;

router.post('/login', function(req, res, next) {
    var data = req.body;
    var md5 = crypto.createHash('md5');
    var newPwd = md5.update(data.password).digest('hex');
    if(data.from === 'mini') {
        User.findByUid(data.uid, function(err, doc) {
            if(err) {
                res.status(500).json({code: -1, msg: '网络出错'})
            } else if(!doc) {
                res.status(200).json({code: 0, msg: '帐号不存在'});
            } else if(doc.status == 2) {
                res.status(200).json({code: 0, msg: '请等待审核'});
            } else if(doc.status == 0) {
                res.status(200).json({code: 0, msg: '账号已停用'});
            } else if(doc.password == newPwd) {
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
                res.status(200).json({code: 0, msg: '密码错误'});
            }
        });
    } else {
        next(err);
    }
})
router.get('/quotation', function(req, res, next) {
    var q = req.query;

    if(q.from === 'mini') {
        var condition = {};
        if(q["startCity"]) {
            var startCity = new RegExp(q.startCity)
            condition.startCity = startCity;
        }
        if(q["endCity"]) {
            var endCity = new RegExp(q.endCity)
            condition.endCity = endCity;
        }
        Quotation.findAll(condition, function(err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(docs)
            }
        })
    } else {
        res.send({msg: '参数错误'});
    }
})

router.route('/consignment').get(function(req, res, next) {
    var q = req.query;
    if(q.from === 'mini') {
        var uid = q.uid;
        Consignment.findAllOrder(uid, function(err, docs) {
            res.send(docs);
        })
    } else {
        next(err);
    }
}).post(function(req, res, next) {
    var data = req.body;
    if(data.from === 'mini') {
        var consignment = new Consignment(data);
        consignment.save(function(err, doc) {
            if(err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({code: 1})
            }
        })
    } else {
        next(err);
    }
})

router.route('/shipper').get(function(req, res) {
    Shipper.findAll(function(err, docs) {
        if(err) {
            res.status(500).json({err: '网络错误'})
        } else {
            res.status(200).json(docs);
        }
    })
}).post(function(req, res) {
    var formData = req.body;
    var shipper = new Shipper(formData);
    shipper.save(function(err, doc) {
        if(err) {
            res.status(500).json(err);
        } else {
            // 把客户和加盟商关联
            Plant.update({"_id": formData.plant}, {
                $push: {shipper: doc._id}
            }, function(err, docs) {
                res.status(200).json(doc);
            })
        }
    })
});

router.get('/company', function(req, res) {
    Company.find(null, 'name', function(err, docs) {
        if(err) {
            res.status(500).json({err: '网络错误'})
        } else {
            res.status(200).json(docs);
        }
    })
})

router.post('/plant', function(req, res) {
    var formData = req.body;
    formData.serial = formData.cellphone;

    Plant.find({$or: [{serial: formData.serial}, {cellphone: formData.cellphone}]}, function (err, docs) {
        if (err) {
            res.status(500).json({err: err.message});
        } else if (docs.length > 0) {
            res.status(200).json({code: 304, msg: '用户已存在'})
        } else {
            var plant = new Plant(formData);
            plant.save(function (err, doc) {
                Company.update({"_id": formData.company}, {
                    $push: {plant: doc._id}
                }, function (err, docs) {
                    res.status(200).json(doc);
                })
            });
        }
    })
})

// router.get('/test', function(req, res, next) {
//     Consignment.findAllOrder(function(err, docs) {
//         res.send(docs)
//     })
// })
module.exports = router;

// {
//     from: 'mini',
//     uid: '15077777777',
//     password: '123'
// }

// Consignment.findAllOrder(data.uid, function(err, docs) {
//     res.send(docs);
// })