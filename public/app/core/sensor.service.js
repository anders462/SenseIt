(function(){
'use strict';

  //Factory for all sensors API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('sensorFactory', sensorFactory);

    sensorFactory.$inject = [
    'BASE_URL',
    '$http',
    '$window',
    '$rootScope'
    ];

    function sensorFactory (BASE_URL, $http,$window,$rootScope){

      var sensorData = [];

      // Get all sensors belonging to user (USED)
      var getAllSensors = function() {
        return $http.get(BASE_URL +'sensors',{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Get all sensors belonging to user and sensorId
      var getDeviceSensors = function(deviceId) {
        return $http.get(BASE_URL +'sensors/' + deviceId,{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Adds new sensor for device, device is un connected Sensor (USED)
      var addSensorToDevice = function(sensorData,deviceId) {
        console.log("deviceid",deviceId)
        return $http.post(BASE_URL +'sensors/' + deviceId, sensorData,{headers: {"x-access-token": $window.localStorage.token}});
      }


      // Delete all sensors for device Should this be allowed????
      var deleteDeviceSensors = function(deviceId) {
        return $http.delete(BASE_URL +'sensors/' + deviceId,{headers: {"x-access-token": $window.localStorage.token}});
      }


      // Get sensor with deviceI and sensorId
      var getSensor = function(deviceId, sensorId) {
        return $http.get(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, {headers: {"x-access-token": $window.localStorage.token}});
      }


      // Delete sensor with sensorId (USED)
      var deleteSensor = function(deviceId, sensorId) {
        return $http.delete(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // update sensor with deviceId and sensorId (USED)
      var updateSensor = function(deviceId, sensorId, newSensorData) {
        return $http.put(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, newSensorData,{headers: {"x-access-token": $window.localStorage.token}});
      }


      //Creates a handler to listen to sensors updates
      var subscribe = function(scope, callback) {
              var handler = $rootScope.$on('sensorsUpdated', callback);
              scope.$on('$destroy', handler);
          }

      //notify change in devices
      var notify = function() {
              $rootScope.$emit('sensorsUpdated');
          }

      //cache sensor data
      var cacheSensors = function(data){
        console.log("cache sensors", data)
        //store in prop measures what sensor data is received
        //most recently
        data.forEach(function(sensor){
          if (sensor.data.length >0){
            sensor.measures = Object.keys(sensor.data[sensor.data.length-1].data);
            console.log("measures",sensor.measures);
          }
        })
        sensorData = data;
      }

      //get cached sensor data
      var getCachedSensors = function(){
        return sensorData;
      }

      //get cached sensor with ID
      var getCachedSensorId = function(id){

      return sensorData.filter(function(sensor){
          if (sensor._id == id){
            return sensor;
          }
        })
      }


      //make sensorFactory methods available
      return {
        getAllSensors: getAllSensors,
        getDeviceSensors: getDeviceSensors,
        addSensorToDevice: addSensorToDevice,
        deleteDeviceSensors: deleteDeviceSensors,
        getSensor: getSensor,
        deleteSensor: deleteSensor,
        updateSensor: updateSensor,
        subscribe: subscribe,
        cacheSensors: cacheSensors,
        getCachedSensors: getCachedSensors,
        notify: notify,
        getCachedSensorId: getCachedSensorId
      };


    };








})();
