var mongoose = require('mongoose');
var plantSchema = require('../schema/plantSchema');
var Plant = mongoose.model('Plant', plantSchema, 'plant');
module.exports = Plant;