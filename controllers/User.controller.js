const User = require('../models/User.model');
var jwt    = require('jsonwebtoken');
const config = require('../config/config');
module.exports = {

    resetPassword: (req,res,next) => {
    //validation
    req.checkParams('token', 'token is required').notEmpty();
    req.checkBody('password',"Password is required").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var response = { status: false, errors: [] };
        errors.forEach(function (err) {
            response.errors.push(err.msg);
        });
        return res.json(response);
    };
    //End Validation

    let token = req.params.token;

    jwt.verify(token,config.forgotpasswordToken, function (err, decoded) {
        if (err) {
            return res.json({ success: false, msg: 'Incorrect password reset link' });
        } else {
            let userid = decoded._id;
            let newpassword = User.encrypt(req.body.password);

            User.findByIdAndUpdate(userid,{password:newpassword}).then(u => {
                res.json({
                    status:true,
                    msg:"Password Reset Success"
                })
            }).catch(err => {
                res.json({
                    status:false,
                    msg:"Failed to reset Password"
                })
            })
        }
    });

    },
    sendpasswordResetEmail:(req,res,next) => {
         //validation
         req.checkParams('email', 'Email is required').notEmpty();
         var errors = req.validationErrors();
         if (errors) {
             var response = { status: false, errors: [] };
             errors.forEach(function (err) {
                 response.errors.push(err.msg);
             });
             return res.json(response);
         };
         //End Validation

         User.findOne({email:req.params.email}).then(user => {
            if( user == null){
                return res.json({
                    status:false,
                    msg:"Invalid Email"
                })
            }

            let token = jwt.sign({_id:user._id}, config.forgotpasswordToken);

            user.passwordReset = token;
            user.save().then(u => {
                res.json({
                    status:true,
                    msg:"Email Sent",
                    data:"http://localhost:3010/user/resetpassword/"+token
                })
            })
         })
    },

    activateAccount:(req,res,next) => {
        //validation
        req.checkParams('email', 'Email is required').notEmpty();
        req.checkParams('token', 'Token is required').notEmpty();
      
        var errors = req.validationErrors();
        if (errors) {
            var response = { status: false, errors: [] };
            errors.forEach(function (err) {
                response.errors.push(err.msg);
            });
            return res.json(response);
        };
        //End Validation

        //Validationsuccess
        
        User.findOne({email:req.params.email}).then(user => {
            console.log(user);
            if( user == null){
                return res.json({
                    status:false,
                    msg:"Invalid Email"
                })
            }

            if(user.activateToken != req.params.token){
                return res.json({
                    status:false,
                    msg:"Invalid Token"
                })
            }

            //Update user

            user.active = true ;
            user.save().then(u => {
                return res.json({
                    status:true,
                    msg:"Account Activated"
                })
            })

        })

    },


    register : (req,res,next) => {
        console.log("Registering user");


        //validation
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('phone', 'Phone is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var response = { status: false, errors: [] };
            errors.forEach(function (err) {
                response.errors.push(err.msg);
            });
            return res.json(response);
        }
        //End Validation


        //If Validation Success

        User.findOne({'email':req.body.email} ).then(r => {
                //check if user exsists
            if(r != null){
               return res.json({
                    status:false,
                    msg:"Email Already Exsists"
                })
            }

            let password = User.encrypt(req.body.password);
            let token = jwt.sign({email:req.body.email},config.activateToken);
            let newuser = new User({
               name:req.body.name,
               password:password,
               phone:req.body.phone,
               email:req.body.email,
               activateToken:token
           });
           newuser.save().then(r => {
               //send and email
               console.log("http://localhost:3010/user/activate/"+r.email+"/"+r.activateToken);
              res.json({
                  status:true,
                  msg:"User Successfully created"
              });
           }).catch(err => {
            res.json({
                status:false,
                msg:"User registration fail",
                data:err
            });
        })
           

        })



    },


    login : (req,res,next) => {
        console.log("Login");


        //validation
      
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var response = { status: false, errors: [] };
            errors.forEach(function (err) {
                response.errors.push(err.msg);
            });
            return res.json(response);
        }
        //End Validation

        //success validation
        User.findOne({email:req.body.email}).then(user => {
                if(user == null) {
                    return res.status(200).json({
                        success:false,
                        msg:"Incorrect Email Address"
                    });
                }
                //found user
                user.compare(req.body.password, user.password, (err,isMatch)=> {
                    
                    if (err) throw err;
                    
                    if(!isMatch){
                        return res.status(200).json({
                            success:false,
                            msg:"Incorrect Password"
                        });
                    }
                    //password success
                    //JWT
                    
                    const payload = {
                        _id: user._id
                      };
                      var token = jwt.sign(payload,config.userSecret, {
                        expiresIn: "30 days" // expires in 30 Days
                      })

                      res.status(200).json({
                        success:true,
                        msg:"Login Success",
                        token: token,
                        user:user.name
                    });
                })
                
            }).catch(err => {
                console.log(err);
                return res.status(200).json({
                    success:false,
                    msg:"Error Login",
                    err:err
                });
            })
    },

    get : (req,res) => {
        let id = req.decoded._id;
        User.findById(id).then(user => {
            res.send({msg:"Hey", payload: req.decoded, user:user});
        })
       
    }
}