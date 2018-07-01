var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: 'dc483e80a7a0bd9ef71d8cf973673924'
    },
    name: String,
    email: String,
    cellphone: String,
    status: Number,
    level: Number,
    owner: {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        },
        plant: {
            type: Schema.Types.ObjectId,
            ref: 'Plant'
        }
    }
}, {
    timestamp: true
});

UserSchema.statics = {
    // path:嵌套的属性， select:查询字段， match:obj附加查询条件， options:obj其他条件,limit之类
    // populate:嵌套查询
    findPlant: function (_id, cb) {
        return this.findOne({_id: _id}, {uid: 1, level: 1, name: 1, email: 1, cellphone: 1})
            .populate({
                path: 'owner.plant',
                select: 'serial name claim orderNum -_id',
                // 多个ref，1、数组 2、
                populate: [{
                	path: 'company',
                	select: 'name serial -_id'
                }, {
                    path: 'shipper',
                    select: 'contacts cellphone companyName address type'
                }]
                // populate: {
                //     path: 'company shipper',
                //     select: 'name serial contacts cellphone companyName address type'
                // }
            })
            .exec(cb);
    },
    findCompany: function (_id, cb) {
        return this.findOne({_id: _id}, {uid: 1, level: 1, name: 1, email: 1, cellphone: 1})
            .populate({path: 'owner.company', select: 'name claim orderNum -_id'})
            .exec(cb);
    },
    findByUid: function (uid, cb) {
        return this.findOne({uid: uid})
            .exec(cb);
    },
    findAll: function(cb) {
        return this.find()
            .populate({
                path: 'owner.plant owner.company',
                select: 'name'
            })
            .exec(cb);
    }
};

module.exports = UserSchema;