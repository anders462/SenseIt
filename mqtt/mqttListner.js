

var mqtt = require('mqtt');
var Data = require('../models/data'); //Data Model not used in current version
var Sensor = require('../models/sensors');
var config = require('./mqtt_config');
var unixTime = require('unix-time');


var topic_master_listen = "mysensor/#"  //topic:  mysensor/user_1/rc/device_02/humidity

module.exports = function(){
//Main client
var client = mqtt.connect('mqtt://m12.cloudmqtt.com:12337', {
  username: config.username_client,
  password: config.password_client
});


client.on('error', function(err){
  console.log("error",err);
});

client.on('connect', function () {
  client.subscribe(topic_master_listen);
  console.log('client connected');
});

client.on('message', function (topic, message) {
  console.log(message.toString())
  var data = JSON.parse(message.toString());
  var sensorId = topic.split('/')[2];
  if (sensorId && data){
    //Saves all sensor data. IMPLEMENT AVERAGING ALGORITHM OR REDIS CASHING
    var timeReg = new Date();
    var timeStamp = 1000*unixTime(timeReg);
    var sample = {data: data.d,time: timeStamp}
    console.log({data:data.d})
      Sensor.findByIdAndUpdate(sensorId, {$push: {data:sample}}, function(err,resp){
        if (err) console.log(err);
        // console.log(resp);
   })
  }




});
};
