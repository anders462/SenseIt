(function(){

'use strict';

//logout sub module controller
angular
  .module('SenseIt.logout')
   .controller('LogoutController',LogoutController);

  LogoutController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function LogoutController($location,ngDialog,$scope, authFactory){

  var vm = this; //set vm (view model) to reference main object

  //opens up a Logout Modal Dialog
    $scope.$on('$stateChangeSuccess',function(){
      console.log("open logout")
        ngDialog.open({
           template: 'app/logout/logout.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'LogoutController',
           controllerAs: 'vm',
           showClose: false,
           closeByNavigation: true,
           closeByEscape: false
        })
    });


//close modal
    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }

//logs user out
    vm.doLogout = function(){
      authFactory.deleteToken();
      authFactory.cacheAuthState(false);
      ngDialog.close();
      $location.path('/');
    }


  }

})();
