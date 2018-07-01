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
    }],
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    quotation: [{
        type: Schema.Types.ObjectId,
        ref: 'Quotation'
    }]
}, {
    timestamps: true
});
PlantSchema.statics = {
    findAll: function(cb) {
        return this.find(null, {user: 0, quotation: 0, shipper: 0})
            .populate({
                path: 'company',
                select: 'name'
            })
            .exec(cb);
    }
}

module.exports = PlantSchema;