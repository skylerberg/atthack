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
        Data.contact = {'first': null, 'last': null, 'phone': null};
        Data.car = {'vehicle_id': null, 'vin': null};
        var storage = window.localStorage;
        for (var key in Data.contact) {
            Data.contact[key] = storage.getItem(key) || '';
        }

        for (var key in Data.car) {
            Data.car[key] = storage.getItem(key) || '';
        }

        return Data;
    });

    app.service('TestService', function($location){
        status_code = "0"; //[untriggered, triggered,  started, processing, passed, failed]
        
        this.isCleared = function(){
            return (status_code === "0" || status_code === "4");
        };

        this.getStatusCode = function(){
            return status_code;
        };

        this.setStatusCode = function(s_code){
            status_code = s_code;
        };

        this.start = function(){
            status_code = "1";
            $location.path('/game');
        };
    });

    app.service('DummyRESTAPI', function(TestService){
        isConnected = false;

        this.getLoginStatus = function(){
            return isConnected;
        };

        this.login = function(username, password){
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

        this.lock = function(hard){
            if(hard)
                TestService.setStatusCode("1");
            return true;
        };

        this.unlock = function(){
            if (TestService.isCleared()){
                return true;
            }
            else{
                TestService.start();
                return false;
            }
        };
    });

    app.service('LockService', function(DummyRESTAPI){
        state = "0";

        this.getCurrentState = function(){
            return state;
        };

        this.setCurrentState = function(nState){
            state = nState;
        };

        this.switchHanlder = function(newState){
            /*
                2 -> 0 or 1 -> 0 will unlock the car
                0 -> 1 or 0 -> 2 will lock the car
            */
            if (newState === "0") {
                if(DummyRESTAPI.unlock()){
                    console.log('state change from', newState, state);
                    state = newState;
                }
            }else{
                if(DummyRESTAPI.lock(newState === "2")){
                    console.log('state change from', newState, state);
                    state = newState;
                }
            }
        };
    });

    app.controller('FlowController', function($scope, Data){

    });

    app.controller('ContactCtrl', function($scope, Data, $location) {
        $scope.contact = Data.contact;
        $scope.submitted = false;

        $scope.saveContact = function(contact){
            Data.contact = angular.copy(contact);
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
            for (var key in car) {
                window.localStorage.setItem(key, car[key]);
            }
            Data.car = angular.copy(car);
            $location.path('/contact');
        };

    });
    app.controller('MainCtrl', function($scope, Data, LockService) {
        $scope.switch = function ($event) {
            var button = $event.target;
            LockService.switchHanlder(button.getAttribute('data-state'));
        };
    });
    app.controller('GameCtrl', function($scope, Data) {

    });
    app.controller('ResultCtrl', function($scope, Data) {

    });
})();
