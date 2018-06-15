var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    serial: String,
    name: String,
    claim: Number,
    orderNum: Number
}, {
    timestamps: true
});

module.exports = CompanySchema;