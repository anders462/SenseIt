(function(){

'use strict';

//device sub module controller
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
  vm.error = false; //reset errors
  vm.activated = authFactory.getCurrentUser().activated; //get cached status
  $scope.deviceIdData = {}; //reset deviceIdData


//retrieve chached device for specific id
    var getCachedDeviceId = function(deviceId){
      vm.deviceData = deviceFactory.getCachedDevices();
      vm.deviceData.forEach(function(device){
        if(device._id == deviceId){
          $scope.deviceIdData = device;
        }
      });
    }

//open device add modal
    vm.openDeviceModal = function(title){
      $scope.deviceTitle = title || "Add New Device";
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

//open devic edit modal
    vm.openDeviceEditModal = function(deviceId){
    getCachedDeviceId(deviceId);
    console.log($scope.deviceIdData)
        ngDialog.open({
           template: 'app/devices/devices.edit.modal.html',
           className: 'ngdialog-theme-default',
           showClose: false,
           scope:$scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }

  //open device delete modal
    vm.openDeviceDeleteModal = function(deviceId){
      console.log("open device",deviceId)
      getCachedDeviceId(deviceId);
        ngDialog.open({
           template: 'app/devices/devices.delete.modal.html',
           className: 'ngdialog-theme-default',
           showClose: false,
           scope:$scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }

//device delete function
    vm.addDevice = function(){
      console.log("device",vm.deviceData)
      deviceFactory.addDevice(vm.deviceData)
        .then(function(response){
          vm.deviceData = '';
          ngDialog.close();
          vm.error = false;
          deviceFactory.notify(); //notify of device change
          console.log(response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Device Name not unique!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

//edit device function
    $scope.editDevice = function(){
      ngDialog.close();
      deviceFactory.updateDevice($scope.deviceIdData._id,$scope.deviceIdData)
        .then(function(response){
          vm.deviceData = '';
          ngDialog.close();
          vm.error = false;
          deviceFactory.notify(); //notify od device change
          console.log("after device edit",response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Device Name not unique!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

//delete device function
    $scope.deleteDevice = function(){
      ngDialog.close();
      console.log( "delete",$scope.deviceIdData._id);
      deviceFactory.deleteDevice($scope.deviceIdData._id)
        .then(function(response){
          ngDialog.close();
          vm.error = false;
          deviceFactory.notify(); //notify of device change
          console.log("after device delete",response.data);
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


//close dialog function
    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }




  }

})();
