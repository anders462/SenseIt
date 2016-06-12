(function(){

'use strict';

//register page sub module controller
angular
  .module('SenseIt.register')
   .controller('RegisterController',RegisterController);

  RegisterController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function RegisterController($location,ngDialog,$scope,authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.registration = ''; //reset registration data
  vm.error = false; //reset error


//opens up a Register Modal Dialog
  $scope.$on('$stateChangeSuccess',function(){
    console.log("open register")
      ngDialog.open({
         template: 'app/register/register.modal.html',
         className: 'ngdialog-theme-default',
         controller: 'RegisterController',
         controllerAs: 'vm',
         showClose: false,
         closeByNavigation: true,
         closeByEscape: false
      })
  });

//register user
  vm.doRegister = function(){
    console.log("creds",vm.registration)
    authFactory.register(vm.registration)
      .then(function(response){
        vm.registration = '';
        ngDialog.close();
        vm.error = false;
        console.log(response);
        $location.path('/login'); //route to login

      })
      .catch(function(err){
        console.log(err.data.err.message);
        vm.registration = '';
        vm.error = true;
        vm.errorMessage = err.data.err.message;
      })

  }

//close modal
  vm.closeThisDialog = function(){
    ngDialog.close();
    $location.path('/');
  }

//open login modal
  vm.openLogin = function(){
    ngDialog.close();
    $location.path('/login');
  }

//validation settings
  vm.shouldValidate = function(name){
    var rules = {
      username: true,
      username_len: 3,
      password: true,
      password_len: 8,
      email: false,
      firstname: false,
      lastname: false
    }
    return rules[name];
  }



}


})();
