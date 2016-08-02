'use strict';


angular.module('wptApp.url', ['ngRoute'])

.factory('UrlDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/url');
        },
        getUrl: function(urlId) {
            return $http.get('http://localhost:1337/url/' + urlId);
        },
        updateUrl: function(urlId, locObject) {
            return $http.put('http://localhost:1337/url/' + urlId, { name: locObject.name, display_name: locObject.display_name, url_region: locObject.url_region.id, url_browser: locObject.url_browser.id, active: (locObject.active ? locObject.active : false) })
        },
        activeInactiveurl: function(urlId, activeStatus) {
            return $http.put('http://localhost:1337/url/' + urlId, { active: activeStatus })
        },
        deleteUrl: function(urlId) {
            return $http.delete('http://localhost:1337/url/' + urlId)
        },
        createNewUrl: function(locObject) {
            return $http.post('http://localhost:1337/url', { name: locObject.name, display_name: locObject.display_name, url_region: locObject.url_region, url_browser: locObject.url_browser, active: (locObject.active ? locObject.active : false) })
        },
        searchUrls: function(field, searchParam) {
            return $http.get('http://localhost:1337/url/searchUrl?field='+field.toString()+'&q=' + searchParam);
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
    $routeProvider.when('/urls', {
        templateUrl: 'url/urls.html',
        controller: 'UrlController'
    }).when('/url/new', {
        templateUrl: 'url/new.html',
        controller: 'UrlController'
    }).when('/url/edit/:id', {
        templateUrl: 'url/edit.html',
        controller: 'UrlController'
    });
}])

.controller('UrlController', ['$rootScope', '$scope', '$routeParams', 'UrlDetails', 'PropertyDetails', 'CategoryDetails', 'CountryDetails', 'EnvironmentDetails', '$filter',
    function($rootScope, $scope, $routeParams, UrlDetails, PropertyDetails, CategoryDetails, CountryDetails, EnvironmentDetails, $filter) {
        $scope.urls = "";
        $scope.properties = "";
        $scope.categories = "";
        $scope.countries = "";
        $scope.environments = "";
        $scope.message = "";
        $scope.errMessage = "";
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isUrlExist = false;
        $scope.urlForm = { loading: false};
        $scope.selectedUrl = "";

        //This will fetch all the available urls
        UrlDetails.get()
            .success(function(data) {
                $scope.urls = data;
                var allCount = [];
                var allDisplayNames = [];
                angular.forEach($scope.urls, function(obj) {
                    allCount.push(obj.name);
                    allDisplayNames.push(obj.display_name);
                });
                $scope.allurls = allCount;
                $scope.allDisplayNames = allDisplayNames;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This will fetch all the available properties
        PropertyDetails.get()
            .success(function(data) {
                $scope.properties = data;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This will fetch all the available categories
        CategoryDetails.get()
            .success(function(data) {
                $scope.categories = data;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This will fetch all the available countries
        CountryDetails.get()
            .success(function(data) {
                $scope.countries = data;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

                //This will fetch all the available environments
        EnvironmentDetails.get()
            .success(function(data) {
                $scope.environments = data;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This method will be used to fill up the edit form
        if ($routeParams.id != undefined) {
            UrlDetails.getUrl($routeParams.id)
                .success(function(urlData) {
                    $scope.selectedUrl = urlData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        $scope.deleteUrl = function(urlId, name) {
                UrlDetails.deleteUrl(urlId)
                    .success(function(data) {
                        UrlDetails.get()
                            .success(function(data) {
                                $scope.urls = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " url successfully deleted"
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

            $scope.editUrlDetails = function(urlId) {
                $scope.urlForm.loading = true;
                UrlDetails.updateUrl(urlId, $scope.selectedUrl)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedUrl.name) + " url successfully updated";
                        $scope.urlForm.loading = false;
                        UrlDetails.get()
                            .success(function(data) {
                                $scope.urls = data;
                                var allCount = [];
                                angular.forEach($scope.urls, function(obj) {
                                    allCount.push(obj.name);
                                });
                                $scope.allUrls = allCount;
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

            //This will check the Url already present or not

            $scope.validateUrlExist = function(urlName, field) {
                if (field == "name") {
                    if ($scope.allUrls.indexOf(urlName) > -1) {
                        $scope.isUrlExist = true;
                    } else {
                        $scope.isUrlExist = false;
                    }
                } else {
                    if ($scope.allDisplayNames.indexOf(urlName) > -1) {
                        $scope.isDisplayNameExist = true;
                    } else {
                        $scope.isDisplayNameExist = false;
                    }
                }

            },


            //This method will create new Url
            $scope.createNewUrl = function() {
                $scope.urlForm.loading = true;
                UrlDetails.createNewUrl($scope.createUrlForm)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createUrlForm.name) + " url successfully created"
                        $scope.createUrlForm = "";
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            },

            $scope.toggleUrlActivity = function(urlId, urlName, urlActive) {
                UrlDetails.activeInactiveUrl(urlId, urlActive)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')(urlName) + " url successfully updated"
                        $scope.errMessage = "";
                        $scope.isErr = false;
                    }).error(function(err) {
                        $scope.message = "";
                        $scope.isMsg = false;
                        $scope.errMessage = err.message;
                        $scope.isErr = true;
                    });
            },

            $scope.searchUrls = function() {
                UrlDetails.searchUrls($scope.field,$scope.search)
                    .success(function(data) {
                        
                        if(data.length > 0){
                            $scope.urls = data;
                            $scope.message = "";
                            $scope.isMsg = false;
                        }else{
                            $scope.urls = "";
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
