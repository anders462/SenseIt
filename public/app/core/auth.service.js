(function(){
'use strict';

  //Factory for all authentication API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('authFactory', authFactory);

    authFactory.$inject = ['BASE_URL', '$http', '$window'];

    function authFactory (BASE_URL, $http,$window){

      // Returns Login resource
      var login = function(creds) {
        return $http.post(BASE_URL +'users/login',creds);
      }

      // Returns register resource
      var register = function(creds) {
        console.log(creds);
        return $http.post(BASE_URL +'users/register',creds);
      }

      var update = function(creds) {
        return $http.put(BASE_URL +'users/update',creds,{headers: {"x-access-token": $window.localStorage.token}});
      }

      //Sets the token in localStorage
      var setToken = function(token){
        $window.localStorage.token = token;
      }

      //Gets token from localStorage
      var getToken = function(){
        if ($window.localStorage.token){
          return $window.localStorage.token
        } else {
          return null;
        }
      }

      //delete token and remove cashe from localStorage at logout
      var deleteToken = function(){
        $window.localStorage.removeItem("token");
        $window.localStorage.removeItem("cache");
        $window.localStorage.removeItem('currentUser');
      }

      var setCurrentUser = function(user) {
        console.log("setuser",user)
        $window.localStorage.currentUser = JSON.stringify(user);
      }

      var getCurrentUser = function(){
        if ($window.localStorage.currentUser){
          return JSON.parse($window.localStorage.currentUser);
        } else {
          return null;
        }
      }

      var setCurrentUserActivated = function(activated){
          var currentUser = JSON.parse($window.localStorage.currentUser);
          currentUser.activated = activated;
          $window.localStorage.currentUser = JSON.stringify(currentUser);

      }



      return {
        login: login,
        register: register,
        setToken: setToken,
        getToken: getToken,
        deleteToken: deleteToken,
        update: update,
        setCurrentUser: setCurrentUser,
        getCurrentUser: getCurrentUser,
        setCurrentUserActivated: setCurrentUserActivated
      };


    };








})();
