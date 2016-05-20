(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.activate')
   .controller('ActivateController',ActivateController);

  ActivateController.$inject = ['$location','ngDialog','$scope','activateFactory','authFactory'];

  function ActivateController($location,ngDialog, $scope, activateFactory,authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  vm.activated = false;

  //opens up a Activate Modal Dialog
    // $scope.$on('$stateChangeSuccess',function(){
    //
    //
    // });

    vm.openActivationModal = function(){
      $scope.activateTitle ="Activate your MQTT account";
      console.log("open Activate")
        ngDialog.open({
           template: 'app/activate/activate.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'ActivateController',
           controllerAs: 'vm',
           showClose: false,
           scope: $scope,
           closeByNavigation: true,
           closeByEscape: false
        })
    }
///ADD MIN PASSWORD LENGTH of 8
    vm.activate = function(){
      console.log("creds",vm.activationData)
      activateFactory.activate(vm.activationData)
        .then(function(response){
          vm.activationData = '';
          vm.error = false;
          vm.activated = response.data.resp.activated;
          console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated);
          activateFactory.notify();
          vm.mqttUsername = response.data.resp.username;
          vm.mqttPassword = response.data.resp.cmq_password;
          $scope.activateTitle ="Congrates your account is now activated";

          console.log(response.data);
          //$location.path('/dashboard')
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

    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }

    vm.goToDashboard = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }



  }

})();
