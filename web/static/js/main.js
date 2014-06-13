(function() {
  var myAppModule;

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
        return delay.resolve(_isLogin);
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
        return delay.resolve(_isLogin);
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
          return delay.resolve(data);
        } else {
          return delay.reject(data);
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
      }
      article.body = "<h1>loading ... </h1>";
      return $http({
        method: "GET",
        url: "/api/article/" + article._id
      }).success(function(data, status, headers, config) {
        return article.body = data.body;
      }).error(function(data, status, headers, config) {
        return article.body = "获取数据失败,请刷新页面";
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
      return $http({
        method: "GET",
        url: url
      }).success(function(data, status, headers, config) {
        var i, _results;
        _results = [];
        for (i in data) {
          _results.push($scope.articleList.push(data[i]));
        }
        return _results;
      }).error(function(data, status, headers, config) {
        return console.log("获取数据失败,请刷新页面");
      });
    };
    if (typeof $scope.child !== "undefined") {
      return $scope.child.changeTag = function() {
        console.log("chanTag");
        $scope.articleList = [];
        return $scope.loadMore();
      };
    }
  });

  myAppModule.controller("mainCtrl", function($scope, $http, $route, loginService) {
    var login;
    login = function() {
      return loginService.isLogin().then(function(e) {
        $scope.isLogin = e;
        return $scope.username = loginService.username();
      });
    };
    login();
    $scope.bodyKeyDown = function(event) {
      if (event.keyCode === 82) {
        return $route.reload();
      }
    };
    $scope.logout = function() {
      return loginService.logout().then(function() {
        return $scope.isLogin = false;
      });
    };
    return $scope.$on("loginSuccess", function() {
      return login();
    });
  });

  myAppModule.controller("loginCtrl", function($scope, $http, $routeParams, $route, $location, loginService) {
    return $scope.submit = function(e) {
      if ($scope.user.username && $scope.user.password) {
        return loginService.login($scope.user.username, $scope.user.password).then((function() {
          $location.path("/");
          return $scope.$emit("loginSuccess");
        }), function(data) {
          return $scope.user.msg = data.msg;
        });
      } else {
        return $scope.user.msg = "填写不正确";
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

  myAppModule.controller("fenleiCtrl", function($scope, $http, $filter) {
    $scope.fenleiNow = 1;
    $http.get("api/fenlei").success(function(data) {
      var company, i, item, j, _results;
      $scope.fenlei = data;
      $scope.fenleiList = [];
      for (i in data) {
        item = {
          name: i,
          count: data[i].id_list.length,
          namePinYin: data[i].fenlei_pinyin
        };
        $scope.fenleiList.push(item);
      }
      $scope.company = [];
      _results = [];
      for (i in $scope.fenlei) {
        item = $scope.fenlei[i];
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (j in item.id_list) {
            company = {};
            company.id = item.id_list[j];
            company.title = item.title_list[j];
            company.title_pinyin = item.title_list_pinyin[j];
            _results1.push($scope.company.push(company));
          }
          return _results1;
        })());
      }
      return _results;
    });
    $scope.clickFenlei = function(index) {
      $scope.showFenlei = !$scope.showFenlei;
      return $scope.companyShow = $scope.fenlei[$scope.fenleiList[index].name];
    };
    $scope.searchCompany = function() {
      var i, item, re;
      $scope.companyShow = {
        id_list: [],
        title_list: [],
        title_list_pinyin: []
      };
      re = searchCompany($scope.company, $scope.CompanySearch);
      for (i in re) {
        item = re[i];
        $scope.companyShow.id_list.push(item.id);
        $scope.companyShow.title_list.push(item.title);
        $scope.companyShow.title_list_pinyin.push(item.title_pinyin);
      }
    };
    return $scope.clickCompany = function(index) {
      return $scope.nowCompany = $scope.companyShow.id_list[index];
    };
  });

  myAppModule.controller("companyCtrl", function($scope, $http) {
    $scope.nav = [
      {
        title: "最新动态",
        url: "./"
      }, {
        title: "公司资料",
        url: "./company.html"
      }, {
        title: "股东研究",
        url: "./holder.html"
      }, {
        title: "经营分析",
        url: "./operate.html"
      }, {
        title: "股本结构",
        url: "./equity.html"
      }, {
        title: "资本运作",
        url: "./capital.html"
      }, {
        title: "盈利预测",
        url: "./worth.html"
      }, {
        title: "新闻公告",
        url: "./news.html"
      }, {
        title: "财务概况",
        url: "./finance.html"
      }, {
        title: "主力持仓",
        url: "./position.html"
      }, {
        title: "深度研究",
        url: "./research.html"
      }, {
        title: "分红融资",
        url: "./bonus.html"
      }, {
        title: "公司大事",
        url: "./event.html"
      }, {
        title: "行业对比",
        url: "./field.html"
      }
    ];
    $scope.clickNav = function(index) {
      if (index == null) {
        return;
      }
      $scope.contentHtml = "加载中...";
      $scope.contentUrl = $scope.nav[index].url.replace(".", $scope.nowCompany);
      return $http({
        method: "GET",
        url: "/api/content/" + $scope.contentUrl
      }).success(function(data, status, headers, config) {
        return $scope.contentHtml = data;
      });
    };
    return $scope.$watch("nowCompany", function() {
      $scope.clickNav();
      return console.log(" change now company");
    });
  });

  myAppModule.controller("canvasCtrl", function($scope, $http, $route) {
    var drawTag;
    $scope.keyword = "";
    $scope.yaowenNoShowNav = 1;
    $http({
      method: "GET",
      url: "/api/tags"
    }).success(function(data) {
      return drawTag(data);
    });
    $scope.child = {};
    return drawTag = function(list) {
      var canvas, options;
      canvas = $(".tag-cloudy:last")[0];
      options = {
        gridSize: 50,
        weightFactor: 16,
        fontFamily: "Hiragino Mincho Pro, serif",
        color: "random-dark",
        backgroundColor: "#f0f0f0",
        rotateRatio: 0,
        list: list,
        shape: "circle ",
        click: function(item, dimension, event) {
          $scope.$apply(function() {
            return $scope.keyword = item[0];
          });
          return $scope.child.changeTag();
        },
        hover: function(item, dimension, event) {
          if (item) {
            return $(".tag-cloudy").css("cursor", "pointer");
          } else {
            return $(".tag-cloudy").css("cursor", "default");
          }
        }
      };
      return WordCloud(canvas, options);
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
    return $locationProvider.html5Mode(true);
  });

  $(function() {
    return (function() {
      $(window).scroll(function() {
        var scrollValue;
        scrollValue = $(window).scrollTop();
        if (scrollValue > 100) {
          return $("div[class=scroll]").fadeIn();
        } else {
          return $("div[class=scroll]").fadeOut();
        }
      });
      return $("#scroll").click(function() {
        return $("html,body").animate({
          scrollTop: 0
        }, 200);
      });
    })();
  });

  myAppModule.controller("articleNavCtrl", function($scope) {});

}).call(this);

//# sourceMappingURL=main.map