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
      type: String,
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

//create Sensor model
var Sensors = mongoose.model('Sensor', SensorSchema);

// Export Sensor Model
module.exports = Sensors;
