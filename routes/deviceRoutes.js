'use strict'

var express = require('express');
var mongoose = require('mongoose');
var Devices = require('../models/devices');
var Sensors = require('../models/sensors');
var Verify = require('./verify'); //verify JWT


//create  device router
var deviceRouter = express.Router();

//exports deviceRouter
module.exports = deviceRouter;

//Device routes
deviceRouter.route('/')

//GET all devices from device owner with user id
.get(Verify.verifyOrdinaryUser, function(req,res){

  Devices.find({deviceOwner: req.decoded._doc._id})
    .populate('deviceOwner')
    .populate('sensors')
    .exec(function (err, device) {
      if (err) throw err;
      res.json(device);
  });
})

//POST a new device for user id
.post(Verify.verifyOrdinaryUser,function(req, res){
  req.body.deviceOwner = req.decoded._doc._id;
  console.log(req.body);
  Devices.create(req.body, function (err, device) {
          if (err) {
           res.status(500).json({error:err})
            //throw err;  //ADD REAL error handler
          } else {
          console.log('Device created!');
          res.status(200).json({"message": "device created", "data": device});
        }
      });
})

//DELETE all devices for user id ****
//SENSORS WILL HAVE INCORRECT BELONTO AFTER THIS DELETION//MAYBE NOT ALLOW THIS TO HAPPEN
.delete(Verify.verifyOrdinaryUser, function(req, res){
  Devices.remove({deviceOwner: req.decoded._doc._id}, function (err, resp) {
          if (err) throw err;
          res.json(resp);
      });
});

deviceRouter.route('/:deviceId')

//GET device with a specific device that belongs to owner with user_id
.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Devices.findOne({_id:req.params.deviceId, deviceOwner: req.decoded._doc._id})
        .populate('deviceOwner')
        .populate('sensors')
        .exec(function (err, device) {
          if (err) throw err;
          res.json(device);
      });
})

//DELETE device with deviceId and that belongs to user id
//SENSORS NEED TO BE RE ALLOCATED TO A NEW DEVICE BEFORE DELETION OR LEFT BELONINGTO NULL
.delete(Verify.verifyOrdinaryUser, function(req, res,next){
  Devices.remove({deviceOwner: req.decoded._doc._id,_id:req.params.deviceId}, function (err, resp) {
          if (err) throw err;
          res.json(resp);
      });
})


//PUT update device with deviceId and that belongs to user id
//NEED TO MAKE SURE IF SENSOR DATA IS UPDATED NEED TO BE UPDATED BY SENSOR AS WELL OR NOT ALLOW THIS TO HAPPEN
.put(Verify.verifyOrdinaryUser, function(req, res,next){
  Devices.findOneAndUpdate({deviceOwner: req.decoded._doc._id, _id:req.params.deviceId}, {
     $set: req.body
      }, {
        new: true
      }, function (err, device) {
        if (err) throw err;
        res.json(device);
      });
  })
