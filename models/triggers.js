//for future use, triggers and alarms will be included in future release
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var triggerObj = {"5759defdf58e4339f30a2a0f":[{type:"temp",val:45,op:"less",status:false},{type:"temp",val:40,op:"larger",status:false}, {type:"humidity",val:73,op:"less",status:false}]};

// create sensor schema
var TriggerSchema = new Schema({
    triggerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true,
        unique:true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    triggers: [],
    log: []
  },
     {
    timestamps: true
});

//create Sensor model
var Sensors = mongoose.model('Trigger', TriggerSchema);

// Export Sensor Model
module.exports = Sensors;
