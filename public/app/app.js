(function(){

'use strict';

//MAIN APP MODULE
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
.run(checkAuthentication)
.run(stateAuthenticate)
.config(configFunction);

checkAuthentication.$inject = ['authFactory'];

function checkAuthentication(authFactory){
  //AUTHENTICATION BEFORE STATE CHANGE
    authFactory.isAuthenticated()
    .then(function(resp){
      console.log(resp);
      authFactory.cacheAuthState(true); //SET CACHED AUTH STATE To TRUE
    })
    .catch(function(err){
      console.log("error",err);
      authFactory.cacheAuthState(false);

    });
}


stateAuthenticate.$inject = ['$rootScope', '$state', 'authFactory'];

function stateAuthenticate($rootScope, $state, authFactory){

//CHECK IF STATE CHANGE CAN OCCUR, ONLY IF ROUTE NOT PROTECTED OR
//ROUTE PROTECTED AND USER AUTHENTICATED
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    console.log("tostate", toState.data.authenticate);
    //AUTHENTICATION BEFORE STATE CHANGE
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
//IF NO OTHER ROUTES MATCHES GO TO /
     $urlRouterProvider.otherwise('/');

 }




})();
