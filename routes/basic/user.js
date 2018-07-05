var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../../database/model/userModel');
var Company = require('../../database/model/companyModel');
var Plant = require('../../database/model/plantModel');
var Consignment = require('../../database/model/consignmentModel');
router.route('/').get(function(req, res, next) {
    var search = req.query.search;
    if(!search) {
        User.findAll(function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/user', { pid: 1, subid: 11, breadcrumb: ['基础资料', '用户列表'], users: docs });
            }
        })
    } else {
        var reg = new RegExp(search, 'i')
        User.findAll({$or: [{uid: reg}, {name: reg}]}, function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/user', { pid: 1, subid: 11, breadcrumb: ['基础资料', '用户列表'], users: docs });
            }
        })
    }
}).post(function(req, res) {
    var formData = req.body;
    User.find({uid: formData.uid}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({msg: '帐号已存在'})
        } else {
            var md5 = crypto.createHash('md5');
            var pwd = formData.password ? formData.password : '';
            var newPwd = md5.update(pwd).digest('hex');
            formData.password = newPwd;
            var user = new User(formData);
            if(formData.level == 1) {
                user.owner.company = formData.owner;
                user.save(function(err, doc) {
                    Company.update({"_id": formData.owner}, {
                        $push: {user: doc._id}
                    }, function(err, docs) {
                        res.status(200).json(doc);
                    })
                });
            } else if(formData.level == 2) {
                user.owner.plant = formData.owner;
                user.save(function(err, doc) {
                    Plant.update({"_id": formData.owner}, {
                        $push: {user: doc._id}
                    }, function(err, docs) {
                        res.status(200).json(doc);
                    })
                });
            } else {
                user.save(function(err, doc) {
                    if(err) {
                        res.status(500).json({err: err.message});
                    } else {
                        res.status(200).json(doc);
                    }
                })
            }
        }
    })
});
router.route('/:name').get(function(req, res) {
    var id = req.query['id'];
    var name = req.params.name;
    if(name == 'add') {
        var level = req.query.level;
        if(level == 1) {
            Company.find(null, 'name', function(err, docs) {
                if(err) {
                    res.status(500).json({err: err.message});
                } else {
                    res.status(200).json(docs);
                }
            })
        } else {
            Plant.find(null, 'name', function(err, docs) {
                if(err) {
                    res.status(500).json({err: err.message});
                } else {
                    res.status(200).json(docs);
                }
            })
        }
    } else if (name == 'mod' && id) {
        User.findOne({_id: id}, function(err, doc) {
            res.send(doc);
        })
    } else if(name == 'del' && id) {
        Consignment.findOne({uid: id}, function(err, doc) {
            if(err) {
                res.status(500).json({err: err.message});
            } else if(doc) {
                res.status(200).json({msg: '已使用不能删除'});
            } else {
                User.remove({_id: id}, function(err) {
                    if(err) {
                        res.status(500).json({err: err.message});
                    } else {
                        res.send({msg: 'del success'})
                    }
                })
            }
        })
    }
}).post(function(req, res) {
    var opt = req.params.name;
    var formData = req.body;
    if(opt == 'mod') {
        User.find({uid: formData.uid}, function(err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else if(docs.length > 0 && docs[0]._id != formData.id) {
                res.status(200).json({code: 304, msg: '编码已存在'});
            } else {
                var md5 = crypto.createHash('md5');
                var pwd = formData.password ? formData.password : '';
                var newPwd = md5.update(pwd).digest('hex');
                formData.password = newPwd;
                User.update({_id: formData.id}, formData, function(err, doc) {
                    if(err) {
                        res.status(500).json({err: err.message});
                    } else {
                        res.send(doc);
                    }
                })
            }
        })
    }
})
module.exports = router;
