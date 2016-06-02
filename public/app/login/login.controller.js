(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.login')
   .controller('LoginController',LoginController);

  LoginController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function LoginController($location,ngDialog,$scope, authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  if (authFactory.getCurrentUser()){
    vm.activated = authFactory.getCurrentUser().activated || false;
  } else {
    vm.activated =  false;
  }


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
          authFactory.cacheAuthState(true);
          vm.activated = authFactory.getCurrentUser().activated;
          console.log(response.data);
          $location.path('/dashboard');
        })
        .catch(function(err){
          console.log(err.data.err.message);
          vm.loginData = '';
          vm.error = true;
          vm.errorMessage = err.data.err.message;
        })


    }

    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/');
    }

    vm.openRegister = function(){
      ngDialog.close();
      $location.path('/register');
    }

    vm.doLogout = function(){
      authFactory.logout()
      .then(function(resp){
        console.log("logged out");
        authFactory.deleteToken();
      })
      .catch(function(err){
        console.log(err);
      })
    }


  }

})();
