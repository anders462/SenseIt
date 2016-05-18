var express = require('express');
var mongoose = require('mongoose');
var Data = require('../models/data');
var Verify = require('./verify');



var dataRouter = express.Router();

//exports deviceRouter
module.exports = dataRouter;

dataRouter.route('/:sensorId')

//GET all data from sensor with sensorId
.get(Verify.verifyOrdinaryUser, function(req,res){

  Data.find({sensorId: req.params.sensorId},function (err, data) {
          if (err) throw err;
          res.json(data);
      });
})
