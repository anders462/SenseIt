(function(){

'use strict';

//events sub module routing
angular
  .module('SenseIt.events')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.events', {
          url: 'events',
          views: {
            'header': {
                templateUrl: 'app/common/header.html'
            },
            'content@': {
               templateUrl: 'app/dashboard/dashboard.html',
               controller:  'EventController',
               controllerAs: 'vm'
            },
            'footer' : {
              templateUrl: 'app/common/footer.html'
            }
          },
          data : {
            authenticate: true  //TRUE in non testing mode
          }

        });


      }


})();
