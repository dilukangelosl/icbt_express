const CheckinModel = require('../models/checkin.model');
const QrModel = require('../models/Qr.model');
const crypto = require('crypto');
var qrlib = require('qr-image');
module.exports = {


    checkin: (req,res,next) => {
        let id = req.decoded._id;
        //validation
        req.checkBody('logtime', 'Log time is required').notEmpty();
       
        var errors = req.validationErrors();
        if (errors) {
            var response = { status: false, errors: [] };
            errors.forEach(function (err) {
                response.errors.push(err.msg);
            });
            return res.json(response);
        }
        //End Validation

        CheckinModel.findOne({user:id}, {}, { sort: { 'createdAt' : -1 } }).then(r => {
            console.log(r);
            if(r == null) {
                //first time checkin
                let checkin = new CheckinModel({
                    logdate: new Date().toString(),
                    checkin:req.body.logtime,
                    user:id
                });
                checkin.save().then(r => {
                    res.json({
                        status:true,
                        msg:"Checked in Success"
                    })
                })
            }else{
                //check if already checked out
                if(typeof r.checkout == "undefined"){
                    console.log("No checkout for this time");
                    r.checkout = req.body.logtime;
                    r.save().then(u => {
                        res.json({
                            status:true,
                            msg:"Checked out Success"
                        })
                    })
                }else{
                    //already checkedout // create a new checkin
                    let checkin = new CheckinModel({
                        logdate: new Date().toString(),
                        checkin:req.body.logtime,
                        user:id
                    });
                    checkin.save().then(r => {
                        res.json({
                            status:true,
                            msg:"Checked in Success"
                        })
                    })

                }
                
            }
        })


    },

    getAllcheckings:(req,res,next) => {
        let id = req.decoded._id;
        CheckinModel.find({user:id}, {}, { sort: { 'createdAt' : -1 } }).then(checkins => {
            res.json({
                status:true,
                data:checkins
            })
        })

    },

    generateQr:(req,res,next) => {
        QrModel.findOne({}, {}, { sort: { 'createdAt' : -1 } }).then(r => {
            let d = new Date().toString();
            const secret = "MhiV5rOE";
            const hash = crypto.createHmac('md5', secret)
            .update(d)
            .digest('hex');
            
            if(r == null){
                let qr = new QrModel({
                    token:hash
                });
                qr.save().then(u => {
                    res.json({
                        status:true,
                        msg:"Hash generated Success"
                    })
                })
            }else{
                r.token = hash;
                r.save().then(u => {
                    res.json({
                        status:true,
                        msg:"Hash generated Success"
                    })
                })
            }
        })
    },


    viewQr:(req,res,next) => {
        QrModel.findOne({}, {}, { sort: { 'createdAt' : -1 } }).then(r => {
            let token = r.token;
            var img = qrlib.image(token,{size:10});
            img.pipe(res);
        })
    }


    



}