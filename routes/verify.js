var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 36000 ///HIGH FOT TESTING Only
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
      //console.log(req.headers)
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
              console.log(err)
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return res.status(401).json({status:err.status, message: err.message });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({message: 'No token provided!'})
        //CREATE PROPER ERROR HANDLING
        // if there is no token
        // return an error
        // var err = new Error('No token provided!');
        // err.status = 403;
        // return next(err);
    }
};

exports.verifyAdmin = function(req,res,next){
              // check if the admin is set to true
              console.log(req.decoded._doc.admin)
              if(req.decoded._doc.admin === true){
                  //user is a authenticated admin >> allow user to proceed
                  next();
              } else {
                //not an admin creat and return error
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
              }

};
