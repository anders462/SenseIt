(function(){
'use strict';

  //Factory for all events API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('eventFactory', eventFactory);

    eventFactory.$inject = [
    'BASE_URL',
    '$http',
    '$window',
    '$rootScope'
    ];

    function eventFactory (BASE_URL, $http,$window,$rootScope){

      var eventData = null;

      // Get all events belonging to user
      var getAllEvents = function() {
        return $http.get(BASE_URL +'triggers/',{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Adds new event for sensor
      var addEvent = function(eventInfo) {
        return $http.post(BASE_URL +'triggers/', eventInfo, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // Get event with id belonging to user
      var getEvent = function(id) {
        return $http.get(BASE_URL +'triggers/' + id, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // Delete event with _id
      var deleteEvent = function(id) {
        return $http.delete(BASE_URL + 'triggers/' + id, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // update event with _id
      var updateEvent = function(eventInfo) {
        return $http.put(BASE_URL + 'triggers/' + id, eventInfo,{headers: {"x-access-token": $window.localStorage.token}});
      }


      //Creates a handler to listen to event updates
      var subscribe = function(scope, callback) {
              var handler = $rootScope.$on('eventsUpdated', callback);
              scope.$on('$destroy', handler);
          }

      //notify change in events
      var notify = function() {
              $rootScope.$emit('eventsUpdated');
          }

      //cache event data
      var cacheEvents = function(data){
        console.log("cache event", data)
        eventData = data;
      }

      //get cached event data
      var getCachedEvents = function(){
        return eventData;
      }

      //get cached sensor with ID
      var getCachedEventId = function(id){

      return eventData.filter(function(eventId){
          if (eventId._id == id){
            return eventId;
          }
        })
      }


      //make eventFactory methods available
      return {
        getAllEvents: getAllEvents,
        addEvent: addEvent,
        getEvent: getEvent,
        deleteEvent: deleteEvent,
        updateEvent: updateEvent,
        subscribe: subscribe,
        cacheEvents: cacheEvents,
        getCachedEvents: getCachedEvents,
        notify: notify,
        getCachedEventId: getCachedEventId
      };


    };








})();
