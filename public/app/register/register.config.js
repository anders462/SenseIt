(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.register')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.register', {
          url: 'register',
          views: {
            'header': {
                templateUrl: 'app/common/header.html'
            },
            'content@': {
               templateUrl: 'app/home/home.html',
               controller:  'RegisterController',
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
