var mongoose = require('mongoose');
var consignmentSchema = require('../schema/ConsignmentSchema');
var Consignment = mongoose.model('Consignment', consignmentSchema, 'consignment');
module.exports = Consignment;