var express = require('express');
var router = express.Router();
var Company = require('../database/model/companyModel');
var Plant = require('../database/model/plantModel');
var User = require('../database/model/userModel');
var Shipper = require('../database/model/shipperModel');
router.route('/plant').get(function(req, res) {
    // 加盟商子公司下拉数据
    Company.find(null, 'name', function (err, docs) {
        console.log(docs)
        if(err) {
            res.status(500).json({err: err.message});
        } else {
            res.render('basicData/plant', {companys: docs});
        }
    })
}).post(function(req, res) {
    var formData = req.body;
    Plant.find({serial: formData.serial}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({msg: '编码不能重复'})
        } else {
            var plant = new Plant(formData);
            plant.save(function(err, docs) {
                res.status(200).json({msg: 'OK'});
            });
        }
    })
});
router.route('/company').get(function(req, res) {
    res.render('basicData/company')
}).post(function(req, res) {
    var formData = req.body;
    Company.find({serial: formData.serial}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({msg: '编码不能重复'})
        } else {
            var company = new Company(formData);
            company.save(function(err, docs) {
                res.status(200).json({msg: 'OK'});
            });

        }
    })
});
router.route('/users').get(function(req, res) {
    var level = req.query.level;
    if(level == 1) {
        Company.find(null, 'name', function(err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.status(200).json(docs);
            }
        })
    } else if(level == 2) {
        Plant.find(null, 'name', function(err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.status(200).json(docs);
            }
        })
    } else {
        res.render('basicData/user')
    }
}).post(function(req, res) {
    var formData = req.body;
    User.find({uid: formData.uid}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({msg: '帐号已存在'})
        } else {
            var user = new User(formData);
            if(formData.level == 1) {
                user.owner.company = formData.owner;
            } else if(formData.level == 2) {
                user.owner.plant = formData.owner;
            }
            user.save(function(err, docs) {
                res.status(200).json({msg: 'OK'});
            });
        }
    })
});

router.route('/shipper').get(function(req, res) {
    Plant.find(null, {name: 1}, function(err, docs) {
        console.log(docs)
        if(err) {
            res.status(500).json({err: err.message});
        } else {
            res.render('basicData/shipper', {plants: docs});
        }
    })
}).post(function (req, res) {
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
                res.status(200).json(docs);
            })
        }
    })
})
router.get('/test', function(req, res) {
    var q = req.query.q;
    User.findPlant(q, function(err, doc) {
        res.send(err ? err : doc);
    })
})
module.exports = router;