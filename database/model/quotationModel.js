var mongoose = require('mongoose');
var quotationSchema = require('../schema/quotationSchema');
var Quotation = mongoose.model('Quotation', quotationSchema, 'quotation');
module.exports = Quotation;