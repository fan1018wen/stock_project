var myAppModule = angular.module('myApp', ['ngSanitize', 'ngAnimate', 'ngRoute', 'infinite-scroll']);

myAppModule.controller('articleListCtrl', function($scope, $http, $location) {

	window.articleScope = $scope;
	$scope.articleList = [];
	$scope.toggle = function(index, event) {
		//		debugger;
		if ( typeof event != 'undefined')
			event.target.parentElement.parentElement.childNodes[1].scrollIntoViewIfNeeded();
		var article = $scope.articleList[index];
		article.readed = true;
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

	$scope.loadMore = function() {
		var page = $scope.articleList.length / 10;
		var url;
		if ($location.$$path == '/yaowen')
			url = "api/articleList/" + page;
		else if ($location.$$path == '/zhuti') {
			if ($scope.keyword == "")
				return;
			url = "api/articleList/keyword/" + $scope.keyword + '/' + page;
		}

		$http({
			method : "GET",
			url : url,
		}).success(function(data, status, headers, config) {
			for (var i in data) {
				$scope.articleList.push(data[i]);
			}
		}).error(function(data, status, headers, config) {
			return console.log("获取数据失败,请刷新页面");
		});
	};
	if ( typeof $scope.child != "undefined") {
		$scope.child.changeTag = function() {
			console.log("chanTag");
			$scope.articleList = [];
			$scope.loadMore();
		}
	}

});

myAppModule.controller('mainCtrl', function($scope, $http, $route) {
	$scope.bodyKeyDown = function(event) {
		if (event.keyCode == 82) {
			$route.reload();
		}
	}
});

myAppModule.config(function($routeProvider, $locationProvider) {

	$routeProvider.when('/yaowen', {
		controller : "articleListCtrl",
		templateUrl : '/static/yaowen.html'
	}).when('/', {
		redirectTo : '/static/yaowen.html'
	}).when('/dashi', {
		templateUrl : '/static/dashi.html'
	}).when('/zhuti', {
		templateUrl : '/static/zhuti.html'
	}).when('/gegu', {
		templateUrl : '/static/gegu.html'
	}).when('/fenlei', {
		templateUrl : '/static/fenlei.html'
	}).when('/404', {
		templateUrl : '/static/404.html'
	}).otherwise({
		redirectTo : '/404'
	});
	$locationProvider.html5Mode(true);

});

//回到顶部
$(function() {
	showScroll();
	function showScroll() {
		$(window).scroll(function() {
			var scrollValue = $(window).scrollTop();
			scrollValue > 100 ? $('div[class=scroll]').fadeIn() : $('div[class=scroll]').fadeOut();
		});
		$('#scroll').click(function() {
			$("html,body").animate({
				scrollTop : 0
			}, 200);
		});
	}

})
