var myAppModule = angular.module('myApp', ['ngSanitize', 'ngAnimate', 'ngRoute']);

myAppModule.controller('articleListCtrl', function($scope, $http) {
	window.articleScope = $scope;
	$http({
		method : "GET",
		url : "api/article",
		cache:true
	}).success(function(data, status, headers, config) {
		$scope.articleList = data;
	}).error(function(data, status, headers, config) {
		return console.log("获取数据失败,请刷新页面");
	});

	$scope.toggle = function(index,event) {
		debugger;
		if(typeof event !='undefined')	event.target.parentElement.parentElement.childNodes[1].scrollIntoViewIfNeeded();
		var article = $scope.articleList[index];
		if ( typeof article.body != 'undefined' && article.body.length > 10) {
			article.body = "";
			return;
		}
		article.body = '<h1>loading ... </h1>';
		$http({
			method : "GET",
			url : "/api/article/" + article._id
		}).success(function(data, status, headers, config) {
			article.body = data.body;
		}).error(function(data, status, headers, config) {
			article.body = "获取数据失败,请刷新页面";
		});
	}
}); 

myAppModule.config(function($routeProvider, $locationProvider) {
	var yaowen = {
		controller : "articleListCtrl",
		templateUrl : '/static/yaowen.html'
	};
	
	$routeProvider.when('/yaowen', yaowen).
	when('/yaowen/:id', yaowen).
	when('/', {
		redirectTo : '/static/yaowen.html'
	}).when('/dashi', {
		templateUrl : '/static/dashi.html'
	}).when('/gegu', {
		templateUrl : '/static/gegu.html'
	}).when('/404', {
		templateUrl : '/static/404.html'
	}).otherwise({
		redirectTo : '/404'
	});

	$locationProvider.html5Mode(true);
})
 
 

