(function() {
    var app = angular.module('myApp', ['onsen.directives']);

    app.factory('Data', function() {
        var Data = {};
        Data.contact = {'first': '', 'last': '', 'phone': ''};
        var storage = window.localStorage;
        for (var key in Data.contact) {
            Data.contact[key] = window.localStorage.getItem(key) || '';
        }
        return Data;
    });

    app.controller('ContactCtrl', function($scope, Data) {
        $scope.contact = Data.contact;
        $scope.submitted = false;

        $scope.saveContact = function(contact){
            Data.contact = angular.copy(contact);
            var storage = window.localStorage;
            for (var key in contact) {
                window.localStorage.setItem(key, contact[key]);
            }
            ons.navigator.pushPage("syncTesla.html");
        };
    });
})();
