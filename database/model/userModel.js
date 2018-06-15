var mongoose = require('mongoose');
var UserSchema = require('../schema/userSchema');
// model() 第一个参数是模型名称，一般和返回值一样
// model() 第三个参数是集合名称。为空时，例1 Model1 => model1、例2 Model => models
var User = mongoose.model('User', UserSchema, 'users');
module.exports = User;