(function() {
    function LoginFailException(){
        this.name = "LoginFailException";
        this.message = "Invalid username or password";
    }
    LoginFailException.prototype = Error.prototype;

    function UnAuthorizedException(){
        this.name = "UnAuthorizedException";
        this.message = "UnAuthorized";
    }
    UnAuthorizedException.prototype = Error.prototype;

    var app = angular.module('myApp', ['onsen.directives', 'ngRoute']);

    app.config(function($routeProvider){
        $routeProvider.when('/contact', {
            templateUrl: 'contactSetup.html',
            controller: 'ContactCtrl',
        }).when('/sync', {
            templateUrl: 'syncTesla.html',
            controller: 'SyncCtrl'
        }).when('/main', {
            templateUrl: 'main.html',
            controller: 'MainCtrl'
        }).when('/game', {
            templateUrl: 'game.html',
            controller: 'GameCtrl'
        }).when('/result', {
            templateUrl: 'result.html',
            controller: 'ResultCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/sync'});
    });

    app.factory('Data', function() {
        var Data = {};
        Data.contact = {'first': '', 'last': '', 'phone': ''};
        var storage = window.localStorage;
        for (var key in Data.contact) {
            Data.contact[key] = window.localStorage.getItem(key) || '';
        }
        return Data;
    });

    app.service('DummyRESTAPI', function(){
        isConnected = false;

        this.getLoginStatus = function(){
            return isConnected;
        };

        this.login = function(username, password){
            console.log(password);
            if (username === 'sober' && password === 'drunk')
                isConnected = true;
            else
                throw new LoginFailException();
        };

        this.getCarList = function(){
            if( isConnected === false )
                throw new UnAuthorizedException();
            
            return [
                {
                    vehicle_id: '1234567890',
                    vin: 'KIJPLMNJU789HY7JK'
                },
                {
                    vehicle_id: '0987654321',
                    vin: 'ARJDLMNJU6Y9GY7JF'
                }
            ];
        };
    });

    app.controller('FlowController', function($scope){

    });

    app.controller('ContactCtrl', function($scope, Data, $location) {
        $scope.contact = Data.contact;
        $scope.submitted = false;

        $scope.saveContact = function(contact){
            Data.contact = angular.copy(contact);
            var storage = window.localStorage;
            for (var key in contact) {
                window.localStorage.setItem(key, contact[key]);
            }
            $location.path('/main');
        };
    });

    app.controller('SyncCtrl', function($scope, Data, DummyRESTAPI, $timeout, $location) {
        $scope.isConnected = DummyRESTAPI.getLoginStatus();
        $scope.findMyCar = function(){
            try{
                DummyRESTAPI.login($scope.username, $scope.password);
                $scope.isConnected = DummyRESTAPI.getLoginStatus();
                $scope.cars = DummyRESTAPI.getCarList();
                $timeout(function(){
                    $scope.$apply();
                });
            }catch(e){
                document.getElementById('error-msg').innerHTML = e.message;
            }
        };

        $scope.pickMyCar = function(car){
            window.localStorage.setItem('car', car.vehicle_id);
            $location.path('/contact');
        };

    });
    app.controller('MainCtrl', function($scope, Data) {

    });
    app.controller('GameCtrl', function($scope, Data) {

    });
    app.controller('ResultCtrl', function($scope, Data) {

    });
})();
