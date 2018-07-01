var express = require('express');
var router = express.Router();
var Plant = require('../../database/model/plantModel');
var Company = require('../../database/model/companyModel');
var User = require('../../database/model/userModel');
router.route('/').get(function(req, res) {
    Plant.findAll(function(err, docs) {
        if(err) {
            res.status(500).json({err: '网络错误'})
        } else {
            res.render('basic/plant', { pid: 1, subid: 13, breadcrumb: ['基础资料', '加盟商'], plant: docs });
        }
    })
}).post(function(req, res) {
    var formData = req.body;
    Plant.find({serial: formData.serial}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({code: 304, msg: '编码已存在'})
        } else {
            var plant = new Plant(formData);
            plant.save(function(err, doc) {
                Company.update({"_id": formData.company}, {
                    $push: {plant: doc._id}
                }, function(err, docs) {
                    res.status(200).json(doc);
                })
            });
        }
    })
});
router.route('/:name').get(function(req, res) {
    var id = req.query['id'];
    var name = req.params.name;
    console.log(name)
    if(name == 'add') {
        Company.find(null, 'name', function (err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(docs);
            }
        })
    } else if (name == 'mod' && id) {
        Plant.findOne({_id: id}, function(err, doc) {
            res.send(doc);
        })
    } else if(name == 'del' && id) {
        Plant.findOne({$and: [{_id: id}, {$or: [{shipper: {$ne: []}}, {user: {$ne: []}}, {quotation: {$ne: []}}]}]}, function(err, doc) {
            console.log(doc)
            if(err) {
                res.status(500).json({err: err.message});
            } else if(doc) {
                res.status(200).json({msg: '已使用不能删除'});
            } else {
                Plant.remove({_id: id}, function(err) {
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
        Plant.find({serial: formData.serial}, function(err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else if(docs.length > 0 && docs[0]._id != formData.id) {
                res.status(200).json({code: 304, msg: '编码已存在'})
            } else {
                Plant.update({_id: formData.id}, formData, function(err, doc) {
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
