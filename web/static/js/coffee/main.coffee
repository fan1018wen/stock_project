window.myAppModule = angular.module("myApp", [
  "ngSanitize"
  "ngAnimate"
  "ngRoute"
  "infinite-scroll"
])



myAppModule.config ($routeProvider, $locationProvider) ->
  $routeProvider.when("/yaowen",
    templateUrl: "/static/yaowen.html"
  ).when("/",
    redirectTo: "/static/yaowen.html"
  ).when("/dashi",
    templateUrl: "/static/dashi.html"
  ).when("/zhuti",
    templateUrl: "/static/zhuti.html"
  ).when("/gegu",
    templateUrl: "/static/gegu.html"
  ).when("/fenlei",
    templateUrl: "/static/fenlei.html"
  ).when("/404",
    templateUrl: "/static/404.html"
  ).when("/login",
    templateUrl: "/static/login.html"
  ).when("/register",
    templateUrl: "/static/register.html"
  ).when("/company",
    templateUrl: "/static/company.html"
  ).otherwise redirectTo: "/404"
  $locationProvider.html5Mode true
