(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.home')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app', {
          url: '/',
          views: {
            'header': {
                templateUrl: 'app/common/header.html'
            },
            'content': {
               templateUrl: 'app/home/home.html',
               controller:  'HomeController',
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
