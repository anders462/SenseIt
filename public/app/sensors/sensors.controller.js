(function(){

'use strict';

//sensor sub module controller
angular
  .module('SenseIt.sensors')
   .controller('SensorController',SensorController);

  SensorController.$inject = [
    '$location',
    'ngDialog',
    '$scope',
    'sensorFactory',
    'deviceFactory',
    'authFactory'];

  function SensorController($location,ngDialog,$scope, sensorFactory, deviceFactory,authFactory){

  var vm = this; //set vm (view model) to reference main object
  $scope.error = false; //reset error
  $scope.sensorCreated = false; //reset sensor created
  vm.activated = authFactory.getCurrentUser().activated; //get activation status
  //reset all objects
  $scope.sensorIdData = {};
  $scope.deviceData = [];
  vm.oldDeviceid="";
  $scope.sensorTopic ="";
  $scope.deviceId = "";

//get cached sensor with specific sensor id
  var getCachedSensorId = function(sensorId){
    vm.sensorData = sensorFactory.getCachedSensors();
    vm.sensorData.forEach(function(sensor){
      if(sensor._id == sensorId){
        console.log("cached sensorId", sensor)
        $scope.sensorIdData = sensor;
        //store what device sensor used to belongTo in case its changed
        vm.oldDeviceid = sensor.belongTo;
      }
    });
  }

//get all cached devices
  var getCachedDevices = function(){
    $scope.deviceData = deviceFactory.getCachedDevices();
  };

//open modal
    vm.openSensorModal = function(title){
      $scope.sensorCreated = false;
      $scope.deviceId = "";
      getCachedDevices();
      console.log("cashed",$scope.deviceData);
      $scope.sensorTitle = title || "Add New Sensor";
      console.log("open Sensor")
        ngDialog.open({
           template: 'app/sensors/sensors.modal.html',
           className: 'ngdialog-theme-default',
           showClose: false,
           scope: $scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }

//open edit modal
    vm.openSensorEditModal = function(sensorId){
      getCachedSensorId(sensorId);
      getCachedDevices();
      console.log($scope.sensorIdData)
          ngDialog.open({
             template: 'app/sensors/sensors.edit.modal.html',
             className: 'ngdialog-theme-default',
             showClose: false,
             scope:$scope,
             closeByNavigation: true,
             closeByEscape: false
          })
    }

//open delete modal
vm.openSensorDeleteModal = function(sensorId){
      console.log("open sensor",sensorId)
      getCachedSensorId(sensorId);
        ngDialog.open({
           template: 'app/sensors/sensor.delete.modal.html',
           className: 'ngdialog-theme-default',
           showClose: false,
           scope:$scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }


//add sensor function
    $scope.addSensor = function(sensorData,deviceId){
      console.log("sensor", deviceId, sensorData);

      sensorFactory.addSensorToDevice(sensorData,deviceId)
        .then(function(response){
          $scope.sensorTitle ="Your MQTT Sensor topic";
          $scope.sensorCreated = true;
          $scope.sensorIdData = '';
          var user = authFactory.getCurrentUser();
          sensorFactory.notify(); //notify sensor updated
          deviceFactory.notify(); //notify device updated
          console.log("getuser",user)
          vm.sensorName = response.data.data.sensorName;
          //display allowed topic for user after sensor is created
          $scope.sensorTopic = "mysensor/" + user.username +'/' + response.data.data._id
          console.log($scope.sensorTopic);
          $scope.error = false;
          console.log(response.data.data);
        })
        .catch(function(err){
          $scope.error = true;
          if(err.status == 500){
            $scope.errorMessage = "Sensor Name not unique!";
            console.log($scope.errorMessage, $scope.error);
          } else {
            $scope.errorMessage = err.data.message;
          }

        })
    }

//edit sensor
    $scope.editSensor = function(){
      delete $scope.sensorIdData.data;
      console.log("edited",$scope.sensorIdData);
      sensorFactory.updateSensor(vm.oldDeviceid,$scope.sensorIdData._id,$scope.sensorIdData)
        .then(function(response){
          $scope.sensorIdData = '';
          ngDialog.close();
          vm.error = false;
          sensorFactory.notify(); //notify sensor update
          deviceFactory.notify();// notify device update
          console.log("after sensor edit",response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Sensor Name is not unique!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

//delete sensor
    $scope.deleteSensor = function(deviceId,sensorId){
      ngDialog.close();
      console.log( "delete",deviceId,sensorId);
      sensorFactory.deleteSensor(deviceId,sensorId)
        .then(function(response){
          ngDialog.close();
          vm.error = false;
          sensorFactory.notify();//notify sensor update
          deviceFactory.notify();// notify device update
          console.log("after sensor delete",response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

//close modal
    vm.closeThisDialog = function(){
      ngDialog.close();
        $location.path('/dashboard');
    }

//go to activate route
    vm.goToActivate = function(){
      ngDialog.close();
      $location.path('/activate');
    }


//go to dashboard route
    $scope.goToDashboard = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }



  }

})();
