(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.devices')
   .controller('DeviceController',DeviceController);

  DeviceController.$inject = [
  '$location',
  'ngDialog',
  '$scope',
  'deviceFactory',
  'authFactory',
  '$rootScope'
];

  function DeviceController($location,ngDialog,$scope, deviceFactory, authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  vm.activated = false;

  //opens up a Device Modal Dialog if new user
    $scope.$on('$stateChangeSuccess',function(){
      vm.activated = authFactory.getCurrentUser().activated;
      console.log("activated",vm.activated);
      if(!vm.activated){
        $scope.deviceTitle ="Add your first Device";
        vm.openDeviceModal();
      }
    });

    vm.openDeviceModal = function(){
      console.log("open Device")
        ngDialog.open({
           template: 'app/devices/devices.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'DeviceController',
           controllerAs: 'vm',
           showClose: false,
           scope: $scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }

    vm.addDevice = function(){
      console.log("device",vm.deviceData)
      deviceFactory.addDevice(vm.deviceData)
        .then(function(response){
          vm.deviceData = '';
          ngDialog.close();
          vm.error = false;
          deviceFactory.cacheDevices([response.data.data])
          console.log(response.data);
          //$location.path('/sensors');
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Device Name not unique!";
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




  }

})();
