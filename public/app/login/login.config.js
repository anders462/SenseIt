(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.login')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.login', {
          url: 'login',
          views: {
            'header': {
                templateUrl: 'app/common/header.html'
            },
            'content@': {
               templateUrl: 'app/login/login.html',
               controller:  'LoginController',
               controllerAs: 'vm'
            },
            'footer' : {
              templateUrl: 'app/common/footer.html'
            }
          },
          data : {
            authenticate: false
          }

        });



      }




})();
