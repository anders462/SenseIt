(function(){
'use strict';

  //Factory for all sensors API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('activateFactory', activateFactory);

    activateFactory.$inject = ['BASE_URL', '$http', '$window'];

    function activateFactory (BASE_URL, $http,$window){


      // Get all sensors belonging to user
      var getAllSensors = function() {
        return $http.get(BASE_URL +'sensors',{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Get all sensors belonging to user and sensorId
      var getDeviceSensors = function(deviceId) {
        return $http.get(BASE_URL +'sensors/' + deviceId,{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Activate MQTT account
      var activate = function(mqttPassword) {
        return $http.post(BASE_URL +'activate',mqttPassword,{headers: {"x-access-token": $window.localStorage.token}});
      }


      // Delete all sensors for device Should this be allowed????
      var deleteDeviceSensors = function(deviceId) {
        return $http.delete(BASE_URL +'sensors/' + deviceId,{headers: {"x-access-token": $window.localStorage.token}});
      }


      // Get sensor with deviceI and sensorId
      var getSensor = function(deviceId, sensorId) {
        return $http.get(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, {headers: {"x-access-token": $window.localStorage.token}});
      }


      // Delete sensor with sensorId
      var deleteSensor = function(deviceId, sensorId) {
        return $http.delete(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // update sensor with deviceId and sensorId
      var updateSensor = function(deviceId, sensorId,newSensorData) {
        return $http.delete(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, newSensorData,{headers: {"x-access-token": $window.localStorage.token}});
      }





      return {
        activate: activate

      };


    };








})();
