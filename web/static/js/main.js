var myAppModule = angular.module('myApp', ['ngSanitize','ngAnimate']);

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

	$scope.toggle = function(id) {
		
		for (var i in $scope.articleList) {
			if ($scope.articleList[i]._id === id) {
				var article = $scope.articleList[i];
				if ( typeof article.body != 'undefined' && article.body.length > 10) {
//					window.location.hash='#'+id;
					article.body = "";
					return;
				}
				article.body = '<h1>loading ... </h1>';
			} else {
				//						$scope.articleList[i].body = "";
			}
		}

		$http({
			method : "GET",
			url : "api/article/" + id
		}).success(function(data, status, headers, config) {
			console.log(data);
			article.body = data.body;
		}).error(function(data, status, headers, config) {
			article.body = "获取数据失败,请刷新页面";
		});
	}
}); 