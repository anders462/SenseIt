(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.register')
   .controller('DashboardController',DashboardController);

  DashboardController.$inject = [
    '$location',
    'deviceFactory',
    'sensorFactory',
    '$scope',
    'ngDialog',
    '$rootScope',
    'authFactory',
    'activateFactory'
  ];

  function DashboardController($location,deviceFactory,sensorFactory,$scope,ngDialog,$rootScope,authFactory,activateFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.deviceData = [];
  vm.sensorData = [];
  vm.messages = [];
  vm.activated = authFactory.getCurrentUser().activated;


  var countMessages = function(sensorData){
    vm.messages = sensorData.reduce(function(aggr,curr,index,arr){
      aggr = curr.data.length;
      console.log(aggr)
      return aggr;
    },0)
  }

  var updateDeviceModel = function(){
    deviceFactory.getDevices()
      .then(function(response){
        vm.deviceData = response.data;
        deviceFactory.cacheDevices(vm.deviceData);
      })
      .catch(function(err){
        console.log(err);
      })
  };

  var updateSensorModel = function(){
    sensorFactory.getAllSensors()
      .then(function(response){
        vm.sensorData = response.data;
        countMessages(vm.sensorData);
        sensorFactory.cacheSensors(vm.sensorData);
        console.log(vm.messages)
        console.log(vm.sensorData);
      })
      .catch(function(err){
        console.log(err);
      })
  };

  //get device and sensor objects
  $scope.$on('$stateChangeSuccess',function(){
///ADD LOADING.... Message
      updateDeviceModel();
      updateSensorModel();

    }());


    deviceFactory.subscribe($scope, function deviceUpdated() {
      console.log("devices updated emit received");
      updateDeviceModel();
     });

     sensorFactory.subscribe($scope, function sensorUpdated() {
       console.log("sensors updated emit received");
       updateSensorModel();
       console.log(sensorFactory.getCachedSensors);
      });

      activateFactory.subscribe($scope, function activationUpdated() {
        console.log("activation updated emit received");
        vm.activated = authFactory.getCurrentUser().activated;
       });





  }

})();
