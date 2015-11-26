var services = angular.module('exampleServices', ['ngCookies', 'ngResource']);


services.factory('AuthenticationService',
    ['$http', '$cookies', '$rootScope', '$timeout',
    function ($http, $cookies, $rootScope, $timeout) {
        var service = {};
 
        service.login = function (username, password, callback, fail_callback) {
 
            $http.post('/auth/login/', { username: username, password: password })
                .success(function (response) {
                    callback(response);
                })
                .error(function(response){
                    fail_callback(response);
                });
 
        };
        
        // Ideally should be part of User service, but for this case here it is.
        service.me = function (callback, fail_callback) {
 
            $http.get('/auth/me/', {})
                .success(function (response) {
                    callback(response);
                })
                .error(function(response){
                    fail_callback(response);
                });
 
        };

        service.logout = function (callback) {
 
            $http.post('/auth/logout/', {})
                .success(function (response) {
                    callback(response);
                });
 
        };


        service.register = function(username, email, password, callback, fail_callback) {
            $http.post('/auth/register/', { username: username, email: email, password: password })
                .success(function (response) {
                    callback(response);
                })
                .error(function(response){
                    fail_callback(response);
                });
        };

        service.change_password = function(old_password, new_password, callback, fail_callback) {
            $http.post('/auth/password/', { new_password: new_password, current_password: old_password })
                .success(function (response) {
                    callback(response);
                })
                .error(function(response){
                    fail_callback(response);
                });
        };
  
        service.setCredentials = function (username, response) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: response.auth_token
                }
            };
  
            $http.defaults.headers.common['Authorization'] = 'Token ' + response.auth_token; // jshint ignore:line
            $cookies.put('globals', JSON.stringify($rootScope.globals));
        };

        service.isLoggedIn = function () {
            $rootScope.globals = JSON.parse($cookies.get('globals') || "{}");
            //console.log('Checking is already logged in' + JSON.stringify($rootScope.globals));
            if ($rootScope.globals.currentUser != undefined 
                    && $rootScope.globals.currentUser.authdata != undefined
                    && $rootScope.globals.currentUser.authdata.length > 0) {
                return true;
            }
            return false; 
        };
  
        service.clearCredentials = function () {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = '';
        };
  
        return service;
    }
])
