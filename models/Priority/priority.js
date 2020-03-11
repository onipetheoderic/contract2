var mongoose = require('mongoose');
var PrioritySchema = new mongoose.Schema({
    contract: [{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    }],

},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Priority', PrioritySchema);