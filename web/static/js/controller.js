(function() {
  var articleListCtrl, articleNavCtrl, canvasCtrl, companyCtrl, fenleiCtrl, loginCtrl, mainCtrl, registerCtrl;

  articleListCtrl = function($scope, $http, $location) {
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
  };

  mainCtrl = function($scope, $http, $route, loginService) {
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
  };

  loginCtrl = function($scope, $http, $routeParams, $route, $location, loginService) {
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
  };

  registerCtrl = function($scope, $http, $routeParams, $route, $location, loginService) {
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
  };

  fenleiCtrl = function($scope, $http, $filter) {
    var searchCompany;
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
      re = searchCompany($scope.company, $scope.companySearch);
      for (i in re) {
        item = re[i];
        $scope.companyShow.id_list.push(item.id);
        $scope.companyShow.title_list.push(item.title);
        $scope.companyShow.title_list_pinyin.push(item.title_pinyin);
      }
    };
    $scope.clickCompany = function(index) {
      $scope.nowCompany = $scope.companyShow.id_list[index];
      $scope.nowCompanyName = $scope.companyShow.title_list[index];
      return $scope.$broadcast('changeCompany', $scope.nowCompany);
    };
    return searchCompany = function(company, keyword) {
      var ans, enque, isAdd, searchId, searchName, searchPinYin;
      ans = [];
      isAdd = {};
      enque = function(ans) {
        var id, item, re, _i, _len;
        isAdd = {};
        re = [];
        for (_i = 0, _len = ans.length; _i < _len; _i++) {
          item = ans[_i];
          id = item.id;
          if (!isAdd[id]) {
            re.push(item);
            isAdd[id] = 1;
          }
        }
        if (re.length > 50) {
          return re = re.slice(0, 50);
        } else {
          return re;
        }
      };
      searchId = function() {
        var id, item, _i, _len;
        for (_i = 0, _len = company.length; _i < _len; _i++) {
          item = company[_i];
          id = item.id;
          if (id.toString().indexOf(keyword) !== -1) {
            ans.push(item);
          }
        }
        return enque(ans);
      };
      searchName = function() {
        var item, name, _i, _len;
        for (_i = 0, _len = company.length; _i < _len; _i++) {
          item = company[_i];
          name = item.title;
          if (name.toString().indexOf(keyword) !== -1) {
            ans.push(item);
          }
        }
        return enque(ans);
      };
      searchPinYin = function() {
        var item, py, _i, _len;
        for (_i = 0, _len = company.length; _i < _len; _i++) {
          item = company[_i];
          py = item.title_pinyin;
          if (py.toString().indexOf(keyword) !== -1) {
            ans.push(item);
          }
        }
        return enque(ans);
      };
      if (isNaN(parseInt(keyword))) {
        if (/^[a-z]+$/.test(keyword)) {
          return searchPinYin();
        }
        return searchName();
      }
      return searchId();
    };
  };

  companyCtrl = function($scope, $http) {
    var getCompanyData;
    $scope.nowCompany = 0;
    $scope.nav = ["最新指标", "财务透视", "主营构成", "行业新闻", "大事提醒", "八面来风", "公司概况", "管理层　", "季度财务", "大股东　", "股本分红", "资本运作", "行业地位", "公司公告", "回顾展望", "盈利预测"];
    $scope.clickNav = function(index) {
      return $scope.tabNow = index + 1;
    };
    getCompanyData = function() {
      if ($scope.nowCompany === 0) {
        return;
      }
      return $http.get('/api/f10/' + $scope.nowCompany).success(function(data) {
        $scope.companyData = data;
        return $scope.companyShow = !data ? false : true;
      });
    };
    return $scope.$on("changeCompany", function(event, nowCompany) {
      $scope.nowCompany = nowCompany;
      return getCompanyData();
    });
  };

  canvasCtrl = function($scope, $http, $route) {
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
  };

  articleNavCtrl = function($scope) {};

  myAppModule.controller("articleListCtrl", articleListCtrl);

  myAppModule.controller("mainCtrl", mainCtrl);

  myAppModule.controller("loginCtrl", loginCtrl);

  myAppModule.controller("registerCtrl", registerCtrl);

  myAppModule.controller("fenleiCtrl", fenleiCtrl);

  myAppModule.controller("companyCtrl", companyCtrl);

  myAppModule.controller("articleNavCtrl", articleNavCtrl);

  myAppModule.controller("canvasCtrl", canvasCtrl);

}).call(this);

//# sourceMappingURL=controller.map