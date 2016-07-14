'use strict';


angular.module('wptApp.category', ['ngRoute'])

.factory('CategoryDetails', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('http://localhost:1337/category');
        },
        getCategory: function(categoryId) {
            return $http.get('http://localhost:1337/category/' + categoryId);
        },
        updateCategory: function(categoryId, name) {
            return $http.put('http://localhost:1337/category/' + categoryId, { name: name })
        },
        deleteCategory: function(categoryId) {
            return $http.delete('http://localhost:1337/category/' + categoryId)
        },
        createNewCategory: function(name) {
            return $http.post('http://localhost:1337/category', { name: name })
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
    $routeProvider.when('/categories', {
        templateUrl: 'category/categories.html',
        controller: 'CategoryController'
    }).when('/category/new', {
        templateUrl: 'category/new.html',
        controller: 'CategoryController'
    }).when('/category/edit/:id', {
        templateUrl: 'category/edit.html',
        controller: 'CategoryController'
    });
}])

.controller('CategoryController', ['$rootScope', '$scope', '$routeParams', 'CategoryDetails', '$filter',
    function($rootScope, $scope, $routeParams, CategoryDetails, $filter) {
        $scope.categories = "";
        $scope.message = "";
        $scope.errMessage = "";
        //$scope.allEnvironments = [];
        $scope.isMsg = false;
        $scope.isErr = false;
        $scope.isCategoryExist = false;
        $scope.categoryForm = {
                loading: false
            },

            $scope.selectedCategory = "";

        //This will fetch all the available categories
        CategoryDetails.get()
            .success(function(data) {
                $scope.categories = data;
                var allCount = [];
                angular.forEach($scope.categories, function(obj) {
                    allCount.push(obj.name);
                });
                $scope.allCategories = allCount;
            }).error(function(err) {
                $scope.message = "";
                $scope.isMsg = false;
                $scope.errMessage = err.message;
                $scope.isErr = true;
            });

        //This method will be used to fill up the edit form
        if ($routeParams.id != undefined) {
            CategoryDetails.getCategory($routeParams.id)
                .success(function(categoryData) {
                    $scope.selectedCategory = categoryData;
                }).error(function(err) {
                    $scope.message = "";
                    $scope.isMsg = false;
                    $scope.errMessage = err.message;
                    $scope.isErr = true;
                });
        }

        $scope.deleteCategory = function(categoryId, name) {
                CategoryDetails.deleteCategory(categoryId)
                    .success(function(data) {
                        CategoryDetails.get()
                            .success(function(data) {
                                $scope.categories = data;
                                $scope.isMsg = true;
                                $scope.message = $filter('capitalize')(name) + " category successfully deleted"
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

            $scope.editCategoryDetails = function(categoryId) {
                $scope.categoryForm.loading = true;
                CategoryDetails.updateCategory(categoryId, $scope.selectedCategory.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.selectedCategory.name) + " category successfully updated";
                        $scope.categoryForm.loading = false;
                        CategoryDetails.get()
                            .success(function(data) {
                                $scope.categories = data;
                                var allCount = [];
                                angular.forEach($scope.categories, function(obj) {
                                    allCount.push(obj.name);
                                });
                                $scope.allCategories = allCount;
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

            //This will check the Category already present or not

            $scope.validateCategoryExist = function(categoryName) {
                if ($scope.allCategories.indexOf(categoryName) > -1) {
                    $scope.isCategoryExist = true;
                } else {
                    $scope.isCategoryExist = false;
                }
            },


            //This method will create new category
            $scope.createNewCategory = function() {
                $scope.categoryForm.loading = true;
                CategoryDetails.createNewCategory($scope.createCategoryForm.name)
                    .success(function(data) {
                        $scope.isMsg = true;
                        $scope.message = $filter('capitalize')($scope.createCategoryForm.name) + " category successfully created"
                        $scope.createCategoryForm.name = "";
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
