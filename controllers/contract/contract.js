import Contractor from '../../models/Contractor/contractor';
import Contract from '../../models/Contract/contract';
import {encrypt, decrypt, findResource} from '../../utility/encryptor'
import Role from '../../models/Role/role';
import Resource from '../../models/Resource/resource';
import RoleToResource from '../../models/RoleToResource/roleToResource';
import AmountPaid from '../../models/AmountPaid/amountPaid';
import AmountCertified from '../../models/AmountCertified/amountCertified';
import Priority from '../../models/Priority/priority';

exports.get_all_contracts = function(req, res) {
    Contract.find({}, function(err, users) {
        console.log(users)
        res.json(users)
    });
}



exports.user_contracts = function(req, res) {
    Contract.find({highwayInspectorId: req.params.id}, function(err, contracts){
    //    const result = contracts.map(({_id, projectTitle, state, lga, currentPercentage, contractType }) => ({
    //     _id, projectTitle, state, lga, currentPercentage, contractType
    //     }));
    //     console.log("results I want", result)
        res.json({data:contracts})
    })
}

exports.get_contract_percentage = function(req, res) {
    console.log("this is the contract id",req.params.id)
    Contract.findOne({_id: req.params.id}, function(err, contract){
        console.log("contract",contract)
        res.json({data:contract.projectLength})
    })
}



exports.assign_highway_to_contract = function(req, res) {
    console.log("this is the current id the project want to be assigned to", req.body)
    let highwayId = req.body.user_id;
    let contractId = req.body.contract_id;

    Contract.findOneAndUpdate({ _id: contractId }, { $set: { highwayInspectorId: highwayId,
        assigned: true } }, { new: true }, 
        function(err, doc) {
            if(err){
                res.json({status:"error", data:err})
            }
            else {
                console.log("updated val", doc)
                res.json({status:"success", data:doc})
            }
        }
    );
}

exports.modify_percentage_of_contract = function(req, res) {

    console.log("this is the current id the project want to be modified to", req.params.id)
    // Contract.findOne({req.body}, function(err, contract){
    //     console.log("singleContract")
    // })
    console.log(req.body)
}

exports.modify_percentage_of_highway_contract = function(req, res) {
    console.log("this is the current id the project want to be assigned to", req.body)
    let currentPercent = req.body.percentage;
    let contractId = req.body.contract_id;

    Contract.findOneAndUpdate({ _id: contractId }, { $set: { currentPercentage: currentPercent} }, { new: true }, 
        function(err, doc) {
            if(err){
                res.json({status:"error", data:err})
            }
            else {
                console.log("updated val", doc)
                res.json({status:"success", data:doc})
            }
        }
    );
}



exports.make_contract_priority= function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "prioritize_a_contract"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    const getUser = findResource({role_id: decrypted_user_role})
    getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            Contract.findByIdAndUpdate(req.params.id, {prioritize:true})
            .exec(function(err, updatedContract){
                if(err){
                    console.log("error")
                }
                else {
                    res.redirect('/')
                }
            })
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
   
}


exports.get_all_highway_contract_api = function(req, res){
    let highwayInspectorId = req.params.id
    Contract.find({highwayInspectorId:highwayInspectorId}, 'projectTitle state lga prioritize contractType', 
    function(err, all_contracts){
        if(err){
            console.log(err)
        }
        else {
            res.json(all_contracts)
        }      
    })
}



exports.get_all_highway_contracts_by_highway_id = function(req, res){
    let highwayInspectorId = req.params.id
    Contract.find({highwayInspectorId})
    .populate('contractor')
    .populate('consultant')
    .exec(function(err, all_contracts){
        if(err){
            console.log("error")
        }
        else {
            console.log(all_contracts)
            res.json({data:all_contracts})
        }
    })
}


exports.update_contract_payment = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "update_payment_of_contract"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    const getUser = findResource({role_id: decrypted_user_role})
    getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            let currentId = req.params.id;
            let amount = req.body.amount;
            let contract_id = req.body.contract_id
            console.log(currentId, amount, contract_id)
            let amountCertified = new AmountCertified();
            amountCertified.contract_id = contract_id;
            amountCertified.amount = amount; 
            
            amountCertified.save(function(err, auth_details){       
                if(err){
                    res.render('Admin/dashboard/view_all_contracts', {layout: "layout/admin", message:{error: "Error occured during user registration"} })
                    return;
                } else {                    
                    res.redirect("/")
                }
            });
        }
        else{
            res.redirect('/unauthorized')
        }
        })

    }
}

exports.make_payment_contract = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "update_payment_of_contract"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    const getUser = findResource({role_id: decrypted_user_role})
    getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            Contract.findOne({_id:req.body.contract_id}, function(err, contract){
                var previous_contracts = [];
                previous_contracts.push(contract.amount_paid)
                let currentamount = req.body.amount;
                let newArray = contract.amount_paid.concat(currentamount);
                console.log(newArray)
                Contract.findByIdAndUpdate(req.body.contract_id, {amount_paid:newArray})
                .exec(function(err, updatedContract){
                    if(err){
                        console.log("error")
                    }
                    else {
                        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Contract Successfully Updated", successDescription: "The Contract Was successfully Updated"} })
                    }
                })
                
            })
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }

    
}


