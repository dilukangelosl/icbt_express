var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var secret = require('../config/config').userSecret;

var middleware = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
   
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token,secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, msg: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
            next();
                
            }
        });

    }

    else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            msg: 'No token Provided.'
        });

    }

}

module.exports = middleware;