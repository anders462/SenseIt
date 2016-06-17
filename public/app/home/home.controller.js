(function(){

'use strict';

//home page sub module controller
angular
  .module('SenseIt.home')
   .controller('HomeController',HomeController);

  HomeController.$inject = ['$location','ngDialog',"$scope",'authFactory'];

  function HomeController($location,ngDialog,$scope,authFactory){

  var vm = this; //set vm (view model) to reference main object
  var loggedIn = authFactory.getAuthState();
  console.log(loggedIn)


//get started function
//future version might have a logic to guide the user
//through the setup the first time
  vm.getStarted = function(){
    if (!loggedIn ){
      console.log("not loggedIn");
      $location.path('/register');

    } else {
      console.log("getstart");
      $location.path('/dashboard');
    }
}

vm.goToDashboard = function(){
  if (!loggedIn ){
    console.log("not loggedIn");
    $location.path('/login')
  } else {
    console.log("goToDashboard");
    $location.path('/dashboard');
  }

}
//open login module
vm.openModal = function(){
  console.log("open modal")
  ngDialog.open({
     template: 'app/login/login.modal.html',
     className: 'ngdialog-theme-default',
     controller: 'LoginController',
     controllerAs: 'vm',
     showClose: false,
     closeByNavigation: true,
     closeByEscape: false
  })

}


}

})();
