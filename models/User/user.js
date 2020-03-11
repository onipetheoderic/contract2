var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    email: {type:String, required: true},
    password: { type: String, required: true },
    lastName: String,
    firstName: String,
    gender: String,
   	isSuperAdmin: {type: Boolean, default: false},
   	phoneNumber: String,	
   	name: String,
	token: String,
    suspended: String,
    role: String,
    userType: String,
    

    	
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('User', UserSchema);