'use strict';

angular.module('wptApp.environment', ['ngRoute'])
    .factory('EnvironmentDetails', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('http://localhost:1337/environment');
            },
            createNewEnvironment: function(name) {
                return $http.post('http://localhost:1337/environment', { name: name })
            },
            deleteEnvironment: function(envId) {
                return $http.delete('http://localhost:1337/environment/'+envId)
            }
        }
    }]).filter('capitalize', function() {

        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function(input, optional1, optional2) {
            //return JSON.stringify(JSON.parse(input), null, 2);
            var firstChar = input.charAt(0).toUpperCase();
            return(input.replace(input.charAt(0),firstChar))
        }

    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/environments', {
            templateUrl: 'environment/environments.html',
            controller: 'EnvironmentController'
        }).when('/environment/new', {
            templateUrl: 'environment/new.html',
            controller: 'EnvironmentController'
        });
    }])

.controller('EnvironmentController', ['$scope', 'EnvironmentDetails', '$filter', function($scope, EnvironmentDetails, $filter) {
    $scope.environments = "";
    $scope.message = "";
    $scope.isMsg = false;
    $scope.environmentForm = {
            loading: false
        },
        //This will fetch all the available environments
        EnvironmentDetails.get()
        .success(function(data) {
            $scope.environments = data;
        }).error(function(data) {
            console.log(data);
        });

    //This method will create new environment
    $scope.createNewEnvironment = function() {
        $scope.environmentForm.loading = true;
        EnvironmentDetails.createNewEnvironment($scope.createEnvironmentForm.name)
            .success(function(data) {
                $scope.isMsg = true;
                $scope.message = $filter('capitalize')($scope.createEnvironmentForm.name)+" environment successfully created"                
                $scope.createEnvironmentForm.name = "";
            }).error(function(data) {
                console.log(data);
            });
    },

    $scope.deleteEnvironment = function(envId, name){
        EnvironmentDetails.deleteEnvironment(envId)
            .success(function(data) {
                EnvironmentDetails.get()
        .success(function(data) {
            $scope.environments = data;
            $scope.isMsg = true;
            $scope.message = $filter('capitalize')(name)+" environment successfully deleted"                
        }).error(function(data) {
            console.log(data);
        });
            }).error(function(data) {
                console.log(data);
            });

    }


}]);
