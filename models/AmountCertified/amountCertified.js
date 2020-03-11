var mongoose = require('mongoose');
var AmountCertifiedSchema = new mongoose.Schema({
   contract_id: String,
   amount: Number,
   status: {type:Boolean, default:false},
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('AmountCertified', AmountCertifiedSchema);
