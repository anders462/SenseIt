'use strict'

var express = require('express');
var mongoose = require('mongoose');
var Sensors = require('../models/sensors');
var Devices = require('../models/devices');
var Verify = require('./verify');



//create sensor router
var sensorRouter = express.Router();

//exports sensorRouter
module.exports = sensorRouter;


//sensor routes
sensorRouter.route('/')

//GET all sensors belonging to user with user_id
.get(Verify.verifyOrdinaryUser, function(req,res){

  Sensors.find({sensorOwner: req.decoded._doc._id})
        .populate('sensorOwner')
        .exec(function (err, device) {
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

//POST add sensor to deviceID, device 0 is un connected Sensor
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
          if (req.params.deviceId != 0) {
          Devices.findByIdAndUpdate(req.params.deviceId, {$push: {sensors:sensor._id}}, function (err,resp){
            if (err) {
             res.status(500).json({error:err})
              //throw err;  //ADD REAL error handler
            }
              res.status(200).json({"message": "sensor created", "data": sensor});
          })
        } else{
          res.status(200).json({"message": "sensor created not connected to device", "data": sensor});
        }


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
  Sensors.findOneAndUpdate({sensorOwner: req.decoded._doc._id, _id:req.params.sensorId}, {$set: req.body}, {new: true}, function (err, sensor) {
        if (err) {
         res.status(500).json({error:err})
       }

       if (req.params.deviceId != req.body.belongTo){
         //the deviceId for the Sensor has changed and changes need to
         //be done on the device(s) sensor Arrau
          if (req.params.deviceId !="0") {
            //the deviceId is not 0 means that sensor was connected with
            //actual device not a standalone sensor
            Devices.findOneAndUpdate({_id:req.params.deviceId},{$pull:{sensors:req.params.sensorId}}, {new:true}, function (err, resp){
              //delete sensorid from old device sensor array
                  if (err) {
                   res.status(500).json({message:"error at delete sensor", error:err})
                    //throw err;  //ADD REAL error handler
                  }
                  if (req.body.belongTo !="0"){
                  //add the new sensorid to the newly attached device's sensor array
                  Devices.findOneAndUpdate({_id:req.body.belongTo},{$push:{sensors:req.params.sensorId}}, {new:true}, function (err, resp){
                    if (err) {
                     res.status(500).json({message:"error at add sensor",error:err})
                      //throw err;  //ADD REAL error handler
                    }
                    res.json(resp);
                  });
                } else {
                  res.json(resp);
                }

                });

          } else {
            //sensor was standalone and the deviceId has changes, so its attached to a device
            //device need to add sensorid to its sensor array
            Devices.findOneAndUpdate({_id:req.body.belongTo},{$push:{sensors:req.params.sensorId}}, {new:true}, function (err, resp){
                  if (err) {
                   res.status(500).json({error:err})
                    //throw err;  //ADD REAL error handler
                  }
                  res.json(resp);
                });
          }
       } else {
         res.json(sensor);
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
    } else if (req.params.deviceId != "0") {
      Devices.findOneAndUpdate({_id:req.params.deviceId},{$pull:{sensors:req.params.sensorId}}, {new:true}, function (err, resp){
        if (err) {
         res.status(500).json({error:err})
          //throw err;  //ADD REAL error handler
        } else {
          res.json(resp);
        }
        })
    } else {
      res.json(resp);
    }

  });
});
