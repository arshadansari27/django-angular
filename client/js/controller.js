var controllers = angular.module('exampleControllers', ['exampleServices']);

controllers.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService', 
    function ($scope, $rootScope, $location, AuthenticationService){
        AuthenticationService.clearCredentials();
        $scope.login  = function() {
            $scope.dataLoading = true;
            AuthenticationService.login($scope.username, $scope.password, function(response){
                if(response.auth_token != undefined && response.auth_token.length > 0) {
                    AuthenticationService.setCredentials($scope.username, response);
                    $scope.$emit('flashEmit', {message: 'Successfully logged in'});
                    $location.path('/');
                } else {
                    $scope.error = 'Invalid credentials';
                    $scope.dataLoading = false;
                }
            }, function(response){
                $scope.dataLoading = false;
                var errors = '';
                for(var key in response){
                    if (response[key] != undefined || response[key].length > 0) {
                        for(var i = 0; i < response[key].length; i++){
                            errors += '' + response[key][i] + ' ';
                        }
                    }
                }
                $scope.error =  errors;

            });
        };
    }
]);

controllers.controller('RegisterCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService', 
    function ($scope, $rootScope, $location, AuthenticationService){
        if (AuthenticationService.isLoggedIn()) {
            $scope.$emit('flashEmit', {message: 'Already logged in'});
            $location.path('/');
        }
        $scope.register = function() {
            $scope.error = null;
            $scope.dataLoading = true;
            if ($scope.password != $scope.confirm_password) {
                $scope.error = 'Invalid Password, do not match';
                return;
            } 
            AuthenticationService.register($scope.username, $scope.email, $scope.password, function(response){
                    $scope.$emit('flashEmit', {message: 'Successfully registered'});
                    $location.path('/login')
            }, function(response){
                $scope.dataLoading = false;
                var errors = '';
                for(var key in response){
                    if (response[key] != undefined || response[key].length > 0) {
                        for(var i = 0; i < response[key].length; i++){
                            errors += '' + response[key][i] + ' ';
                        }
                    }
                }
                $scope.error =  errors;
            });
        };
    }
]);

controllers.controller('PasswordCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService', 
    function ($scope, $rootScope, $location, AuthenticationService){
        if (!AuthenticationService.isLoggedIn()) {
            $scope.$emit('flashEmit', {message: 'You  must login first'});
            $location.path('/login');
        }
        $scope.change_password = function() {
            $scope.error = null;
            $scope.dataLoading = true;
            if ($scope.password != $scope.confirm_password) {
                $scope.error = 'Invalid Password, do not match';
                return;
            } 
            AuthenticationService.change_password($scope.old_password, $scope.password, function(response){
                    $location.path('/')
                    $scope.$emit('flashEmit', {message: 'Successfully changed password'});
            }, function(response){
                $scope.dataLoading = false;
                var errors = '';
                for(var key in response){
                    if (response[key] != undefined || response[key].length > 0) {
                        for(var i = 0; i < response[key].length; i++){
                            errors += '' + response[key][i] + ' ';
                        }
                    }
                }
                $scope.error =  errors;
            });
        };
    }
]);
controllers.controller('FlashCtrl', ['$scope', '$timeout',
    function ($scope, $timeout){
         $scope.$on('flashBroadcast', function(event, args) {
            console.log('Flashing: ' + args.message);
            $scope.flash = '' + args.message;
             $timeout(function() {
                $scope.flash = null;
                console.log('update with timeout fired')
            }, 3000);
        });   
    }
]);

controllers.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService){
        AuthenticationService.isLoggedIn();

        $scope.logout = function(){

            AuthenticationService.logout(function(response){
                $location.path('/login');
            });
        };

        AuthenticationService.me(
            function(response){
                $scope.email = response.email;
                $scope.username = response.username;
            },
            function(response){
                console.log('[*] Error: ' + JSON.stringify(response));
            }
        );

}]);
