myAppModule = angular.module("myApp", [
  "ngSanitize"
  "ngAnimate"
  "ngRoute"
  "infinite-scroll"
])

myAppModule.service "loginService", ($http, $q) ->
  
  #loginService
  #  * isLogin 返回 是否成功登录
  #  * username 返回 登录的用户名
  #  * logou 退出登录
  #  
  _username = ""
  @isLogin = ->
    delay = $q.defer()
    delay.resolve _isLogin  if _isLogin?
    $http.get("/api/isLogin").success (data) ->
      if data.isLogin
        _isLogin = true
        _username = data.username
      else
        _isLogin = false
      delay.resolve _isLogin
      return
    delay.promise

  @username = -> _username

  @logout = ->
    delay = $q.defer()
    $http.get("/api/logout").success ->
      _isLogin = false
      delay.resolve _isLogin
      return
    delay.promise

  @login = (username, password) ->
    delay = $q.defer()
    $http.post("/api/login",
      username: username
      password: password
    ).success (data) ->
      if data.success
        _isLogin = true
        _username = username
        delay.resolve data
      else
        delay.reject data
      return
    delay.promise
  return

myAppModule.controller "articleListCtrl", ($scope, $http, $location) ->
  window.articleScope = $scope
  $scope.articleList = []
  $scope.toggle = (index, event) ->
    
    event.target.parentElement.parentElement.childNodes[1].scrollIntoViewIfNeeded()  unless typeof event is "undefined"
    article = $scope.articleList[index]
    article.readed = true
    if typeof article.body isnt "undefined" and article.body.length > 10
      article.body = ""
      return
    article.body = "<h1>loading ... </h1>"
    $http(
      method: "GET"
      url: "/api/article/" + article._id
    ).success((data, status, headers, config) ->
      article.body = data.body
      return
    ).error (data, status, headers, config) ->
      article.body = "获取数据失败,请刷新页面"
      return

    return

  $scope.loadMore = ->
    page = $scope.articleList.length / 10
    url = undefined
    if $location.$$path is "/yaowen"
      url = "api/articleList/" + page
    else if $location.$$path is "/zhuti"
      return  if $scope.keyword is ""
      url = "api/articleList/keyword/" + $scope.keyword + "/" + page
    $http(
      method: "GET"
      url: url
    ).success((data, status, headers, config) ->
      for i of data
        $scope.articleList.push data[i]
      return
    ).error (data, status, headers, config) ->
      console.log "获取数据失败,请刷新页面"

    return

  unless typeof $scope.child is "undefined"
    $scope.child.changeTag = ->
      console.log "chanTag"
      $scope.articleList = []
      $scope.loadMore()
      return
  return

myAppModule.controller "mainCtrl", ($scope, $http, $route, loginService) ->
  login = ->
    loginService.isLogin().then (e) ->
      $scope.isLogin = e
      $scope.username = loginService.username()
      return

    return

  login()
  $scope.bodyKeyDown = (event) ->
    $route.reload()  if event.keyCode is 82
    return

  $scope.logout = ->
    loginService.logout().then ->
      $scope.isLogin = false
      return

    return

  $scope.$on "loginSuccess", ->
    login()
    return

  return

myAppModule.controller "loginCtrl", ($scope, $http, $routeParams, $route, $location, loginService) ->
  $scope.submit = (e) ->
    if $scope.user.username and $scope.user.password
      debugger
      loginService.login($scope.user.username, $scope.user.password).then (->
        $location.path "/"
        $scope.$emit "loginSuccess"
        return
      ), (data) ->
        $scope.user.msg = data.msg
        return

    else
      $scope.user.msg = "填写不正确"
    return

  return


myAppModule.controller "registerCtrl", ($scope, $http, $routeParams, $route, $location, loginService) ->
  $scope.submit = (e)->
    debugger
    if $scope.user.username and $scope.user.password and $scope.user.password2
      if $scope.user.password != $scope.user.password2
        $scope.user.msg="密码不匹配"
      else 
        $http.post('/api/register',$scope.user).success((data)->
          $scope.user.msg=data.msg
          $location.path "/login"
        )
    else $scope.user.msg="请填写完整"


myAppModule.config ($routeProvider, $locationProvider) ->
  $routeProvider.when("/yaowen",
    controller: "articleListCtrl"
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
  return


#回到顶部
$ ->
  showScroll = ->
    $(window).scroll ->
      scrollValue = $(window).scrollTop()
      (if scrollValue > 100 then $("div[class=scroll]").fadeIn() else $("div[class=scroll]").fadeOut())
      return

    $("#scroll").click ->
      $("html,body").animate
        scrollTop: 0
      , 200
      return

    return
  showScroll()
  return



myAppModule.controller "articleNavCtrl", ($scope, $http, $routeParams, $route, $location, loginService) ->
