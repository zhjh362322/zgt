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

ShipperSchema.statics = {
    findAll: function(cb) {
        return this.find()
            .populate({
                path: 'plant',
                select: 'name'
            })
            .exec(cb)
    }
}


module.exports = ShipperSchema;