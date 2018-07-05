var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    carNo: String,
    driver: String,
    phone: Number,
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant'
    },
    type: Number,
    weight: Number,
    volume: Number,
    deadweight: Number,
    status: Number
}, {
    timestamps: true
});

CarSchema.statics = {
    findAll: function(conditions, cb) {
        return this.find(conditions)
            .populate({
                path: 'plant',
                select: 'name'
            })
            .exec(cb);
    }
}

module.exports = CarSchema;