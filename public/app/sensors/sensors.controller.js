(function(){

'use strict';

//register page sub module
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
  vm.error = false;
  vm.sensorCreated = false;
  vm.activated = authFactory.getCurrentUser().activated;
  //vm.deviceData =[{deviceName:"sss",_id:1}];

  //opens up a Sensor Modal Dialog if new user
    // $scope.$on('$stateChangeSuccess',function(){
    //   console.log("activated",vm.activated);
    //
    //   if(!vm.activated){
    //     var title ="Add your first Sensor";
    //     vm.openSensorModal(title);
    //   }
    // });

    vm.openSensorModal = function(title){
     $scope.deviceData = deviceFactory.getCachedDevices();
      console.log("cashed",$scope.deviceData);
      $scope.sensorTitle = title || "Add New Sensor";
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

    }

    vm.openSensorListModal = function(title){
      $scope.sensorData = sensorFactory.getCachedSensors();
      console.log("open sensor list",$scope.sensorData )
        ngDialog.open({
           template: 'app/sensors/sensors.list.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'SensorController',
           controllerAs: 'vm',
           showClose: false,
           scope: $scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }

    vm.addSensor = function(){
      console.log("sensor",vm.sensorData);

      sensorFactory.addSensorToDevice(vm.sensorData,vm.deviceId)
        .then(function(response){
          $scope.sensorTitle ="Your MQTT Sensor topic";
          vm.sensorCreated = true;
          vm.sensorData = '';
          var user = authFactory.getCurrentUser();
          sensorFactory.notify()
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
        $location.path('/dashboard');
    }

    vm.goToActivate = function(){
      ngDialog.close();
      $location.path('/activate');
    }

    vm.goToDashboard = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }



  }

})();
