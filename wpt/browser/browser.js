'use strict';


angular.module('wptApp.browser', ['ngRoute'])

.factory('BrowserDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/browser');
        },
        getBrowser: function(browserId) {
            return $http.get('http://localhost:1337/browser/' + browserId);
        },
        updateBrowser: function(browserId, name) {
            return $http.put('http://localhost:1337/browser/' + browserId, { name: name })
        },
        deleteBrowser: function(browserId) {
            return $http.delete('http://localhost:1337/browser/' + browserId)
        },
        createNewBrowser: function(name) {
            return $http.post('http://localhost:1337/browser', { name: name })
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
    $routeProvider.when('/browsers', {
        templateUrl: 'browser/browsers.html',
        controller: 'BrowserController'
    }).when('/browser/new', {
        templateUrl: 'browser/new.html',
        controller: 'BrowserController'
    }).when('/browser/edit/:id', {
        templateUrl: 'browser/edit.html',
        controller: 'BrowserController'
    });
}])

.controller('BrowserController', ['$rootScope', '$scope', '$routeParams', 'BrowserDetails', '$filter',
    function($rootScope, $scope, $routeParams, BrowserDetails, $filter) {
        $scope.browsers = "";
        $scope.message = "";
        $scope.errMessage = "";
        //$scope.allEnvironments = [];
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isBrowserExist = false;
        $scope.browserForm = {
                loading: false
            },

            $scope.selectedBrowser = "";

        //This will fetch all the available browsers
        BrowserDetails.get()
            .success(function(data) {
                $scope.browsers = data;
                var allCount = [];
                angular.forEach($scope.browsers, function(obj) {
                    allCount.push(obj.name);
                });
                $scope.allBrowsers = allCount;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This method will be used to fill up the edit form
        if ($routeParams.id != undefined) {
            BrowserDetails.getBrowser($routeParams.id)
                .success(function(browserData) {
                    $scope.selectedBrowser = browserData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        $scope.deleteBrowser = function(browserId, name) {
                BrowserDetails.deleteBrowser(browserId)
                    .success(function(data) {
                        BrowserDetails.get()
                            .success(function(data) {
                                $scope.browsers = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " browser successfully deleted"
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

            $scope.editBrowserDetails = function(browserId) {
                $scope.browserForm.loading = true;
                //var originalBrowser = $scope.selectedBrowser.name;
                BrowserDetails.updateBrowser(browserId, $scope.selectedBrowser.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedBrowser.name) + " browser successfully updated";
                        $scope.browserForm.loading = false;
                        //var allCont = $scope.allBrowsers;
                        //console.log(originalBrowser);
                        //console.log($.inArray(originalBrowser, allCont));
                        BrowserDetails.get()
                            .success(function(data) {
                                $scope.browsers = data;
                                var allCount = [];
                                angular.forEach($scope.browsers, function(obj) {
                                    allCount.push(obj.name);
                                });
                                $scope.allBrowsers = allCount;
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

            //This will check the Browser already present or not

            $scope.validateBrowserExist = function(browserName) {
                if ($scope.allBrowsers.indexOf(browserName) > -1) {
                    $scope.isBrowserExist = true;
                } else {
                    $scope.isBrowserExist = false;
                }
            },


            //This method will create new browser
            $scope.createNewBrowser = function() {
                $scope.browserForm.loading = true;
                BrowserDetails.createNewBrowser($scope.createBrowserForm.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createBrowserForm.name) + " browser successfully created"
                        $scope.createBrowserForm.name = "";
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
