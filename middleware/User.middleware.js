var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var secret = require('../config/config').userSecret;
const QrModel = require('../models/Qr.model');
var middleware = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var qr = req.body.qr || req.query.qr;
    if (token && qr) {

        // verifies secret and checks exp
        jwt.verify(token,secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, msg: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                //token done 
                QrModel.findOne({token:qr}).then( u => {
                    if(u == null){
                        return res.status(403).send({
                            success: false,
                            msg: 'Invalid  QR'
                        });
                    }else{
                        next();
                    }
                })
                
            }
        });

    }

    else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            msg: 'No token or Qr provided.'
        });

    }

}

module.exports = middleware;