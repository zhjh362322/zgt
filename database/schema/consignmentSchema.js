var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConsignmentSchema = new Schema({
    cargo: Schema.Types.Mixed,    // 和 {} 等价
    weight: Number,
    volume: Number,
    price: Number,
    consigner: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper'
    },
    consignee: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper'
    }
}, {
    timestamps: true
});

module.exports = ConsignmentSchema;