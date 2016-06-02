var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');


//TODO: CHECK SO THAT TOKEN OBJECT IS NOT CONTAINING PASSWORDS ETC
/* GET users listing. */

router.get('/',Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req, res) { ///ADD VERIFY ADMIN TO DO GET OF ALL USERS!!
    User.find({}, function(err,user){
      if(err){
        return res.status(500).json({err:err});
      }
      console.log("test")
      res.json(user);
    })

  });

  router.get('/me',Verify.verifyOrdinaryUser, function(req, res) { ///ADD VERIFY ADMIN TO DO GET OF ALL USERS!!
      User.findOne({_id:req.decoded._doc._id}, function(err,user){
        if(err){
          return res.status(500).json({err:err});
        }
        console.log("test")
        var userData = {
          "username":user.username,
          "token":user.token,
          "activated": user.activated,
          "mqtt":user.cmq_password
        }
        res.json(userData);
      })

    });


  router.post('/register', function(req, res) {
    console.log(req.body);
      User.register(new User({ username : req.body.username }),
          req.body.password, function(err, user) {
          if (err) {
              return res.status(500).json({err: err});
          }
              if(req.body.firstname) {
              user.firstname = req.body.firstname;
          }
          if(req.body.lastname) {
              user.lastname = req.body.lastname;
          }
          if(req.body.email){
            user.email = req.body.email
          }

            user.save(function(err,user) {
              passport.authenticate('local')(req, res, function () {
                  return res.status(200).json({status: 'Registration Successful!'});
              });
          });
      });
  });

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        user: {
          username: user.username,
          activated: user.activated,
        }
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
    status: 'Bye!'
  });
});


router.put('/update', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      user.setPassword(req.body.newPassword, function(){
            user.save();
            res.status(200).json({
                  status: 'Password update successful!',
                  success: true
            })
        });

    });
  })(req,res,next);
});
  //   var user = {username: req.body.username,password: req.body.password};
  //
  //   req.logIn(user, function(err) {
  //     if (err) {
  //       return res.status(500).json({
  //         err: 'Could not log in user'
  //       });
  //     }
  //   res.status(200).json({
  //            status: 'Password update successful!',
  //            success: true
  //      })
  //   // });
  //
  //   // user.setPassword(req.body.newPassword, function(){
  //   //     user.save();
  //   //     res.status(200).json({
  //   //           status: 'Password update successful!',
  //   //           success: true
  //   //     })
  //   });
  // });
// });

router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

  router.get('/facebook/callback', function(req,res,next){
    passport.authenticate('facebook', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          err: info
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }
                var token = Verify.getToken(user);
                res.status(200).json({
          status: 'Login successful!',
          success: true,
          token: token
        });
      });
    })(req,res,next);
  });

module.exports = router;
