var express = require('express');
var router = express.Router();
var Consignment = require('../database/model/consignmentModel');
router.route('/').get(function(req, res) {
    // 加盟商子公司下拉数据
    Consignment.findAll(function (err, docs) {
        if(err) {
            res.status(500).json({err: err.message});
        } else {
            res.render('consignment', { pid: 2, consignment: docs});
        }
    })
})

router.get('/:name', function(req, res, next) {
    var name = req.params.name;
    var q = req.query;
    if(name == 'update' && q.id) {
        Consignment.update({_id: q.id}, {status: q.status}, function(err, doc) {
            if(err) {
                res.status(500).json({err: err.message, msg: '操作失败'});
            } else {
                res.send(doc);
            }
        })
    } else {
        next();
    }
})

module.exports = router;