var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuotationSchema = new Schema({
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



module.exports = QuotationSchema;