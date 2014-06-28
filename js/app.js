(function() {
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

        $routeProvider.otherwise({redirectTo: '/contact'});
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

    app.controller('ContactCtrl', function($scope, Data, $location) {
        $scope.contact = Data.contact;
        $scope.submitted = false;

        $scope.saveContact = function(contact){
            Data.contact = angular.copy(contact);
            var storage = window.localStorage;
            for (var key in contact) {
                window.localStorage.setItem(key, contact[key]);
            }
            $location.path('/sync');
        };
    });

    app.controller('SyncCtrl', function($scope, Data) {

    });
    app.controller('MainCtrl', function($scope, Data) {

    });
    app.controller('GameCtrl', function($scope, Data) {

    });
    app.controller('ResultCtrl', function($scope, Data) {

    });
})();
