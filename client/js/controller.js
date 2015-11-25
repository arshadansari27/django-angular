var controllers = angular.module('exampleControllers', ['exampleServices']);

controllers.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService){
        AuthenticationService.clearCredentials();
        $scope.login  = function() {
            $scope.dataLoading = true;
            AuthenticationService.login($scope.username, $scope.password, function(response){
                if(response.auth_token != undefined && response.auth_token.length > 0) {
                    AuthenticationService.setCredentials($scope.username, response);
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
controllers.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService){
        AuthenticationService.isLoggedIn();

        $scope.logout = function(){

            AuthenticationService.logout(function(response){
                console.log(response);
                console.log(JSON.stringify(response));
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
