var express = require('express');
var router = express.Router();
var Shipper = require('../../database/model/shipperModel');
var Plant = require('../../database/model/plantModel');
var Consignment = require('../../database/model/consignmentModel');
router.route('/').get(function(req, res) {
    var search = req.query.search;
    if(!search) {
        Shipper.findAll(function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/shipper', { pid: 1, subid: 14, breadcrumb: ['基础资料', '客户信息'], shipper: docs });
            }
        })
    } else {
        var reg = new RegExp(search, 'i')
        Shipper.findAll({$or: [{companyName: reg}, {cellphone: reg}]}, function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/shipper', { pid: 1, subid: 14, breadcrumb: ['基础资料', '客户信息'], shipper: docs });
            }
        })
    }
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

router.route('/:name').get(function(req, res) {
    var id = req.query['id'];
    var name = req.params.name;
    if(name == 'add') {
        Plant.find(null, 'name', function (err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(docs);
            }
        })
    } else if (name == 'mod' && id) {
        Shipper.findOne({_id: id}, function(err, doc) {
            res.send(doc);
        })
    } else if(name == 'del' && id) {
        Consignment.findOne({$or: [{ consigner: id}, {consignee: id}]}, function(err, doc) {
            if(err) {
                res.status(500).json({err: err.message});
            } else if(doc) {
                res.status(200).json({msg: '已使用不能删除'});
            } else {
                Shipper.remove({_id: id}, function(err) {
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
        Shipper.update({_id: formData.id}, formData, function(err, doc) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(doc);
            }
        })
    }
})
module.exports = router;
