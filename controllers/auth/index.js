import User from '../../models/User/user';
import Consultant from '../../models/Consultant/consultant';
import Contractor from '../../models/Contractor/contractor';
import Role from '../../models/Role/role';
import Resource from '../../models/Resource/resource';
import RoleToResource from '../../models/RoleToResource/roleToResource';
import {encrypt, decrypt, findResource} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'
const fs = require("fs");
import sha512 from 'sha512';
import { resolveSoa } from 'dns';
const cryptoRandomString = require('crypto-random-string');
var randomstring = require("randomstring");
var md5 = require('md5');
// TypeError: (0 , _index.AlexanderTheGreat) is not a function
const state = require('../../models/state.json');


const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

const dashboardMsg = (type, msg) => {
    if(type=="error"){
        return 
    }
    else {
        return
    }
}

exports.changePassword_get = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        res.render('Admin/dashboard/change_password', {layout: "layout/login-register"})
    }
    
}




exports.changePassword_post = function(req, res){
   const previousPassword = req.body.previous_password;
   const newPassword = req.body.new_password;

    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        User.findOne({_id:decrypted_user_id}, function(err, user){           
            if(user.password === previousPassword){
                User.findByIdAndUpdate(decrypted_user_id, {password:newPassword})
                .exec(function(err, updated_staff){
                    if(err){
                        console.log(err)
                    }else {
                        res.redirect('/login')
                    }
                })
                
            }
            else {
                res.render('Admin/dashboard/change_password', {layout: "layout/login-register", message:{error:'You Entered the Wrong Password'}})
            }
        })
    }

}


exports.unauthorized = function(req, res){
    res.render('Admin/dashboard/unauthorized', {layout: false})
}

exports.register_user = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_user"
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
            Role.find({role_id: {$ne: "1"}}, function(err, roles){
                console.log("rolesss", roles)
           
            if(permission===true){
                res.render('Admin/dashboard/register_user', {layout: "layout/login-register", data:{roles:roles}})
            }
            else{
                res.redirect('/unauthorized')
            }
            })
        })
        
       
    }
}

// exports.create_highway_inspector = function(req, res) {
//     res.render('Admin/dashboard/create_contractor', {layout: "layout/admin"})
// }
exports.create_consultant= function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_consultant"
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
            res.render('Admin/dashboard/create_consultant', {layout: "layout/admin"})
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
}

// exports.assign_highway_contracts = function(req, res){
//     res.render('Admin/dashboard/create_consultant', {layout: "layout/admin"})
// }

// exports.assign_highway_contracts_post = function(req, res){
//     res.render('Admin/dashboard/create_consultant', {layout: "layout/admin"})
// }
exports.chat = function(req, res){
    res.render('Admin/dashboard/chat', {layout: false})
}

exports.view_all_contractors = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "view_all_contractor"
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
            Contractor.find({}).exec(function(err, all_records){        
                res.render('Admin/dashboard/view_all_contractors', {layout:false, datas:{contractors:all_records}})
            })
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
   
}

exports.create_contractor= function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_contractor"
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
            res.render('Admin/dashboard/create_contractor', {layout: "layout/stepper"})
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
}


exports.login = function(req, res) {
    res.render('Admin/dashboard/login', {layout: "layout/admin-login"})
}


exports.edit_user_details = function(req, res) {
    res.render('Admin/dashboard/edit_user_details', {layout: "layout/admin"})
}


exports.login_post = function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    // let passwordhash = sha512(req.body.password)
    User.findOne({email: email}, function(err, user) {
       if(user == null)
        {
           res.render('Admin/dashboard/login', {layout: "layout/admin-login", message:{error: "Email not registered"}})
        }
        else{
            let user_id = user.id
            if (user.password == password){
                console.log('User connected');
                  let encId = encrypt(user_id)
                  let encRole = encrypt(user.role)
                  req.session.user_id = encId;
                  req.session.role = encRole;
                  res.redirect("/")
             
            }else{
                  // res.status(401).send('Invalid Password Key');
                  res.render('Admin/dashboard/login', {layout: "layout/admin-login", message:{error: "invalid Phone Number or password"}})
            }
        }

    })
}


exports.logout = function(req, res){
  req.session.destroy();  
   res.redirect('/')                

}


exports.changePassword_get = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        res.render('Admin/dashboard/change_password', {layout: "layout/login-register"})
    }
    
}




exports.changePassword_post = function(req, res){
   const previousPassword = req.body.previous_password;
   const newPassword = req.body.new_password;

    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        User.findOne({_id:decrypted_user_id}, function(err, user){           
            if(user.password === previousPassword){
                User.findByIdAndUpdate(decrypted_user_id, {password:newPassword})
                .exec(function(err, updated_staff){
                    if(err){
                        console.log(err)
                    }else {
                        res.redirect('/login')
                    }
                })
                
            }
            else {
                res.render('Admin/dashboard/change_password', {layout: "layout/login-register", message:{error:'You Entered the Wrong Password'}})
            }
        })
    }


    
}

exports.create_consultant_post = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_consultant"
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
            console.log("contractor body",req.body)
 
            var consultant = new Consultant({ 
                companyName: req.body.companyName, 
                companyAddress: req.body.companyAddress,
                companyPhoneNumber: req.body.companyPhoneNumber, 
                companyEmail: req.body.companyEmail,
                gender: req.body.gender, 
                fullName: req.body.fullName,       
             });
             consultant.save(function (err, consultant) {
                if (err) return console.error(err);
                res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Consultant Successfully Created", successDescription: "The Contractor Was successfully Created"} })
              });
        }
        else{
            res.redirect('/unauthorized')
        }
        })
    }
} 



exports.create_contractor_post = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_contractor"
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
            console.log("contractor body",req.body) 
            var contractor = new Contractor({ 
                companyName: req.body.companyName, 
                companyAddress: req.body.companyAddress,
                companyPhoneNumber: req.body.companyPhoneNumber, 
                companyEmail: req.body.companyEmail,
                gender: req.body.gender, 
                fullName: req.body.fullName,       
            });
            contractor.save(function (err, contractor) {
                if (err) return console.error(err);
                res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Contractor Successfully Created", successDescription: "The Contractor Was successfully Created"} })
            });
        }
        else{
            res.redirect('/unauthorized')
        }
        })

    }
} 

exports.register_post = function(req, res) {
    console.log("registerpost url", req.body)    
    const randomPassword = randomstring.generate(7);
    console.log("this is the random password",randomPassword)
    User.findOne({email: req.body.email}, function(err, vals){
        if (vals==null) { 
            console.log("username not taken")
            User.findOne({email: req.body.email}, function(err, valss){
                if (valss==null) { 
                    console.log("Phone number not taken")//
            // var passwordhash = sha512(randomPassword)
            // const passwordhash = md5(passwordhash)
            let user = new User();
                user.email = req.body.email;
                user.firstName = req.body.first_name;
                user.lastName = req.body.last_name;
                user.phoneNumber = req.body.phone_number;
                user.password = randomPassword;
                user.userType = req.body.user_type;
                user.role = req.body.user_type;
                user.isAdmin = false;   
                user.phoneNumber = req.body.phone_number;     
                user.save(function(err, auth_details){       
                    if(err){
                        res.render('Admin/dashboard/register_user', {layout: "layout/admin", message:{error: "Error occured during user registration"} })
                        return;
                    } else {                    
                        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "User Successfully Registered", successDescription: `The Username is ${req.body.email}, while the Password is ${randomPassword}`} })
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



