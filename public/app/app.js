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
  'SenseIt.activate'

])
.config(configFunction);

 configFunction.$inject = ['$urlRouterProvider'];

 function configFunction($urlRouterProvider){

     $urlRouterProvider.otherwise('/');

 }



})();
