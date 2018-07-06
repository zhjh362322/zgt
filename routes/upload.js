var express = require('express');
var router = express.Router();
var multer = require('multer');
// var upload = multer({ dest: '../public/uploads/swiper/' }).single('headpic')
// var upload = require('../utils/multerUtil')(process.cwd() + '/public/uploads/swiper/');
var upload1 = getUpload(process.cwd() + '/public/uploads/', 'headpic');
var upload2 = getUpload(process.cwd() + '/public/uploads/swiper/', 'swiper');
router.route('/:name').get(function(req, res) {
    var name = req.params.name;
    if(name == 'headpic') {
        res.render('upload/headpic',  {pid: 3, subid: 31, breadcrumb: ['上传', '运单查询头图']});
    } else {
        res.render('upload/swiper',  {pid: 3, subid: 32, breadcrumb: ['上传', '线路轮播图']});
    }
})
router.post('/headpic', upload1.single('headpic'), function(req, res) {
    res.send({msg: 'ok'})
});
router.post('/swiper', upload2.array('swiper'), function(req, res) {
    res.send({msg: 'ok'})
});
function getUpload(path, fname) {
    var storage = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function (req, file, cb) {
            // cb(null, config.quotationImgPath)
            cb(null, path)
        },
        //给上传文件重命名，获取添加后缀名
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            if(fname == 'swiper') {
                var len = req.files.length;
                cb(null, len-- + ".jpeg");
            } else {
                cb(null, fname + ".jpeg");
            }
        }
    });
    var fileFilter = function (req, file, cb) {
        if (file.mimetype.split("/")[0] == 'image') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
//添加配置文件到muler对象。
    var upload = multer({
        storage: storage,
        fileFilter: fileFilter
    });
    return upload;
}
module.exports = router;
