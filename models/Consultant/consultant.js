var mongoose = require('mongoose');
var ConsultantSchema = new mongoose.Schema({
    companyName: {type:String, required: true},
    companyAddress: { type: String, required: true },
    companyPhoneNumber: String,
    companyEmail: String,
    gender: String,
   	phoneNumber: String,	
   	fullName: String,
	token: String,
    suspended: String,
    role: {type: Array, default: [1,2,3]},
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Consultant', ConsultantSchema);