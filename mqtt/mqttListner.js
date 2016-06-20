

var mqtt = require('mqtt'); //mqtt third party lib
var config = require('./mqtt_config');
var average= require('./average');
var trigger = require('./trigger');

//mqtt master topic
var topic_master_listen = config.master_topic

module.exports = function(){
//Main MQTT client connect to server

var client = mqtt.connect(config.mqtt, {
  username: config.username_client,
  password: config.password_client
});

//on error handler
client.on('error', function(err){
  console.log("error",err);
});


//on connect handler >> subscribe to master_topic
client.on('connect', function () {
  client.subscribe(topic_master_listen);
  console.log('client connected');
});

//on message recieved handler
client.on('message', function (topic, message) {
//  console.log(message.toString())
  //parse message id and Data
  var data = JSON.parse(message.toString());
  var sensorId = topic.split('/')[2];
  if (sensorId && data){
    //Saves all sensor data to the correct db record
    //IMPLEMENT AVERAGING ALGORITHM OR REDIS CASHING future release
    var timeStamp = average.currentUnixTime();
    var sample = {data: data.d,time: timeStamp} //create sample obj
    //console.log(sensorId, sample);
    average.calcFloatingAvg(sensorId,sample);
    trigger.checkTrigger(sensorId,sample);
  }


 });
};
