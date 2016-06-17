(function(){

'use strict';

//Activate sub module Controller
angular
  .module('SenseIt.activate')
   .controller('ActivateController',ActivateController);

  ActivateController.$inject = [
  '$location',
  'ngDialog',
  '$scope',
  'activateFactory',
  'authFactory',
  'mqttFactory'
];


  function ActivateController($location,ngDialog, $scope, activateFactory,authFactory,mqttFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false; //reset error messages for dialogs
  vm.activated = authFactory.getCurrentUser().activated; //get activation status from cache
  vm.mqttUsername = authFactory.getCurrentUser().username; //get username for cache
  vm.mqttPassword = '*******' //set masked PASSWORD

    // call createMqttClient with 10 sec delay to take into
    //acount creation delay on cloudmqtt side as well, make sure
    //retry doesn't happen to often at connection fail or loss
    vm.connectMqtt = function(){
      var timeOut = setTimeout(function(){
        clearTimeout(timeOut);
        mqttFactory.createMqttClient()
      },10000);
    };

    //if customer is already activated try to connect to mqtt service
    if(vm.activated){
      vm.connectMqtt();
    }


//open Activate modal
    vm.openActivationModal = function(){
      $scope.activateTitle ="MQTT Account Settings";
      //console.log("open Activate")
        ngDialog.open({
           template: 'app/activate/activate.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'ActivateController',
           controllerAs: 'vm',
           showClose: false,
           scope: $scope,
           closeByNavigation: true,
           closeByEscape: false
        });
    };


//activate user account on CloudMqtt
//ADD MIN PASSWORD LENGTH of 8
    vm.activate = function(){
      //console.log("creds",vm.activationData)
      activateFactory.activate(vm.activationData)
        .then(function(response){
          vm.activationData = ''; //reset activation data
          vm.error = false;
          vm.activated = response.data.resp.activated; //set activation status
          //console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated); //cache status in factory
          activateFactory.notify(); //notify of activation change so other controller can update.
          $scope.activateSubTitle ="Account is activated";
          vm.connectMqtt(); //try to connect to Mqtt service
          console.log(response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            console.log(err)
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)
            //vm.errorMessage = err.data.message;
          }
          vm.activationData = '';
          vm.error = true;
        })
    }

//deActivate == delete CloudMqtt account
    vm.deActivate = function(){
      activateFactory.deActivate()
        .then(function(response){
          vm.error = false;
          vm.activated = response.data.resp.activated;
          //console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated); //cache status change
          activateFactory.notify(); //notify status change
        })
        .catch(function(err){
          if(err.status == 500){
            console.log(err)
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)
          }
          vm.error = true;
        })
    }

//close dialogs
    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }

//go to dashboard
    vm.goToDashboard = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }

//subscribe to connectionLost event listner
    mqttFactory.subscribe($scope, function connectionLost() {
      console.log("connectionLost");
      vm.connectMqtt();
    });



  }

})();
