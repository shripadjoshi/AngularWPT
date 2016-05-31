'use strict';

// Declare app level module which depends on views, and components
angular.module('wptApp', [
  'ngRoute',
  'wptApp.environment'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  /*.when('/', {
                templateUrl: '/app/index.html',
                controller: 'EnvironmentController',

            })*/
  .otherwise({redirectTo: '/environments'});
}]);
