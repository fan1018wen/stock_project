var myAppModule = angular.module('myApp', ['ngSanitize', 'ngAnimate','ngRoute']);

myAppModule.controller('articleCtrl', function($scope, $http) {
	window.articleScope = $scope;
	$http({
		method : "GET",
		url : "api/article"
	}).success(function(data, status, headers, config) {
		$scope.articleList = data;
	}).error(function(data, status, headers, config) {
		return console.log("获取数据失败,请刷新页面");
	});

	$scope.toggle = function(index) {
		var article = $scope.articleList[index];
		if ( typeof article.body != 'undefined' && article.body.length > 10) {
			article.body = "";
			return;
		}
		article.body = '<h1>loading ... </h1>';
		$http({
			method : "GET",
			url : "api/article/" + article._id
		}).success(function(data, status, headers, config) {
			article.body = data.body;
		}).error(function(data, status, headers, config) {
			article.body = "获取数据失败,请刷新页面";
		});
	}
});


myAppModule.config(function($routeProvider){
	$routeProvider.
		when('/',{controller:"articleCtrl",templateUrl:'/static/yaowen_content.html'});
	
})

