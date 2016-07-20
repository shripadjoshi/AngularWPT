'use strict';


angular.module('wptApp.location', ['ngRoute'])

.factory('LocationDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/location');
        }//,
        /*getProperty: function(propertyId) {
            return $http.get('http://localhost:1337/property/' + propertyId);
        },
        updateProperty: function(propertyId, name, description) {
            return $http.put('http://localhost:1337/property/' + propertyId, { name: name, description: description })
        },
        deleteProperty: function(propertyId) {
            return $http.delete('http://localhost:1337/property/' + propertyId)
        },
        createNewProperty: function(name, description) {
            return $http.post('http://localhost:1337/property', { name: name, description: description })
        }*/
    }
}])

.filter('capitalize', function() {

    // In the return function, we must pass in a single parameter which will be the data we will work on.
    // We have the ability to support multiple other parameters that can be passed into the filter optionally
    return function(input, optional1, optional2) {
        //return JSON.stringify(JSON.parse(input), null, 2);
        var firstChar = input.charAt(0).toUpperCase();
        return (input.replace(input.charAt(0), firstChar))
    }

})

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/locations', {
        templateUrl: 'location/locations.html',
        controller: 'LocationController'
    }).when('/location/new', {
        templateUrl: 'location/new.html',
        controller: 'LocationController'
    }).when('/location/edit/:id', {
        templateUrl: 'location/edit.html',
        controller: 'LocationController'
    });
}])

.controller('LocationController', ['$rootScope', '$scope', '$routeParams', 'LocationDetails', 'RegionDetails', 'BrowserDetails', '$filter',
    function($rootScope, $scope, $routeParams, LocationDetails, RegionDetails, BrowserDetails, $filter) {
        $scope.locations = "";
        $scope.regions = "";
        $scope.browsers = "";
        $scope.message = "";
        $scope.errMessage = "";
        //$scope.allEnvironments = [];
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isLocationExist = false;
        $scope.locationForm = {
                loading: false
            },

            $scope.selectedLocation = "";

        //This will fetch all the available locations
        LocationDetails.get()
            .success(function(data) {
                $scope.locations = data;
                var allCount = [];
                angular.forEach($scope.locations, function(obj) {
                    allCount.push(obj.name);
                });
                $scope.allLocations = allCount;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

            //This will fetch all the available regions
        RegionDetails.get()
            .success(function(data) {
                $scope.regions = data;                
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This will fetch all the available browsers
        BrowserDetails.get()
            .success(function(data) {
                $scope.browsers = data;                
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This method will be used to fill up the edit form
        /*if ($routeParams.id != undefined) {
            PropertyDetails.getProperty($routeParams.id)
                .success(function(propertyData) {
                    $scope.selectedProperty = propertyData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        $scope.deleteProperty = function(propertyId, name) {
                PropertyDetails.deleteProperty(propertyId)
                    .success(function(data) {
                        PropertyDetails.get()
                            .success(function(data) {
                                $scope.properties = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " property successfully deleted"
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

            $scope.editPropertyDetails = function(propertyId) {
                $scope.propertyForm.loading = true;
                PropertyDetails.updateProperty(propertyId, $scope.selectedProperty.name, $scope.selectedProperty.description)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedProperty.name) + " property successfully updated";
                        $scope.propertyForm.loading = false;
                        PropertyDetails.get()
                            .success(function(data) {
                                $scope.properties = data;
                                var allCount = [];
                                angular.forEach($scope.properties, function(obj) {
                                    allCount.push(obj.name);
                                });
                                $scope.allproperties = allCount;
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
            },

            //This will check the Property already present or not

            $scope.validatePropertyExist = function(propertyName) {
                if ($scope.allproperties.indexOf(propertyName) > -1) {
                    $scope.isPropertyExist = true;
                } else {
                    $scope.isPropertyExist = false;
                }
            },


            //This method will create new property
            $scope.createNewProperty = function() {
                $scope.propertyForm.loading = true;
                PropertyDetails.createNewProperty($scope.createPropertyForm.name, $scope.createPropertyForm.description)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createPropertyForm.name) + " property successfully created"
                        $scope.createPropertyForm.name = "";
                        $scope.createPropertyForm.description = "";
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            }*/



    }

]);
