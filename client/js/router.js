var exampleApp = angular.module('exampleApp', ['ngRoute', 'ngCookies', 'exampleControllers']);

exampleApp.config(
[
    '$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            }).
            when('/register', {
                templateUrl: 'partials/register.html',
                controller: 'RegisterCtrl'
            }).
            when('/password', {
                templateUrl: 'partials/change-password.html',
                controller: 'PasswordCtrl'
            }).
            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }
]);

exampleApp.run(['$rootScope', '$location', '$cookies', '$http',
    function ($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = JSON.parse($cookies.get('globals') || "{}");
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && $location.path() !== '/register' && !$rootScope.globals.currentUser) {

                $rootScope.$emit('flashEmit', {message: 'Please log in first'});
                $location.path('/login');
            }
        });

        $rootScope.$on('flashEmit', function(event, args) {
            $rootScope.$broadcast('flashBroadcast', args);
        });
    }
]);
