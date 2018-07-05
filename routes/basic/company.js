var express = require('express');
var router = express.Router();
var Company = require('../../database/model/companyModel');
var Plant = require('../../database/model/plantModel');
var User = require('../../database/model/userModel');
// 新增和列表
router.route('/').get(function(req, res) {
    var search = req.query.search;
    if(!search) {
        Company.find(function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/company', { pid: 1, subid: 12, breadcrumb: ['基础资料', '子公司'], company: docs });
            }
        })
    } else {
        var reg = new RegExp(search, 'i')
        Company.find({$or: [{_id: reg}, {endCity: reg}]}, function(err, docs) {
            if(err) {
                res.status(500).json({err: '网络错误'})
            } else {
                res.render('basic/company', { pid: 1, subid: 12, breadcrumb: ['基础资料', '子公司'], company: docs });
            }
        })
    }

}).post(function(req, res) {
    // 新增用户
    var formData = req.body;
    // 编码重复不能直接新增
    Company.find({serial: formData.serial}, function(err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else if(docs.length > 0) {
            res.status(200).json({code: 304, msg: '编码已存在'})
        } else {
            // 新增
            var company = new Company(formData);
            company.save(function(err, doc) {
                var rst = docs.push(doc);
                res.send(doc)
            });
        }
    })
});
// 删除和修改功能
router.route('/:name').get(function(req, res) {
    var opt = req.params.name;
    var id = req.query['id'];

    if(opt == 'del' && id) {
        // 删除
        Company.findOne({$and:[{_id: id}, {$or:[{plant: {$ne: []}}, {user: {$ne: []}}]}]}, function(err, doc) {
            if(err) {
                res.status(500).json({err: err.message});
            } else if(doc) {
                res.status(200).json({msg: '已使用不能删除'});
            } else {
                Company.remove({_id: id}, function(err) {
                    if(err) {
                        res.status(500).json({err: err.message});
                    } else {
                        res.send({msg: 'del success'})
                    }
                })
            }
        })
    } else if(opt == 'mod' && id) {
        // 修改 ，返回当前列的数据到表单
        // js中不好取得当前列数据，以后不用render渲染页面，用Vue等可以省掉这个请求直接前台处理
        Company.findOne({_id: id}, function(err, doc) {
            res.send(doc);
        })
    }
}).post(function(req, res) {
    // 修改数据
    var opt = req.params.name;
    var formData = req.body;
    if(opt == 'mod') {
        Company.find({serial: formData.serial}, function(err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
                // docs[0]._id != formData.id   不判断本身
            } else if(docs.length > 0 && docs[0]._id != formData.id) {
                res.status(200).json({code: 304, msg: '编码已存在'})
            } else {
                Company.update({_id: formData.id}, formData, function(err, doc) {
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
