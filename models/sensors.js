var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create sensor schema
var SensorSchema = new Schema({
    sensorName: {
        type: String,
        required: true,
        unique: true
    },
    sensorOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    belongTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    address: {
        country: String,
        city: String,
        zipCode: String,
        streetName: String,
        houseNumber: String,
    },
    sensorInfo: {
        manufacturer: String,
        model: String,
    },
    data: [],
    sensorImage: {
        type: String,
    },
    sensorType: {
        type:{type:String, required:true},
        units: {type:String, required:true},
    },
  },
     {
    timestamps: true
});


var Sensors = mongoose.model('Sensor', SensorSchema);

// make this available to our Node applications
module.exports = Sensors;
