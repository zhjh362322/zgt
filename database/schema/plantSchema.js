var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantSchema = new Schema({
    serial: String,
    name: String,
    type: Number,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    claim: Number,
    orderNum: Number,
    shipper: [{
        type: Schema.Types.ObjectId,
        ref: 'Shipper'
    }]
}, {
    timestamps: true
});

module.exports = PlantSchema;