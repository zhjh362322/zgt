var mongoose = require('mongoose');
var carSchema = require('../schema/carSchema');
var Car = mongoose.model('Car', carSchema, 'car');
module.exports = Car;