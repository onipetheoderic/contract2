var mongoose = require('mongoose');
var ContractSchema = new mongoose.Schema({
    serialNo: String,
    contractNo: String,
    projectTitle: String,
    state: String,
    lga: String,
    zone: String,
    mtb: String,
    bpp: String,
    contractSum: Number,
    contractType: String,
    roadLength: String,
    bridgeLength:String,
    latitude:String,
    longitude:String,
    projectLength: String,
    dateAwarded: String,
    dateCommencement:String,
    dateCompletion: String,
    prioritize: {type:Boolean, default:false},
    extendedDateOfCompletion: String,
    appropriationAct: String,
    amountCertifiedToDate:Number,
    amountPaidToDate:Number,
    outStandingCostPayment:Number,
    amountOfOutstandingCost:Number,
    role: {type: Array, default: [1,2,3]},
    assigned: {type: Boolean, default: false},
    status: String,
    currentPercentage: {type: Number, default: 0},
    highwayInspectorId: String,
    amount_paid:{type: Array, default:[0]},
    highwayInspectorDetails: String,
    contractor: [{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor'
      }],
    consultant: [{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultant'
    }],
    // user: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
   
    	
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Contract', ContractSchema);
