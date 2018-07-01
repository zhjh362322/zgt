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
    findAll: function(cb) {
        return this.find()
            .populate({
                path: 'plant',
                select: 'name'
            })
            .exec(cb);
    }
}

module.exports = QuotationSchema;