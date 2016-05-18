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

      // Get all sensors belonging to user
      var getAllSensors = function() {
        return $http.get(BASE_URL +'sensors',{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Get all sensors belonging to user and sensorId
      var getDeviceSensors = function(deviceId) {
        return $http.get(BASE_URL +'sensors/' + deviceId,{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Adds new sensor for device
      var addSensorToDevice = function(sensorData,deviceId) {
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


      // Delete sensor with sensorId
      var deleteSensor = function(deviceId, sensorId) {
        return $http.delete(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // update sensor with deviceId and sensorId
      var updateSensor = function(deviceId, sensorId,newSensorData) {
        return $http.delete(BASE_URL + 'sensors/' + deviceId + "/" + sensorId, newSensorData,{headers: {"x-access-token": $window.localStorage.token}});
      }

      var cacheSensors = function(sensors){
        console.log("data to be cached",sensors)
        sensors.forEach(function(sensor){
          deviceData.push(sensor);
          notify();
        })
      }

      var getCachedSensors = function(){
        return sensorData;
      }

      //Creates a handler to listen to device updates
      var subscribe = function(scope, callback) {
              var handler = $rootScope.$oUpdated', callback);
              scope.$on('$destroy', handler);
          }
      //notify change in devices
      var notify = function(event) {
              $rootScope.$emit('devicesUpdated');
          }



      return {
        getAllSensors: getAllSensors,
        getDeviceSensors: getDeviceSensors,
        addSensorToDevice: addSensorToDevice,
        deleteDeviceSensors: deleteDeviceSensors,
        getSensor: getSensor,
        deleteSensor: deleteSensor,
        updateSensor: updateSensor
      };


    };








})();
