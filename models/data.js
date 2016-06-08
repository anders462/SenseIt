// For future use, Data for each sensor is now stored in sensor object,
//in future releases this will most likley change

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create sensor schema
var DataSchema = new Schema({
  sensorId: String,
  timeStamp: String,
  value: String
});

var Datas = mongoose.model('Data', DataSchema);

// make this available to our Node applications
module.exports = Datas;
