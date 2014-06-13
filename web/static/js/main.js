(function() {
  var articleNavCtrl, myAppModule;

  myAppModule = angular.module("myApp", ["ngSanitize", "ngAnimate", "ngRoute", "infinite-scroll"]);

  myAppModule.service("loginService", function($http, $q) {
    var _username;
    _username = "";
    this.isLogin = function() {
      var delay;
      delay = $q.defer();
      if (typeof _isLogin !== "undefined" && _isLogin !== null) {
        delay.resolve(_isLogin);
      }
      $http.get("/api/isLogin").success(function(data) {
        var _isLogin;
        if (data.isLogin) {
          _isLogin = true;
          _username = data.username;
        } else {
          _isLogin = false;
        }
        delay.resolve(_isLogin);
      });
      return delay.promise;
    };
    this.username = function() {
      return _username;
    };
    this.logout = function() {
      var delay;
      delay = $q.defer();
      $http.get("/api/logout").success(function() {
        var _isLogin;
        _isLogin = false;
        delay.resolve(_isLogin);
      });
      return delay.promise;
    };
    this.login = function(username, password) {
      var delay;
      delay = $q.defer();
      $http.post("/api/login", {
        username: username,
        password: password
      }).success(function(data) {
        var _isLogin;
        if (data.success) {
          _isLogin = true;
          _username = username;
          delay.resolve(data);
        } else {
          delay.reject(data);
        }
      });
      return delay.promise;
    };
  });

  myAppModule.controller("articleListCtrl", function($scope, $http, $location) {
    window.articleScope = $scope;
    $scope.articleList = [];
    $scope.toggle = function(index, event) {
      var article;
      if (typeof event !== "undefined") {
        event.target.parentElement.parentElement.childNodes[1].scrollIntoViewIfNeeded();
      }
      article = $scope.articleList[index];
      article.readed = true;
      if (typeof article.body !== "undefined" && article.body.length > 10) {
        article.body = "";
        return;
      }
      article.body = "<h1>loading ... </h1>";
      $http({
        method: "GET",
        url: "/api/article/" + article._id
      }).success(function(data, status, headers, config) {
        article.body = data.body;
      }).error(function(data, status, headers, config) {
        article.body = "获取数据失败,请刷新页面";
      });
    };
    $scope.loadMore = function() {
      var page, url;
      page = $scope.articleList.length / 10;
      url = void 0;
      if ($location.$$path === "/yaowen") {
        url = "api/articleList/" + page;
      } else if ($location.$$path === "/zhuti") {
        if ($scope.keyword === "") {
          return;
        }
        url = "api/articleList/keyword/" + $scope.keyword + "/" + page;
      }
      $http({
        method: "GET",
        url: url
      }).success(function(data, status, headers, config) {
        var i;
        for (i in data) {
          $scope.articleList.push(data[i]);
        }
      }).error(function(data, status, headers, config) {
        return console.log("获取数据失败,请刷新页面");
      });
    };
    if (typeof $scope.child !== "undefined") {
      $scope.child.changeTag = function() {
        console.log("chanTag");
        $scope.articleList = [];
        $scope.loadMore();
      };
    }
  });

  myAppModule.controller("mainCtrl", function($scope, $http, $route, loginService) {
    var login;
    login = function() {
      loginService.isLogin().then(function(e) {
        $scope.isLogin = e;
        $scope.username = loginService.username();
      });
    };
    login();
    $scope.bodyKeyDown = function(event) {
      if (event.keyCode === 82) {
        $route.reload();
      }
    };
    $scope.logout = function() {
      loginService.logout().then(function() {
        $scope.isLogin = false;
      });
    };
    $scope.$on("loginSuccess", function() {
      login();
    });
  });

  myAppModule.controller("loginCtrl", function($scope, $http, $routeParams, $route, $location, loginService) {
    $scope.submit = function(e) {
      if ($scope.user.username && $scope.user.password) {
        debugger;
        loginService.login($scope.user.username, $scope.user.password).then((function() {
          $location.path("/");
          $scope.$emit("loginSuccess");
        }), function(data) {
          $scope.user.msg = data.msg;
        });
      } else {
        $scope.user.msg = "填写不正确";
      }
    };
  });

  myAppModule.controller("registerCtrl", function($scope, $http, $routeParams, $route, $location, loginService) {
    return $scope.submit = function(e) {
      debugger;
      if ($scope.user.username && $scope.user.password && $scope.user.password2) {
        if ($scope.user.password !== $scope.user.password2) {
          return $scope.user.msg = "密码不匹配";
        } else {
          return $http.post('/api/register', $scope.user).success(function(data) {
            $scope.user.msg = data.msg;
            return $location.path("/login");
          });
        }
      } else {
        return $scope.user.msg = "请填写完整";
      }
    };
  });

  myAppModule.config(function($routeProvider, $locationProvider) {
    $routeProvider.when("/yaowen", {
      controller: "articleListCtrl",
      templateUrl: "/static/yaowen.html"
    }).when("/", {
      redirectTo: "/static/yaowen.html"
    }).when("/dashi", {
      templateUrl: "/static/dashi.html"
    }).when("/zhuti", {
      templateUrl: "/static/zhuti.html"
    }).when("/gegu", {
      templateUrl: "/static/gegu.html"
    }).when("/fenlei", {
      templateUrl: "/static/fenlei.html"
    }).when("/404", {
      templateUrl: "/static/404.html"
    }).when("/login", {
      templateUrl: "/static/login.html"
    }).when("/register", {
      templateUrl: "/static/register.html"
    }).when("/company", {
      templateUrl: "/static/company.html"
    }).otherwise({
      redirectTo: "/404"
    });
    $locationProvider.html5Mode(true);
  });

  $(function() {
    var showScroll;
    showScroll = function() {
      $(window).scroll(function() {
        var scrollValue;
        scrollValue = $(window).scrollTop();
        if (scrollValue > 100) {
          $("div[class=scroll]").fadeIn();
        } else {
          $("div[class=scroll]").fadeOut();
        }
      });
      $("#scroll").click(function() {
        $("html,body").animate({
          scrollTop: 0
        }, 200);
      });
    };
    showScroll();
  });

  articleNavCtrl = function($scope) {};

}).call(this);

//# sourceMappingURL=main.map