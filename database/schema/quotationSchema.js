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
    time: Number,
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    }
}, {
    timestamps: true
});

QuotationSchema.statics = {
    findAll: function(conditions, cb) {
        return this.find(conditions)
            .populate([{
                path: 'plant',
                select: 'name'
            }, {
                path: 'car'
            }])
            .exec(cb);
    }
}

module.exports = QuotationSchema;