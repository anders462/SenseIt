(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.dashboard')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.dashboard', {
          url: 'dashboard',
          views: {
            'header': {
                templateUrl: 'app/common/header.html'
            },
            'content@': {
               templateUrl: 'app/dashboard/dashboard.html',
               controller:  'DashboardController',
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
