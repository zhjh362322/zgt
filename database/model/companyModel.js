var mongoose = require('mongoose');
var companySchema = require('../schema/companySchema');
var Company = mongoose.model('Company', companySchema, 'company');
module.exports = Company;