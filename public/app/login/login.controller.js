(function(){

'use strict';

//login sub module controller
angular
  .module('SenseIt.login')
   .controller('LoginController',LoginController);

  LoginController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function LoginController($location,ngDialog,$scope, authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false; //reset error
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

    

//login user
    vm.doLogin = function(){
      //console.log("creds",vm.loginData)
      authFactory.login(vm.loginData)
        .then(function(response){
          vm.loginData = '';
          ngDialog.close();
          vm.error = false;
          authFactory.setToken(response.data.token); //set token in localstorage
          authFactory.setCurrentUser(response.data.user); //set current user
          authFactory.cacheAuthState(true);
          vm.activated = authFactory.getCurrentUser().activated;
          console.log(response.data);
          $location.path('/dashboard'); //go to dashbaord
        })
        .catch(function(err){
          console.log(err);
          vm.loginData = '';
          vm.error = true;
          vm.errorMessage = "Ops something went wrong!";
        })


    }

//close modal
    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/');
    }

//open regsiter modal
    vm.openRegister = function(){
      ngDialog.close();
      $location.path('/register');
    }


//logout user
    vm.doLogout = function(){
      authFactory.logout()
      .then(function(resp){
        console.log("logged out");
        authFactory.deleteToken(); //deletes token, currentuser etc
      })
      .catch(function(err){
        console.log(err);
      })
    }


  }

})();
