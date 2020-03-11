import {encrypt, decrypt, BASEURL, findResource} from '../../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../../utility/redirector'
const fs = require("fs");
import Contract from '../../../models/Contract/contract';
import User from '../../../models/User/user';
import Contractor from '../../../models/Contractor/contractor';
import Role from '../../../models/Role/role';
import Resource from '../../../models/Resource/resource';
import RoleToResource from '../../../models/RoleToResource/roleToResource';
import Priority from '../../../models/Priority/priority';
const state = require('../../../models/state.json');

import moment from 'moment';


import Consultant from '../../../models/Consultant/consultant';
import AmountPaid from '../../../models/AmountPaid/amountPaid';
import AmountCertified from '../../../models/AmountCertified/amountCertified';
var Request = require("request");
// TypeError: (0 , _index.AlexanderTheGreat) is not a function



//Configuration of roles
import config_resources from '../../../config/config_resources.json';
import config_roles from '../../../config/config_roles.json';
import config_resourse_link from '../../../config/config_resourse_link.json';

const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

const get_diff_start_current_date = (dateAwarded, dateCompletion) => {
    var a = moment(dateAwarded,'YYYY/M/D');
	var b = moment(dateCompletion,'YYYY/M/D');
    var duration = b.diff(a, 'days');
    return duration
}

const get_days_elapsed = (dateAwarded) =>{
    let new_date = new Date()
    let days_elapsed = moment(dateAwarded, 'YYYY/M/D')
    var today = moment(new_date,'M/D/YYYY')
    var duration = today.diff(days_elapsed, 'days');
    return duration
}

function add(accumulator, a) {
    return parseInt(accumulator) + parseInt(a);
}

exports.manage_roles = function(req, res) {
    Role.find({}, function(err, roles){
        if(roles.length===0){
            console.log("There is no roles created yet, so lets create em")
            for(var i in config_roles){
                // console.log("these are the configs", config_roles[i])
                let role = new Role();
                role.role_id = config_roles[i].role_id;
                role.title = config_roles[i].title;
                role.save(function(err, auth_details){       
                    if(err){
                      console.log(err)
                    } else {                    
                      console.log("successfull")
                    }
                });
            }
            for(var k in config_resources){
                let resource = new Resource();
                resource.title = config_resources[k].title;
                resource.resource_id = config_resources[k].resource_id;
                resource.save(function(err, resource){
                    if(err){
                        console.log(err)
                      } else {                    
                        console.log("successfull")
                      }
                })
            }
            for(var m in config_resourse_link){
                let roleToResource = new RoleToResource();
                roleToResource.resource_id = config_resourse_link[m].resource_id;
                roleToResource.role_id = config_resourse_link[m].role_id;
                roleToResource.role_name = config_resourse_link[m].role_name;
                roleToResource.resource_name = config_resourse_link[m].resource_name;
                roleToResource.save(function(err, roleToResources){
                    
                    if(err){
                        console.log(err)
                      } else {                    
                        console.log("successfull")
                      }
                })
            }
            res.redirect('/')
        }
        else {
            Role.find({}, function(err, all_roles){
                Resource.find({}, function(err, all_resource){
                    RoleToResource.find({})
                    .populate('role_id')
                    .populate('resource_id')
                    .exec(function(err, all_roles_to_resource){
                        res.render('Admin/dashboard/manage_roles', {layout: "layout/admin", 
                        datas:{all_roles:all_roles, 
                            roles_count:all_roles.length,
                            all_resource:all_resource,
                            resource_count:all_resource.length,
                            all_roles_to_resource:all_roles_to_resource
                        }})
                    })
                })
            })
        }
    })
}


exports.view_permissions = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "view_all_permissions"
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
            RoleToResource.find({role_id:req.params.id}, function(err, permissions){
                console.log("all", permissions)
                let role_name = permissions[0].role_name.toUpperCase()
                res.render('Admin/dashboard/all_permissions', {layout: "layout/admin", data:{permissions:permissions, role_name:role_name}})
            })
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
    
   
   
}

exports.edit_permission = function(req, res){
    console.log('body', req.body)
    if(req.body.status === "checked"){
        RoleToResource.findByIdAndUpdate(req.body.id, {status:true})
        .exec(function(err, updated_staff){
        if(err){
            res.json({"error":true})
        }else {
            res.json({"error":false, data:updated_staff})
        }
        })
    }
    else {
        RoleToResource.findByIdAndUpdate(req.body.id, {status:false})
        .exec(function(err, updated_staff){
        if(err){
            res.json({"error":true})
        }else {
            res.json({"error":false, data:updated_staff})
        }
        })
    }

}
exports.home = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    let decrypted_user_role = decrypt(req.session.role, req, res)
    Role.findOne({role_id:decrypted_user_role}, function(err, role){
        let role_name = role.title
    Contractor.find({}).exec(function(err, all_contractor){
        User.find({}).exec(function(err, all_user){     
            Contract.find({prioritize:true}, function(err, prioritizedContracts){

           
            Contract.find({})
            .populate('contractor')
            .populate('consultant')
            .exec(function(err, all_contract){
                // console.log('%j', all_contract);
                // console.log(all_contract.contractor)

                for(var i in all_contract){
                    // console.log("this are all the contracts",all_contract[i])
                  
                    const total_duration = get_diff_start_current_date(all_contract[i].dateAwarded, all_contract[i].dateCompletion)
                    // console.log(total_duration)
                    const days_elapsed = get_days_elapsed(all_contract[i].dateAwarded)
                    
                    
                    const moneyPaidSoFar = all_contract[i].amount_paid.reduce(add,0)
                    const contractSum = all_contract[i].contractSum;
                    const dailyBudget = contractSum/total_duration;
                    const total_money_supposed_to_be_spent = dailyBudget*days_elapsed;
                    
                    //let calculate internal Default now
                    const internal_default_strict = total_money_supposed_to_be_spent > moneyPaidSoFar?true:false
                    const internal_default_const = total_money_supposed_to_be_spent - moneyPaidSoFar;
                    const internal_default_calc = internal_default_const*100/total_money_supposed_to_be_spent
                    const internal_default = internal_default_calc>70?true:false
                    // console.log("this is the elapsed day",days_elapsed, internal_default)
                    let supposed_percentage = days_elapsed/total_duration*100
                    let contractors_default = all_contract[i].currentPercentage < supposed_percentage-5
                    let obj = all_contract[i];
                    obj["default"] = contractors_default;
                    obj["internal_default"] = internal_default;
                    // console.log("default status",obj.default)
                }
                // console.log("all prioriti", prioritizedContracts)

                User.findOne({_id:decrypted_user_id}, function(err, user){
                    console.log(user.userType)
                    const superAdmin = role_name ==="super_admin"?true:false;
                    const permanentSecretary = role_name ==="permanent_secretary"?true:false;
                    const minister = role_name === "minister"?true:false;
                    if(superAdmin){
                        res.render('Admin/dashboard/index_superadmin', {layout: "layout/admin", 
                        defaults_count: prioritizedContracts.length,
                        firstName:user.firstName,
                        priority:prioritizedContracts,
                        datas:{
                            BASEURL:BASEURL,
                            prioritizedContracts: prioritizedContracts,
                            contract_count:all_contract.length,
                            user_count:all_user.length,
                            all_contract: all_contract,
                            contractor_count:all_contractor.length}
                        })
                    }
                   
                    else if(permanentSecretary){
                        res.render('Admin/dashboard/index_permanent_secretary', {layout: "layout/admin", 
                        defaults_count: prioritizedContracts.length,
                        firstName:user.firstName,
                        priority:prioritizedContracts,
                        datas:{
                            BASEURL:BASEURL,
                            
                            prioritizedContracts: prioritizedContracts,
                            contract_count:all_contract.length,
                            user_count:all_user.length,
                            all_contract: all_contract,
                            contractor_count:all_contractor.length}
                        })
                    }
                    else if(minister){
                        res.render('Admin/dashboard/index_minister', {layout: "layout/admin", 
                        defaults_count: prioritizedContracts.length,
                        firstName:user.firstName,
                        priority:prioritizedContracts,
                        datas:{
                            BASEURL:BASEURL,
                        
                            prioritizedContracts: prioritizedContracts,
                            contract_count:all_contract.length,
                            user_count:all_user.length,
                            all_contract: all_contract,
                            contractor_count:all_contractor.length}
                        })
                    }
                
                       
            })
        })  
        })
    })
    })
});
}
     
}

exports.get_contract_datasheet = function(req, res) {
    const myUrl =` ${BASEURL}/get_contract_datas/${req.params.id}`
    Request.get({url: myUrl}, (error, response, body) => {
        if(error || body=="null") {
            res.json({data:"error"})
        }
        else {
            // console.log('this is thte body of the request', JSON.parse(body))
            // console.log(JSON.parse(body));
            let databody = body
            res.json({data:databody})

        }
       
    })   
}

exports.get_single_contract = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "view_single_contract"
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
            const myUrl =` ${BASEURL}/get_contract_datas/${req.params.id}`
            Contract.findOne({_id:req.params.id})
            .populate('contractor')
            .exec(function(err, single_contract){
        //lets get all Contractors contract
        console.log("this are the single details",single_contract)
                let contractorDetails = single_contract.contractor[0]
                let contractorsID = single_contract.contractor[0]._id;
        
                
                Contract.find({contractor:contractorsID}, function(err, allContracts){
                    console.log("this are all the contractors contracts", allContracts)
                    let allContr = JSON.stringify(allContracts)
                    let allContractorsContractCount = allContracts.length;
              
                const total_duration = get_diff_start_current_date(single_contract.dateAwarded, single_contract.dateCompletion)
                const days_elapsed = get_days_elapsed(single_contract.dateAwarded)
                // console.log("jjjfjfj",total_duration, days_elapsed)
                let supposed_percentage = days_elapsed/total_duration*100
                let contractors_default = single_contract.currentPercentage < supposed_percentage-5
                let obj = single_contract;
               
                obj["default"] = contractors_default;
                // console.log(single_contract.default)
        
                const moneyPaidSoFar = single_contract.amount_paid.reduce(add,0)
                const contractSum = single_contract.contractSum;
                const dailyBudget = contractSum/total_duration;
                const total_money_supposed_to_be_spent = dailyBudget*days_elapsed;
                
                //let calculate internal Default now
                const internal_default_strict = total_money_supposed_to_be_spent > moneyPaidSoFar?true:false
                const internal_default_const = total_money_supposed_to_be_spent - moneyPaidSoFar;
                const internal_default_calc = internal_default_const*100/total_money_supposed_to_be_spent
                const internal_default = internal_default_calc>70?true:false
        
              
                obj["internal_default"] = internal_default;
        
                Request.get({url: myUrl}, (error, response, body) => {
                    if(error || body=="null") {
                        res.render('Admin/dashboard/single_contract_page', {layout:false, data:single_contract, name:"null"})
                    }
                    else {
                     //   console.log('this is thte body of the request', JSON.parse(body))
                        console.log("from single contract page",days_elapsed, internal_default)
                        // console.log(JSON.parse(body));
                        let databody = body
                        res.render('Admin/dashboard/single_contract_page', {layout:false, 
                            data:single_contract, 
                            name:databody, 
                            contractorDetails:contractorDetails,
                            supposed_percentage: supposed_percentage.toFixed(2),
                            allContractorsContractCount:allContractorsContractCount,
                            moneyPaidSoFar:moneyPaidSoFar,
                            dailyBudget: dailyBudget.toFixed(2),
                            allContracts:allContr,                    
                            total_money_supposed_to_be_spent: total_money_supposed_to_be_spent.toFixed(2),                    
        
                        })
            
                    }
                   
                })    
            })
            })
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
}




exports.login = function(req, res) {
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register", })
}
exports.register = function(req, res) {
    res.render('Admin/dashboard/register', {layout: "layout/login-register", })
}

exports.register_super = function(req, res) {
    console.log("registerpost url", req.body)    
    User.findOne({email: req.body.email}, function(err, vals){
        if (vals==null) { 
            console.log("username not taken")
            User.findOne({email: req.body.email}, function(err, valss){
                if (valss==null) { 
                    console.log("email address not taken")//
                    let user = new User();
                        user.email = req.body.email;
                        user.firstName = req.body.first_name;
                        user.lastName = req.body.last_name;
                        user.phoneNumber = req.body.phone_number;
                        user.password = req.body.password;
                        user.role = "1";
                        user.isAdmin = true;   
                        user.phoneNumber = req.body.phone_number;     
                        user.save(function(err, auth_details){       
                            if(err){
                                console.log(err)
                                res.render('Admin/dashboard/register', {layout: "layout/login-register", message:{error: "Error occured during user registration"} })
                                return;
                            } else {                    
                                res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "User Successfully Registered", successDescription: `The Username is ${req.body.email}, `} })
                            }
                        });


                }
        else if(valss !=null){
              // console.log("Phone number taken")
            res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Phone Number has already been taken"} })

        }

        else if(vals !=null){            
            // console.log("username taken")
            res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Email has already been taken"} })
            }
        })
        }
     })   

}

exports.view_all_contract = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "view_contract_db"
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
            Contract.find({}).exec(function(err, all_records){
                res.render('Admin/dashboard/view_all_contracts', {layout:false, datas:{contracts:all_records}})
            })
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
    
}


exports.inspection_page = function(req, res) {
    res.render('Admin/dashboard/inspection_page', {layout: "layout/admin"})
}
exports.create_contract= function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_contract"
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
            Contractor.find({}, function(err, contractors){
                console.log("this are the contr",contractors)
                Consultant.find({}, function(err, consultants){
                    console.log("this is the state", state)
                    res.render('Admin/dashboard/create_contract', {layout: "layout/stepper", data:{state:state, consultants:consultants, contractors:contractors}})
                })
               
            })
            
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
   
}



exports.create_contract_post = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_contract"
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
            console.log("contract body",req.body)

            var contract = new Contract({ 
                projectTitle: req.body.projectTitle, 
                state: req.body.state,
                lga: req.body.lga, 
                zone: req.body.zone,
                contractType: req.body.contract_type,
                mtb: req.body.mtb, 
                bpp: req.body.bpp,
                contractSum: req.body.contractSum, 
                roadLength: req.body.roadLength, 
                bridgeLength: req.body.bridgeLength,
                projectLength: req.body.projectLength, 
                dateAwarded: req.body.dateAwarded,
                dateCommencement: req.body.dateCommencement, 
                consultant: req.body.consultant_id,
                contractor: req.body.contractor_id,
                dateCompletion: req.body.dateCompletion,
                extendedDateOfCompletion: req.body.extendedDateOfCompletion, 
                appropriationAct: req.body.appropriationAct,
                amountCertifiedToDate: req.body.amountCertifiedToDate, 
                amountPaidToDate: req.body.amountPaidToDate,
                outStandingCostPayment: req.body.outStandingCostPayment, 
                amountOfOutstandingCost: req.body.amountOfOutstandingCost,
         
             });
          
             // save model to database
             contract.save(function (err, contract) {
               if (err) return console.error(err);
               res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Contract Successfully Created", successDescription: "The Contract Was successfully Created"} })
             });
            
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
   

}


exports.mapview = function(req, res) {
    res.render('Admin/dashboard/map_view', {layout: "layout/admin"})
}
exports.chart_page = function(req, res) {
    res.render('Admin/dashboard/chart', {layout: "layout/chatlayout"})
}

exports.report_page = function(req, res) {
    res.render('Admin/dashboard/report', {layout: "layout/form"})
}
