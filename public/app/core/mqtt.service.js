(function(){

'use strict'

//Factory for mqtt connection, part of sub module "core"
angular
.module('SenseIt.core')
  .factory('mqttFactory', mqttFactory);

  mqttFactory.$inject = [
    '$http',
    '$window',
    '$rootScope',
    'authFactory'
  ];

function mqttFactory ($http, $window, $rootScope, authFactory){

var mqttData = {};


//create mqtt client using paho-mqtt client lib
 var createMqttClient = function() {
  //Note: NEED TO ENCRYPT MQTT password
  //Gets credentials for mqtt account
   authFactory.getMe()
    .then(function(resp){
      //call connection function
      connect(resp.data);
    })
    .catch(function(err){
      console.log(err);
    })

var connect = function(creds){
  // Create a client instance
  //DEV USE PORT 32337
  //Note: ADD port TO CONSTANTS
 var client = new Paho.MQTT.Client("m12.cloudmqtt.com", 35588,"web_" + parseInt(Math.random() * 100, 10));
  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // set connections options
  var options = {
    useSSL: true,
    userName: creds.username,
    password: creds.mqtt,
    onSuccess:onConnect,
    onFailure:doFail
  }

  // connect the client
  client.connect(options);
  //define my allowed topics
  var topic_all_mine = "mysensor/" + creds.username + "/#";
  // console.log(topic_all_mine)

  // called when the client connects
  function onConnect() {
  // Once a connection has been made, make a subscription.

    console.log("onConnect");
    //subscribe to my allowed topics
    client.subscribe(topic_all_mine);
  }

  //NEED TO TRY TO RECONNECT if fail
  function doFail(e){
    console.log("onFail err", e);
    notify();
  }

  //NEED TO TRY TO RECONNECT if lose connection
  // notify() called when the client loses its connection
  function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        notify();
      }
   }

  // called when a message arrives
  function onMessageArrived(message) {
      mqttData = message;
      notifyMqtt(message);
    }
 }
}

//get cached mqtt data
function getCachedMqttData(){
  return mqttData;
}


//Creates a handler to listen to connectionLost
var subscribe = function(scope, callback) {
        var handler = $rootScope.$on('connectionLost', callback);
        scope.$on('$destroy', handler);
    }

//notify change connectionLost
var notify = function() {
        $rootScope.$emit('connectionLost');
    }

    //Creates a handler to listen to connectionLost
    var subscribeMqtt = function(scope, callback) {
            var handler = $rootScope.$on('messageRecieved', callback);
            scope.$on('$destroy', handler);
        }

    //notify change connectionLost
    var notifyMqtt = function(message) {
            $rootScope.$emit('messageRecieved', message );
        }

    //methods available from mqttFactory
      return {
        createMqttClient: createMqttClient, //creates new client
        subscribe: subscribe, //subscribe handler for rootScope changes
        subscribeMqtt: subscribeMqtt,
        getCachedMqttData: getCachedMqttData
      };



};

})();
