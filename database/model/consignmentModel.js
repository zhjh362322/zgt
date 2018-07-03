var mongoose = require('mongoose');
var consignmentSchema = require('../schema/consignmentSchema');
var Consignment = mongoose.model('Consignment', consignmentSchema, 'consignment');
module.exports = Consignment;