'use strict';


angular.module('wptApp.region', ['ngRoute'])

.factory('RegionDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/region');
        },
        getRegion: function(regionId) {
            return $http.get('http://localhost:1337/region/' + regionId);
        },
        updateRegion: function(regionId, name) {
            return $http.put('http://localhost:1337/region/' + regionId, { name: name })
        },
        deleteRegion: function(regionId) {
            return $http.delete('http://localhost:1337/region/' + regionId)
        },
        createNewRegion: function(name) {
            return $http.post('http://localhost:1337/region', { name: name })
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

.filter('joinArrayValues', function() {
    // In the return function, we must pass in a single parameter which will be the data we will work on.
    // We have the ability to support multiple other parameters that can be passed into the filter optionally
    return function(input, optional1, optional2) {
        var values = []
        angular.forEach(input, function(obj) {
            values.push(obj.name);
        });
        return (values.join());
    }
})

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/regions', {
        templateUrl: 'region/regions.html',
        controller: 'RegionController'
    }).when('/region/new', {
        templateUrl: 'region/new.html',
        controller: 'RegionController'
    }).when('/region/edit/:id', {
        templateUrl: 'region/edit.html',
        controller: 'RegionController'
    });
}])

.controller('RegionController', ['$rootScope', '$scope', '$routeParams', 'RegionDetails', '$filter',
    function($rootScope, $scope, $routeParams, RegionDetails, $filter) {
        $scope.regions = "";
        $scope.message = "";
        $scope.errMessage = "";
        //$scope.allEnvironments = [];
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isRegionExist = false;
        $scope.regionForm = {
                loading: false
            },

            $scope.selectedRegion = "";

        //This will fetch all the available regions
        RegionDetails.get()
            .success(function(data) {
                $scope.regions = data;
                var allCount = [];
                angular.forEach($scope.regions, function(obj) {
                    allCount.push(obj.name);
                });
                $scope.allRegions = allCount;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This method will be used to fill up the edit form
        if ($routeParams.id != undefined) {
            RegionDetails.getRegion($routeParams.id)
                .success(function(regionData) {
                    $scope.selectedRegion = regionData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        $scope.deleteRegion = function(regionId, name) {
                RegionDetails.deleteRegion(regionId)
                    .success(function(data) {
                        RegionDetails.get()
                            .success(function(data) {
                                $scope.regions = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " region successfully deleted"
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

            $scope.editRegionDetails = function(regionId) {
                $scope.regionForm.loading = true;
                //var originalRegion = $scope.selectedRegion.name;
                RegionDetails.updateRegion(regionId, $scope.selectedRegion.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedRegion.name) + " region successfully updated";
                        $scope.regionForm.loading = false;
                        //var allCont = $scope.allRegions;
                        //console.log(originalRegion);
                        //console.log($.inArray(originalRegion, allCont));
                        RegionDetails.get()
                            .success(function(data) {
                                $scope.regions = data;
                                var allCount = [];
                                angular.forEach($scope.regions, function(obj) {
                                    allCount.push(obj.name);
                                });
                                $scope.allRegions = allCount;
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

            //This will check the Region already present or not

            $scope.validateRegionExist = function(regionName) {
                if ($scope.allRegions.indexOf(regionName) > -1) {
                    $scope.isRegionExist = true;
                } else {
                    $scope.isRegionExist = false;
                }
            },


            //This method will create new region
            $scope.createNewRegion = function() {
                $scope.regionForm.loading = true;
                RegionDetails.createNewRegion($scope.createRegionForm.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createRegionForm.name) + " region successfully created"
                        $scope.createRegionForm.name = "";
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            }



    }

]);
