var fs = require('fs');
var express = require('express');
var router = express.Router();
var config = require('../../config/config');
var Quotation = require('../../database/model/quotationModel');
var Plant = require('../../database/model/plantModel');
var Car = require('../../database/model/carModel');
var upload = require('../../utils/multerUtil')(config.quotationImgPath);
// 新增和列表
router.route('/').get(function (req, res) {
    var search = req.query.search;
    if (!search) {
        Quotation.findAll(function (err, docs) {
            if (err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/quotation', {pid: 1, subid: 15, breadcrumb: ['基础资料', '线路报价'], quotation: docs});
            }
        })
    } else {
        var reg = new RegExp(search, 'i')
        Quotation.findAll({$or: [{startCity: reg}, {endCity: reg}]}, function (err, docs) {
            if (err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/quotation', {pid: 1, subid: 15, breadcrumb: ['基础资料', '线路报价'], quotation: docs});
            }
        })
    }
}).post(upload.single('qheadimg'), function (req, res) {
    var formData = req.body;
    var file = req.file;
    if (!file) {
        res.status(200).json({code: 304, msg: '选择图片上传'})
    } else {
        var fileFormat = (file.originalname).split(".");
        var oldname = config.quotationImgPath + file.filename;
        var newname = config.quotationImgPath + formData.plant + "." + fileFormat[fileFormat.length - 1];
        fs.renameSync(oldname, newname);
        formData['headimg'] = config.url + '/uploads/quotation/' + formData.plant + "." + fileFormat[fileFormat.length - 1];
        // 编码重复不能直接新增
        var quotation = new Quotation(formData);
        quotation.save(function (err, doc) {
            if (err) {
                res.status(500).json({err: '网络错误'})
            } else {
                Plant.update({"_id": formData.plant}, {
                    $push: {quotation: doc._id}
                }, function (err, docs) {
                    res.status(200).json(doc);
                })
            }
        })
    }
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
        Quotation.findOne({_id: id}, function (err, doc) {
            res.send(doc);
        })
    } else if (name == 'del' && id) {
        Quotation.remove({_id: id}, function (err) {
            if (err) {
                res.status(500).json({err: err.message});
            } else {
                res.send({msg: 'del success'})
            }
        })
    } else if(name == 'car' && id) {
        Car.find({plant: id}, 'carNo', function(err, docs) {
            if (err) {
                res.status(500).json({err: err.message});
            } else {
                res.send(docs);
            }
        })
    }
}).post(upload.single('qheadimg'), function (req, res, next) {
    var opt = req.params.name;
    if (opt == 'mod') {
        var formData = req.body;
        console.log(formData)
        var file = req.file;
        if (file) {
            console.log(file)
            var fileFormat = (file.originalname).split(".");
            var oldname = config.quotationImgPath + file.filename;
            var newname = config.quotationImgPath + formData.plant + "." + fileFormat[fileFormat.length - 1];
            console.log(newname)
            fs.renameSync(oldname, newname);
            formData['headimg'] = config.url + '/uploads/quotation/' + formData.plant + "." + fileFormat[fileFormat.length - 1];
        }
        Quotation.update({_id: formData.id}, {$set: formData}, function (err, doc) {
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
