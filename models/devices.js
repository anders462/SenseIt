
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create device schema
var DeviceSchema = new Schema({
    deviceName: {
        type: String,
        required: true,
        unique: true
    },
    deviceOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    address: {
        country: String,
        city: String,
        zipCode: String,
        streetName: String,
        houseNumber: String,
        required: false
    },
    deviceInfo: {
        manufacturer: String,
        model: String,
        required: false
    },
    deviceImage: {
        type: String,
        required: false
    },
    deviceType: {
        type: String,
        required: false
    },
    sensors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Sensor'}]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Devices = mongoose.model('Device', DeviceSchema);

// make this available to our Node applications
module.exports = Devices;
