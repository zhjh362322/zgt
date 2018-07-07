var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../model/userModel');
var PlantSchema = new Schema({
    cellphone: String,
    serial: String,
    name: String,
    type: Number,
    email: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    claim: {
        type: Number,
        default: 0
    },
    orderNum: {
        type: Number,
        default: 0
    },
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
    }],
    car: [{
        type: Schema.Types.ObjectId,
        ref: 'Car'
    }]
}, {
    timestamps: true
});
PlantSchema.pre('save', function(next) {
    // 默认给加盟商一个帐号
    var obj = {
        uid: this.cellphone,
        cellphone: this.cellphone,
        name: this.name,
        level: 2,
        status: 2,
        owner: {plant: this._id},
        email: this.email
    };
    var user = new User(obj);
    user.save();
    next();
});
PlantSchema.statics = {
    findAll: function(conditions, cb) {
        return this.find(conditions, {user: 0, quotation: 0, shipper: 0})
            .populate({
                path: 'company',
                select: 'name'
            })
            .exec(cb);
    }
}

module.exports = PlantSchema;