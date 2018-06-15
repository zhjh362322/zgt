var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipperSchema = new Schema({
    contacts: String,
    cellphone: String,
    companyName: String,
    address: String,
    type: Number,
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant'
    }
}, {
    timestamps: true
});



module.exports = ShipperSchema;