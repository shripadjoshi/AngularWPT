'use strict';

// Declare app level module which depends on views, and components
angular.module('wptApp', [
  'ngRoute',
  'wptApp.country',
  'wptApp.region',
  'wptApp.category',
  'wptApp.environment',
  'wptApp.browser'
  
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
                templateUrl: 'environment/environments.html',
                controller: 'EnvironmentController',
            });
}]);
