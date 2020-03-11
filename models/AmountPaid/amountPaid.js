var mongoose = require('mongoose');
var AmountPaidSchema = new mongoose.Schema({
   contract_id: String,
   amount: Number,
   status: {type:Boolean, default:false},
   amountCertifiedId: String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('AmountPaid', AmountPaidSchema);
