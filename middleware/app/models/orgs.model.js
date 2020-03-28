const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const orgSchema = new Schema({
    orgName: String,
    orgDescription: String,
    contactName: String,
    email: String,
    permissionLevel: Number,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    orgText1: String,
    orgText2: String
    
});

orgSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orgSchema.set('toJSON', {
    virtuals: true
});

orgSchema.findById = function (cb) {
    return this.model('Orgs').find({id: this.id}, cb);
};

const Org = mongoose.model('Orgs', orgSchema);

exports.findByEmail = (email) => {
    return Org.find({email: email});
};
exports.findById = (id) => {
    return Org.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createOrg = (orgData) => {
    const org = new Org(orgData);
    return org.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Org.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, orgs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(orgs);
                }
            })
    });
};

exports.patchOrg = (id, orgData) => {
    return new Promise((resolve, reject) => {
        Org.findById(id, function (err, org) {
            if (err) reject(err);
            for (let i in orgData) {
                org[i] = orgData[i];
            }
            org.save(function (err, updatedOrg) {
                if (err) return reject(err);
                resolve(updatedOrg);
            });
        });
    })

};

exports.removeById = (orgId) => {
    return new Promise((resolve, reject) => {
        Org.remove({_id: orgId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

