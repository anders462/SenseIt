(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.register')
   .controller('LoginController',LoginController);

  LoginController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function LoginController($location,ngDialog,$scope, authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;

  //opens up a Login Modal Dialog
    $scope.$on('$stateChangeSuccess',function(){
      console.log("open login")
        ngDialog.open({
           template: 'app/login/login.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'LoginController',
           controllerAs: 'vm',
           showClose: false,
           closeByNavigation: true,
           closeByEscape: false
        })
    });

    vm.doLogin = function(){
      console.log("creds",vm.loginData)
      authFactory.login(vm.loginData)
        .then(function(response){
          vm.loginData = '';
          ngDialog.close();
          vm.error = false;
          authFactory.setToken(response.data.token);
          authFactory.setCurrentUser(response.data.user);
          console.log(response.data);
          $location.path('/devices');
        })
        .catch(function(err){
          console.log(err.data.err.message);
          vm.loginData = '';
          vm.error = true;
          vm.errorMessage = err.data.err.message;
        })
      // ngDialog.close();
      // $location.path('/dashboard');

    }

    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/');
    }

    vm.openRegister = function(){
      ngDialog.close();
      $location.path('/register');
    }


  }

})();
