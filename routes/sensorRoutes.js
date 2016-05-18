'use strict'

var express = require('express');
var mongoose = require('mongoose');
var Sensors = require('../models/sensors');
var Devices = require('../models/devices');
var Verify = require('./verify');



var sensorRouter = express.Router();

//exports dishRouter
module.exports = sensorRouter;



sensorRouter.route('/')

//GET all sensors belonging to user with user_id
.get(Verify.verifyOrdinaryUser, function(req,res){

  Sensors.find({sensorOwner: req.decoded._doc._id},function (err, device) {
          if (err) throw err;
          res.json(device);
      });
})

//POST to '/' could be implemented but as a sensor belongs to a deviceID  this route is excluded
//DELETE all sensors belonging to user with user_id and remove the sensor from devices could be done


sensorRouter.route('/:deviceId')

//GET all sensors for a deviceId and user id
.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Sensors.find({belongTo:req.params.deviceId,sensorOwner: req.decoded._doc._id})
        .populate('sensors')
        .exec(function (err, device) {
          if (err) throw err;
          res.json(device);
      });
})

//POST add sensor to deviceID
//UPDATES BOTH SENSOR AND DEVICE MODEL
.post(Verify.verifyOrdinaryUser,function(req, res){
  req.body.sensorOwner = req.decoded._doc._id;
  req.body.belongTo = req.params.deviceId;
  Sensors.create(req.body, function (err, sensor) {
          if (err) {
           res.status(500).json({error:err})
            //throw err;  //ADD REAL error handler
          } else {
          console.log('Sensor created!');
          Devices.findByIdAndUpdate(req.params.deviceId, {$push: {sensors:sensor._id}}, function (err,resp){
            if (err) {
             res.status(500).json({error:err})
              //throw err;  //ADD REAL error handler
            }
              res.status(200).json({"message": "sensor created", "data": sensor});
          })

        }
      });
})

//DELETE all sensorsId for deviceId
//UPDATES BOTH SENSOR AND DEVICE MODEL
.delete(Verify.verifyOrdinaryUser,function(req, res){
  Sensors.remove({belongTo:req.params.deviceId,sensorOwner: req.decoded._doc._id}, function (err, resp) {
    if (err) {
     res.status(500).json({error:err})
      //throw err;  //ADD REAL error handler
    } else {
        Devices.findOneAndUpdate({_id:req.params.deviceId},{$set:{sensors:[]}}, {new:true}, function (err, resp){
          if (err) {
           res.status(500).json({error:err})
            //throw err;  //ADD REAL error handler
          } else {
          res.json(resp);
        }
        })

    }
      });
});

sensorRouter.route('/:deviceId/:sensorId')

//GET  sensors with  deviceId and sensorId
.get(Verify.verifyOrdinaryUser,function(req, res){
  Sensors.find({belongTo:req.params.deviceId,sensorOwner: req.decoded._doc._id,_id: req.params.sensorId})
  .populate('data')
  .exec(function(err,sensor) {
    if (err) {
     res.status(500).json({error:err})
      //throw err;  //ADD REAL error handler
    } else {
          res.json(sensor);
        }
      });
})

//PUT update data for sensorId on deviceId
//NEED TO CHECK IF BELONGTO IS BEEING UPDATED AND IN THAT CASE UPDATE DEVICE MODEL AS WELL
.put(Verify.verifyOrdinaryUser,function(req, res){
  Sensors.findOneAndUpdate({sensorOwner: req.decoded._doc._id, _id:req.params.sensorId}, {
     $set: req.body
      }, {
        new: true
      }, function (err, device) {
        if (err) {
         res.status(500).json({error:err})
          //throw err;  //ADD REAL error handler
        } else {
        res.json(device);
      }
      });

})

//DELETE sensor with sensorId on deviceID
//UPDATES BOTH SENSOR AND DEVICE MODEL
.delete(Verify.verifyOrdinaryUser,function(req, res){

  Sensors.remove({sensorOwner: req.decoded._doc._id, _id:req.params.sensorId}, function(err,resp){
    if (err) {
     res.status(500).json({error:err})
      //throw err;  //ADD REAL error handler
    } else {
      Devices.findOneAndUpdate({_id:req.params.deviceId},{$pull:{sensors:req.params.sensorId}}, {new:true}, function (err, resp){
        if (err) {
         res.status(500).json({error:err})
          //throw err;  //ADD REAL error handler
        } else {
          res.json(resp);
        }
        })
    }          ///UPDATE DEVICE
  });
});
