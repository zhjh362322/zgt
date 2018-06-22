var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConsignmentSchema = new Schema({
    cargo: Schema.Types.Mixed,    // 和 {} 等价
    // weight: Number,
    // volume: Number,
    // num: Number,
    price: Number,
    status: {
        type: Number,
        default: 0
    },
    note: String,
    consigner: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper'
    },
    consignee: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper'
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

ConsignmentSchema.statics = {
    findAllOrder: function(uid, cb) {
        return this.find({uid: uid})
            .populate([{
                path: 'consigner',
                select: 'companyName contacts cellphone address'
            },{
                path: 'consignee',
                select: 'companyName contacts cellphone address'
            }])
            .sort({createdAt: -1})
            .exec(cb)
    }
}

module.exports = ConsignmentSchema;