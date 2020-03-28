const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: String,
    projectDescription: String,
    stDate: String,
    endDate: String,
    permissionLevel: Number,
    company: String,
    projectText1: String,
    projectText2: String
    
});

projectSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
projectSchema.set('toJSON', {
    virtuals: true
});

projectSchema.findById = function (cb) {
    return this.model('Projects').find({id: this.id}, cb);
};

const Project = mongoose.model('Projects', projectSchema);

exports.findByEmail = (email) => {
    return Project.find({email: email});
};
exports.findById = (id) => {
    return Project.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProject = (projectData) => {
    const project = new Project(projectData);
    return project.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Project.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, projects) {
                if (err) {
                    reject(err);
                } else {
                    resolve(projects);
                }
            })
    });
};

exports.patchProject = (id, projectData) => {
    return new Promise((resolve, reject) => {
        Project.findById(id, function (err, project) {
            if (err) reject(err);
            for (let i in projectData) {
                project[i] = projectData[i];
            }
            project.save(function (err, updatedProject) {
                if (err) return reject(err);
                resolve(updatedProject);
            });
        });
    })

};

exports.removeById = (projectId) => {
    return new Promise((resolve, reject) => {
        Project.remove({_id: projectId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

