
var express = require('express');
var mongoose = require('mongoose');
var Triggers = require('../models/triggers');
var triggerObj = require('../mqtt/trigger');
var Verify = require('./verify'); //verify JWT

triggerObj.loadTriggers(); //load trigger obj to memory

//{"triggerId":"5759defdf58e4339f30a2a0f","triggers": [{"type":"temp","val":45,"op":"less","status":false},{"type":"temp","val":40,"op":"larger","status":false}] }
//create  trigger router
var triggerRouter = express.Router();

//exports deviceRouter
module.exports = triggerRouter;

//Trigger routes
triggerRouter.route('/')

//GET all triggers/alarm for all sensors belonging to Owner
.get(Verify.verifyOrdinaryUser, function(req,res){

  Triggers.find({owner:req.decoded._doc._id})
    .populate('owner')
    .populate('triggerId')
    .exec(function (err, triggers) {
      if (err) throw err;
      res.json(triggers);
  });
})


//POST a new trigger for sensor with id
.post(Verify.verifyOrdinaryUser,function(req, res){
  req.body.owner = req.decoded._doc._id;
  //creates new record if exists otherwise update record
  Triggers.create(req.body, function (err, trigger) {
          if (err) {
           res.status(500).json({error:err})
            //throw err;  //ADD REAL error handler
          } else {
          triggerObj.loadTriggers(); //reload trigger model to memory
          res.status(200).json({"message": "trigger created", "data": trigger});
        }
      });
});


triggerRouter.route('/:id')

//GET  triggers/alarm for _id belonging to owner
.get(Verify.verifyOrdinaryUser, function(req,res){

  Triggers.find({owner:req.decoded._doc._id, _id: req.params.id,})
    .populate('owner')
    .exec(function (err, triggers) {
      if (err) throw err;
      res.json(triggers);
  });
})

//Put update trigger with _id belonging to owner
.put(Verify.verifyOrdinaryUser,function(req, res){
  req.body.owner = req.decoded._doc._id;
  //creates new record if exists otherwise update record
  Triggers.update({_id:req.params.id, owner:req.decoded._doc._id},req.body,{upsert: true, setDefaultsOnInsert: true}, function (err, trigger) {
          if (err) {
           res.status(500).json({error:err})
            //throw err;  //ADD REAL error handler
          } else {
          triggerObj.loadTriggers(); //reload trigger model to memory
          res.status(200).json({"message": "trigger updated", "data": trigger});
        }
      });
})

//Delete trigger with _id belonging to owner
.delete(Verify.verifyOrdinaryUser, function(req,res){
    Triggers.remove({_id:req.params.id, owner:req.decoded._doc._id }, function(err,doc){
      if (err) {
       res.status(500).json({error:err})
        //throw err;  //ADD REAL error handler
      } else {
      triggerObj.loadTriggers(); //reload trigger model to memory
      res.status(200).json({"message": "trigger with " + req.params.id + " deleted"});
    }

    })

});

// //DELETE all devices for user id ****
// //SENSORS WILL HAVE INCORRECT BELONTO AFTER THIS DELETION//MAYBE NOT ALLOW THIS TO HAPPEN
// .delete(Verify.verifyOrdinaryUser, function(req, res){
//   Devices.remove({deviceOwner: req.decoded._doc._id}, function (err, resp) {
//           if (err) throw err;
//           res.json(resp);
//       });
// });
//
// deviceRouter.route('/:deviceId')
//
// //GET device with a specific device that belongs to owner with user_id
// .get(Verify.verifyOrdinaryUser, function(req,res,next){
//   Devices.findOne({_id:req.params.deviceId, deviceOwner: req.decoded._doc._id})
//         .populate('deviceOwner')
//         .populate('sensors')
//         .exec(function (err, device) {
//           if (err) throw err;
//           res.json(device);
//       });
// })
//
// //DELETE device with deviceId and that belongs to user id
// //SENSORS NEED TO BE RE ALLOCATED TO A NEW DEVICE BEFORE DELETION OR LEFT BELONINGTO NULL
// .delete(Verify.verifyOrdinaryUser, function(req, res,next){
//   Devices.remove({deviceOwner: req.decoded._doc._id,_id:req.params.deviceId}, function (err, resp) {
//           if (err) throw err;
//           res.json(resp);
//       });
// })
//
//
// //PUT update device with deviceId and that belongs to user id
// //NEED TO MAKE SURE IF SENSOR DATA IS UPDATED NEED TO BE UPDATED BY SENSOR AS WELL OR NOT ALLOW THIS TO HAPPEN
// .put(Verify.verifyOrdinaryUser, function(req, res,next){
//   Devices.findOneAndUpdate({deviceOwner: req.decoded._doc._id, _id:req.params.deviceId}, {
//      $set: req.body
//       }, {
//         new: true
//       }, function (err, device) {
//         if (err) throw err;
//         res.json(device);
//       });
//   })
