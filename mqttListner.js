

var mqtt = require('mqtt');
var Data = require('./models/data');
var Sensor = require('./models/sensors');

var topic_master_listen = "mysensor/#"  //topic:  mysensor/user_1/rc/device_02/humidity

module.exports = function(){
//Main client
var client = mqtt.connect('mqtt://m12.cloudmqtt.com:12337', {
  username: 'master',
  password: 'capstone_2016'
});


client.on('error', function(err){
  console.log("error",err);
});

client.on('connect', function () {
  client.subscribe(topic_master_listen);
  console.log('client connected');
});

client.on('message', function (topic, message) {
  var data = JSON.parse(message.toString());
  var sensorId = topic.split('/')[2];
  console.log(data)
  if (sensorId && data){
    console.log(typeof sensorId, sensorId)
    var timeStamp = new Date();
    //Saves all sensor data. IMPLEMENT AVERAGING ALGORITHM OR REDIS CASHING
      Sensor.findByIdAndUpdate(sensorId, {$push: {data:{value:data,timeStamp:timeStamp}}}, function(err,resp){
        if (err) console.log(err);
        console.log("saved");
   })
  }




});
};
