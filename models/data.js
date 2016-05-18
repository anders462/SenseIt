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
