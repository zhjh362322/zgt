var express = require('express');
var router = express.Router();
var Car = require('../../database/model/carModel');
var Plant = require('../../database/model/plantModel');
// 新增和列表
router.route('/').get(function(req, res) {
    var search = req.query.search;
    if(!search) {
        Car.findAll(function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/car', { pid: 1, subid: 16, breadcrumb: ['基础资料', '车辆资源'], car: docs });
            }
        })
    } else {
        var reg = new RegExp(search, 'i')
        Car.findAll({$or: [{carNo: reg}, {driver: reg}]}, function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/car', { pid: 1, subid: 16, breadcrumb: ['基础资料', '车辆资源'], car: docs });
            }
        })
    }

}).post(function(req, res) {
    // 新增用户
    var formData = req.body;
    // 编码重复不能直接新增
    Car.find({$and: [{carNo: formData.carNo}, {plant: formData.plant}]}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({code: 304, msg: '车辆已存在'})
        } else {
            // 新增
            var car = new Car(formData);
            car.save(function(err, doc) {
                Plant.update({"_id": formData.plant}, {
                    $push: {car: doc._id}
                }, function (err, docs) {
                    res.status(200).json(doc);
                })
            });
        }
    })
});
router.route('/:name').get(function (req, res) {
    var id = req.query['id'];
    var name = req.params.name;
    if (name == 'add') {
        Plant.find(null, 'name', function (err, docs) {
            if (err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(docs);
            }
        })
    } else if (name == 'mod' && id) {
        Car.findOne({_id: id}, function (err, doc) {
            res.send(doc);
        })
    } else if (name == 'del' && id) {
        Car.remove({_id: id}, function (err) {
            if (err) {
                res.status(500).json({err: err.message});
            } else {
                res.send({msg: 'del success'})
            }
        })
    }
}).post(function (req, res, next) {
    var opt = req.params.name;
    var formData = req.body;
    if (opt == 'mod') {
        Car.update({_id: formData.id}, formData, function (err, doc) {
            if (err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(doc);
            }
        })
    } else {
        next();
    }
})
module.exports = router;
