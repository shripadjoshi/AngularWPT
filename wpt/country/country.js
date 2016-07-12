'use strict';


angular.module('wptApp.country', ['ngRoute'])

.factory('CountryDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/country');
        },
        deleteCountry: function(countryId) {
            return $http.delete('http://localhost:1337/country/' + countryId)
        },
        createNewCountry: function(name) {
            return $http.post('http://localhost:1337/country', { name: name })
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
    $routeProvider.when('/countries', {
        templateUrl: 'country/countries.html',
        controller: 'CountryController'
    }).when('/country/new', {
        templateUrl: 'country/new.html',
        controller: 'CountryController'
    });
}])

.controller('CountryController', ['$rootScope', '$scope', '$routeParams', 'CountryDetails', '$filter',
    function($rootScope, $scope, $routeParams, CountryDetails, $filter) {
        $scope.countries = "";
        $scope.message = "";
        $scope.errMessage = "";
        //$scope.allEnvironments = [];
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isCountryExist = false;
        $scope.countryForm = {
                loading: false
            },

            $scope.selectedCountry = "";

        //This will fetch all the available countries
        CountryDetails.get()
            .success(function(data) {
                $scope.countries = data;
                var allCount = [];
                angular.forEach($scope.countries, function(obj) {
                    allCount.push(obj.name);
                });
                $scope.allCountries = allCount;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        $scope.deleteCountry = function(countryId, name) {
                CountryDetails.deleteCountry(countryId)
                    .success(function(data) {
                        CountryDetails.get()
                            .success(function(data) {
                                $scope.countries = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " country successfully deleted"
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

            //This will check the Country already present or not

            $scope.validateCountryExist = function(countryName) {
                if ($scope.allCountries.indexOf(countryName) > -1) {
                    $scope.isCountryExist = true;
                } else {
                    $scope.isCountryExist = false;
                }
            },


            //This method will create new country
            $scope.createNewCountry = function() {
                $scope.countryForm.loading = true;
                CountryDetails.createNewCountry($scope.createCountryForm.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createCountryForm.name) + " country successfully created"
                        $scope.createCountryForm.name = "";
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
