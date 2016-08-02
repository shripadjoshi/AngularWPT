'use strict';

// Declare app level module which depends on views, and components
angular.module('wptApp', [
  'ngRoute',
  'toggle-switch',
  'wptApp.country',
  'wptApp.region',
  'wptApp.category',
  'wptApp.environment',
  'wptApp.browser',
  'wptApp.property',
  'wptApp.location',
  'wptApp.url'
  
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
                templateUrl: 'environment/environments.html',
                controller: 'EnvironmentController',
            });
}]);
