var express = require('express');
var router = express.Router();
var Consignment = require('../database/model/consignmentModel');
router.route('/').get(function(req, res) {
    var search = req.query.search;
    if(!search) {
        Consignment.findAll(function (err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                res.render('consignment', { pid: 2, subid: 21, breadcrumb: ['基础资料', '运单列表'], consignment: docs});
            }
        })
    } else {
        var reg = new RegExp(search, 'i')
        Consignment.findAll(function (err, docs) {
            if(err) {
                res.status(500).json({err: err.message});
            } else {
                var order = [];
                for(var i = 0; i < docs.length; ++i) {
                    if(reg.test(docs[i].consigner.companyName) || reg.test(docs[i].consignee.companyName)) {
                        order.push(docs[i]);
                    }
                }
                res.render('consignment', { pid: 2, subid: 21, breadcrumb: ['基础资料', '运单列表'], consignment: order});
            }
        })
    }
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