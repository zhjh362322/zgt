var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    serial: String,
    name: String,
    claim: Number,
    orderNum: Number,
    plant: [{
        type: Schema.Types.ObjectId,
        ref: 'Plant'
    }],
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = CompanySchema;