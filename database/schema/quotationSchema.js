var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuotationSchema = new Schema({
    headimg: String,
    name: String,
    startCity: String,
    endCity: String,
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant'
    },
    contacts: String,
    cellphone: String,
    price: Number,
    time: Number
}, {
    timestamps: true
});

QuotationSchema.statics = {
    findAll: function(conditions, cb) {
        return this.find(conditions)
            .populate({
                path: 'plant',
                select: 'name'
            })
            .exec(cb);
    }
}

module.exports = QuotationSchema;