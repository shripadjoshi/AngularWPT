'use strict';


angular.module('wptApp.location', ['ngRoute'])

.factory('LocationDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/location');
        },
        getLocation: function(locationId) {
            return $http.get('http://localhost:1337/location/' + locationId);
        },
        updateLocation: function(locationId, locObject) {
            return $http.put('http://localhost:1337/location/' + locationId, { name: locObject.name, display_name: locObject.display_name, location_region: locObject.location_region.id, location_browser: locObject.location_browser.id, active: (locObject.active ? locObject.active : false) })
        },
        activeInactiveLocation: function(locationId, activeStatus) {
            return $http.put('http://localhost:1337/location/' + locationId, { active: activeStatus })
        },
        deleteLocation: function(locationId) {
            return $http.delete('http://localhost:1337/location/' + locationId)
        },
        createNewLocation: function(locObject) {
            return $http.post('http://localhost:1337/location', { name: locObject.name, display_name: locObject.display_name, location_region: locObject.location_region, location_browser: locObject.location_browser, active: (locObject.active ? locObject.active : false) })
        },
        searchLocations: function(field, searchParam) {
            return $http.get('http://localhost:1337/location/searchLocation?field='+field.toString()+'&q=' + searchParam);
        }
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
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isLocationExist = false;
        $scope.isDisplayNameExist = false;
        $scope.locationForm = {
                loading: false
            },

            $scope.selectedLocation = "";

        //This will fetch all the available locations
        LocationDetails.get()
            .success(function(data) {
                $scope.locations = data;
                var allCount = [];
                var allDisplayNames = [];
                angular.forEach($scope.locations, function(obj) {
                    allCount.push(obj.name);
                    allDisplayNames.push(obj.display_name);
                });
                $scope.allLocations = allCount;
                $scope.allDisplayNames = allDisplayNames;
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
        if ($routeParams.id != undefined) {
            LocationDetails.getLocation($routeParams.id)
                .success(function(locationData) {
                    $scope.selectedLocation = locationData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        $scope.deleteLocation = function(locationId, name) {
                LocationDetails.deleteLocation(locationId)
                    .success(function(data) {
                        LocationDetails.get()
                            .success(function(data) {
                                $scope.locations = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " location successfully deleted"
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

            $scope.editLocationDetails = function(locationId) {
                $scope.locationForm.loading = true;
                LocationDetails.updateLocation(locationId, $scope.selectedLocation)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedLocation.name) + " location successfully updated";
                        $scope.locationForm.loading = false;
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
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            },

            //This will check the Location already present or not

            $scope.validateLocationExist = function(locationName, field) {
                if (field == "name") {
                    if ($scope.allLocations.indexOf(locationName) > -1) {
                        $scope.isLocationExist = true;
                    } else {
                        $scope.isLocationExist = false;
                    }
                } else {
                    if ($scope.allDisplayNames.indexOf(locationName) > -1) {
                        $scope.isDisplayNameExist = true;
                    } else {
                        $scope.isDisplayNameExist = false;
                    }
                }

            },


            //This method will create new Location
            $scope.createNewLocation = function() {
                $scope.locationForm.loading = true;
                LocationDetails.createNewLocation($scope.createLocationForm)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createLocationForm.name) + " location successfully created"
                        $scope.createLocationForm = "";
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            },

            $scope.toggleLocationActivity = function(locationId, locationName, locationActive) {
                LocationDetails.activeInactiveLocation(locationId, locationActive)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')(locationName) + " location successfully updated"
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            },

            $scope.searchLocations = function() {
                LocationDetails.searchLocations($scope.field,$scope.search)
                    .success(function(data) {
                        
                        if(data.length > 0){
                            $scope.locations = data;
                            $scope.message = "";
                            $scope.isMsg = false;
                        }else{
                            $scope.message = "No data found for selected criterion";
                            $scope.isMsg = true;
                        }
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    })
            }


    }

]);
