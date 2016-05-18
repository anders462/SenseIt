(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.sensors')
   .controller('SensorController',SensorController);

  SensorController.$inject = ['$location','ngDialog','$scope','sensorFactory','deviceFactory','authFactory'];

  function SensorController($location,ngDialog,$scope, sensorFactory, deviceFactory,authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  vm.sensorCreated = false;

  //opens up a Sensor Modal Dialog
    $scope.$on('$stateChangeSuccess',function(){

      $scope.sensorTitle ="Add your first Sensor";
      console.log("open Sensor")
        ngDialog.open({
           template: 'app/sensors/sensors.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'SensorController',
           controllerAs: 'vm',
           showClose: false,
           scope: $scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    });

    vm.addSensor = function(){
      var device = deviceFactory.getLastDevice();
      console.log(device._id);
      console.log("sensor",vm.sensorData);
      sensorFactory.addSensorToDevice(vm.sensorData,device._id)
        .then(function(response){
          $scope.sensorTitle ="Your MQTT Sensor topic";
          vm.sensorCreated = true;
          vm.sensorData = '';
          var user = authFactory.getCurrentUser();
          console.log("getuser",user)
          vm.sensorName = response.data.data.sensorName;
          vm.sensorTopic = "mysensor/" + user.username +'/' + response.data.data._id
          vm.error = false;
          console.log(response.data.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Sensor Name not unique!";
          } else {
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/');
    }

    vm.goToActivate = function(){
      ngDialog.close();
      $location.path('/activate');
    }


  }

})();
