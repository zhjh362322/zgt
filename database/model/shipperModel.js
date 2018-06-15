var mongoose = require('mongoose');
var ShipperSchema = require('../schema/shipperSchema');
var Shipper = mongoose.model('Shipper', ShipperSchema, 'shipper');
module.exports = Shipper;