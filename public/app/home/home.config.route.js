(function(){

'use strict';

//home page sub module route config
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

        })
        .state('app.about', {
              url: 'about',
              views: {
                'header': {
                    templateUrl: 'app/common/header.html'
                },
                'content@': {
                   templateUrl: 'app/home/about.html',
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

            })
            .state('app.resources', {
                  url: 'resources',
                  views: {
                    'header': {
                        templateUrl: 'app/common/header.html'
                    },
                    'content@': {
                       templateUrl: 'app/home/resources.html',
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

                })
                .state('app.contact', {
                      url: 'contact',
                      views: {
                        'header': {
                            templateUrl: 'app/common/header.html'
                        },
                        'content@': {
                           templateUrl: 'app/home/contact.html',
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
