var app = angular.module('SmartSoftApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    console.log('Setting up routing configuration');

    $locationProvider.hashPrefix('');

    $routeProvider.when('/', {
        controller: 'RulesController',
        templateUrl: '/views/rules.html'
    })
	.when('/rules', {
	    controller: 'RulesController',
	    templateUrl: '/views/rules.html'
	})
	.when('/rules/details/:id', {
	    controller: 'RulesController',
	    templateUrl: '/views/ruleDetails.html'
	})
	.when('/rules/edit/:id', {
	    controller: 'RulesController',
	    templateUrl: '/views/editRule.html'
	})
	.when('/rules/add', {
	    controller: 'RulesController',
	    templateUrl: '/views/addRule.html'
	})
	.when('/rules/testFact', {
	    controller: 'RulesController',
	    templateUrl: '/views/testFact.html'
	})
	.otherwise({
	    redirectTo: '/'
	});
}]);

app.controller('RulesController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    $scope.getRules = function () {
        $http.get('/api/rules').then(function (response) {
            $scope.rules = response.data;
        });
    }

    $scope.getRule = function () {
        var id = $routeParams.id;
        $http.get('/api/rules/' + id).then(function (response) {
            $scope.rule = response.data;
        });
    }

    $scope.addRule = function () {
        $http.post('/api/rules/', $scope.rule).then(function (response) {

            window.location.href = "/";
        });
    }

    $scope.updateRule = function () {
        var id = $routeParams.id;
        $http.put('/api/rules/' + id, $scope.rule).then(function (response) {

            window.location.href = "/";
        });
    }

    $scope.deleteRule = function (id) {
        $http.delete('/api/rules/' + id).then(function (response) {

            window.location.href = "/";
        });
    }
}]);