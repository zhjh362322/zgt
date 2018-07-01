var config = require('../config/config');
var  multer=require('multer');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, config.uploadPath)
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        console.log(req.body)
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var fileFilter = function(req, file, cb) {
    if(file.mimetype.split("/")[0] == 'image') {
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

//如需其他设置，请参考multer的limits,使用方法如下。
//var upload = multer({
//    storage: storage,
//    limits:{}
// });

//导出对象
module.exports = upload;