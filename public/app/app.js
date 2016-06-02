(function(){

'use strict';

angular
.module('SenseIt',[
  //Angular Modules
  'ngResource',
  //Third party Modules
  'ui.router',
  'ngDialog',
  //Own Modules
  'SenseIt.home',
  'SenseIt.core',
  'SenseIt.register',
  'SenseIt.login',
  'SenseIt.dashboard',
  'SenseIt.devices',
  'SenseIt.sensors',
  'SenseIt.activate',
  'SenseIt.logout'

])
.run(stateAuthenticate)
.config(configFunction);

stateAuthenticate.$inject = ['$rootScope', '$state', 'authFactory'];

function stateAuthenticate($rootScope, $state, authFactory){

  authFactory.isAuthenticated()
  .then(function(resp){
    console.log("isAuthenticated resp", true);
    authFactory.cacheAuthState(true);
  })
  .catch(function(err){
    authFactory.cacheAuthState(false);
    console.log("isAuthenticated resp", false);
  });

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    console.log("tostate", toState.data.authenticate);
    console.log("authState",authFactory.getAuthState());
    console.log("if statement",toState.data.authenticate && !authFactory.getAuthState())
    if (toState.data.authenticate && !authFactory.getAuthState()){
      // User isn’t authenticated
      console.log('transition to', toState);
      $state.transitionTo("app.login");
      event.preventDefault();
    }
  });
}


 configFunction.$inject = ['$urlRouterProvider'];

 function configFunction($urlRouterProvider){

     $urlRouterProvider.otherwise('/');

 }




})();
