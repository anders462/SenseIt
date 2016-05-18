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
    '$rootScope'
  ];

  function DashboardController($location,deviceFactory,sensorFactory,$scope,ngDialog,$rootScope){

  var vm = this; //set vm (view model) to reference main object
  vm.deviceData = 0;
  vm.sensorData = 0;
  vm.messages = 0;

  var countMessages = function(sensorData){
    vm.messages = sensorData.reduce(function(aggr,curr,index,arr){
      aggr = curr.data.length;
      console.log(aggr)
      return aggr;
    },0)
  }


  //get device and sensor objects
    $scope.$on('$stateChangeSuccess',function(){
///ADD LOADING.... Message
      deviceFactory.getDevices()
        .then(function(response){
          vm.deviceData = response.data;
          deviceFactory.cacheDevices(vm.deviceData);
        })
        .catch(function(err){
          console.log(err);
        })
        sensorFactory.getAllSensors()
          .then(function(response){
            vm.sensorData = response.data;
            countMessages(vm.sensorData);
            console.log(vm.messages)
            console.log(vm.sensorData);
          })
          .catch(function(err){
            console.log(err);
          })
    }());

    deviceFactory.subscribe($scope, function deviceUpdated() {
      console.log("emit received");
      vm.deviceData = deviceFactory.getCachedDevices();
     });








  }

})();
