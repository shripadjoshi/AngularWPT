'use strict';

angular.module('wptApp.environment', ['ngRoute'])
    .factory('EnvironmentDetails', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('http://localhost:1337/environment');
            },
            getEnvironment: function(envId) {
                return $http.get('http://localhost:1337/environment/' + envId);
            },
            updateEnvironment: function(envId, name) {
                return $http.put('http://localhost:1337/environment/' + envId, { name: name })
            },
            createNewEnvironment: function(name) {
                return $http.post('http://localhost:1337/environment', { name: name })
            },
            deleteEnvironment: function(envId) {
                return $http.delete('http://localhost:1337/environment/' + envId)
            }
        }
    }]).filter('capitalize', function() {

        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function(input, optional1, optional2) {
            //return JSON.stringify(JSON.parse(input), null, 2);
            var firstChar = input.charAt(0).toUpperCase();
            return (input.replace(input.charAt(0), firstChar))
        }

    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/environments', {
            templateUrl: 'environment/environments.html',
            controller: 'EnvironmentController'
        }).when('/environment/new', {
            templateUrl: 'environment/new.html',
            controller: 'EnvironmentController'
        }).when('/environment/edit/:id', {
            templateUrl: 'environment/edit.html',
            controller: 'EnvironmentController'
        });
    }])

.controller('EnvironmentController', ['$rootScope', '$scope', '$routeParams', 'EnvironmentDetails', '$filter',
    function($rootScope, $scope, $routeParams, EnvironmentDetails, $filter) {
        $scope.environments = "";
        $scope.message = "";
        $scope.errMessage = "";
        //$scope.allEnvironments = [];
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isEnvExist = false;
        $scope.environmentForm = {
                loading: false
            },

            $scope.selectedEnvironment = "",
            //This will fetch all the available environments
            EnvironmentDetails.get()
            .success(function(data) {
                $scope.environments = data;
                var allEnvs = [];
                angular.forEach($scope.environments, function(obj) {
                    allEnvs.push(obj.name);
                });
                $scope.allEnvironments = allEnvs;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This method will be used to fill up the edit form
        if ($routeParams.id != undefined) {
            EnvironmentDetails.getEnvironment($routeParams.id)
                .success(function(envData) {
                    $scope.selectedEnvironment = envData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        //This will check the Environment already present or not

        $scope.validateEnvironmentExist = function(envName) {
            if ($scope.allEnvironments.indexOf(envName) > -1) {
                $scope.isEnvExist = true;
            } else {
                $scope.isEnvExist = false;
            }
        };

        //This method will create new environment
        $scope.createNewEnvironment = function() {
                $scope.environmentForm.loading = true;
                EnvironmentDetails.createNewEnvironment($scope.createEnvironmentForm.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createEnvironmentForm.name) + " environment successfully created"
                        $scope.createEnvironmentForm.name = "";
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            },

            $scope.deleteEnvironment = function(envId, name) {
                EnvironmentDetails.deleteEnvironment(envId)
                    .success(function(data) {
                        EnvironmentDetails.get()
                            .success(function(data) {
                                $scope.environments = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " environment successfully deleted"
                            }).error(function(err) {
                                $scope.message = "";
                                $scope.isMsg = false;
                                $scope.errMessage = err.message;
                                $scope.isErr = true;
                            });
                    }).error(function(data) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });

            },

            $scope.editEnvironmentDetails = function(envId) {
                $scope.environmentForm.loading = true;
                EnvironmentDetails.updateEnvironment(envId, $scope.selectedEnvironment.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedEnvironment.name) + " environment successfully updated";
                        $scope.environmentForm.loading = false;
                        EnvironmentDetails.get()
                            .success(function(data) {
                                $scope.environments = data;
                                var allEnvs = [];
                                angular.forEach($scope.environments, function(obj) {
                                    allEnvs.push(obj.name);
                                });
                                $scope.allEnvironments = allEnvs;
                            }).error(function(err) {
                                $scope.message = "";
                                $scope.isMsg = false;
                                $scope.errMessage = err.message;
                                $scope.isErr = true;
                            });
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            }



    }
]);
