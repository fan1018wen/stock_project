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


myAppModule.controller "fenleiCtrl", ($scope, $http, $filter) ->
  $scope.fenleiNow = 1
  $http.get("api/fenlei").success (data) ->
    $scope.fenlei = data
    $scope.fenleiList = []
    for i of data
      item =
        name: i
        count: data[i].id_list.length
        namePinYin: data[i].fenlei_pinyin

      $scope.fenleiList.push item
    $scope.company = []
    for i of $scope.fenlei
      item = $scope.fenlei[i]
      for j of item.id_list
        company = {}
        company.id = item.id_list[j]
        company.title = item.title_list[j]
        company.title_pinyin = item.title_list_pinyin[j]
        $scope.company.push company
    return

  $scope.clickFenlei = (index) ->
    $scope.showFenlei = not $scope.showFenlei
    $scope.companyShow = $scope.fenlei[$scope.fenleiList[index].name]
    return

  $scope.searchCompany = ->
    $scope.companyShow =
      id_list: []
      title_list: []
      title_list_pinyin: []

    re = searchCompany($scope.company, $scope.CompanySearch)
    for i of re
      item = re[i]
      $scope.companyShow.id_list.push item.id
      $scope.companyShow.title_list.push item.title
      $scope.companyShow.title_list_pinyin.push item.title_pinyin
    return

  
  #     debugger;
  $scope.clickCompany = (index) ->
    
    #     debugger;
    $scope.nowCompany = $scope.companyShow.id_list[index]
    return

  return

myAppModule.controller "companyCtrl" , ($scope, $http) ->
  $scope.nav = [
    {
      title: "最新动态"
      url: "./"
    }
    {
      title: "公司资料"
      url: "./company.html"
    }
    {
      title: "股东研究"
      url: "./holder.html"
    }
    {
      title: "经营分析"
      url: "./operate.html"
    }
    {
      title: "股本结构"
      url: "./equity.html"
    }
    {
      title: "资本运作"
      url: "./capital.html"
    }
    {
      title: "盈利预测"
      url: "./worth.html"
    }
    {
      title: "新闻公告"
      url: "./news.html"
    }
    {
      title: "财务概况"
      url: "./finance.html"
    }
    {
      title: "主力持仓"
      url: "./position.html"
    }
    {
      title: "深度研究"
      url: "./research.html"
    }
    {
      title: "分红融资"
      url: "./bonus.html"
    }
    {
      title: "公司大事"
      url: "./event.html"
    }
    {
      title: "行业对比"
      url: "./field.html"
    }
  ]
  
  #   $scope.nowCompany = "000576";
  $scope.clickNav = (index) ->
    unless index? then return
    $scope.contentHtml = "加载中..."
    $scope.contentUrl = $scope.nav[index].url.replace(".", $scope.nowCompany)
    $http(
      method: "GET"
      url: "/api/content/" + $scope.contentUrl
    ).success((data, status, headers, config) ->
      $scope.contentHtml = data
      return
    ).error (data, status, headers, config) ->

    return

  $scope.$watch "nowCompany", ->
    $scope.clickNav()
    console.log " change now company"
    return

  return


myAppModule.controller "canvasCtrl", ($scope, $http, $route) ->
  
  #var list = [["紅樓夢", 6], ["賈寶玉", 3], ["林黛玉", 3], ["薛寶釵", 3], ["王熙鳳", 3], ["李紈", 3], ["賈元春", 3], ["賈迎春", 3], ["賈探春", 3], ["賈惜春", 3], ["秦可卿", 3], ["賈巧姐", 3], ["史湘雲", 3], ["妙玉", 3], ["賈政", 2], ["賈赦", 2], ["賈璉", 2], ["賈珍", 2], ["賈環", 2], ["賈母", 2], ["王夫人", 2], ["薛姨媽", 2], ["尤氏", 2], ["平兒", 2], ["鴛鴦", 2], ["襲人", 2], ["晴雯", 2], ["香菱", 2], ["紫鵑", 2], ["麝月", 2], ["小紅", 2], ["金釧", 2], ["甄士隱", 2], ["賈雨村", 2]];
  $scope.keyword = ""
  $scope.yaowenNoShowNav = 1
  $http(
    method: "GET"
    url: "/api/tags"
  ).success (data) ->
    drawTag data
    return

  $scope.child = {} #传替到子控制器
  drawTag = (list) ->
    
    #         debugger;
    canvas = $(".tag-cloudy:last")[0]
    options =
      gridSize: 50
      weightFactor: 16
      fontFamily: "Hiragino Mincho Pro, serif"
      color: "random-dark"
      backgroundColor: "#f0f0f0"
      rotateRatio: 0
      list: list
      shape: "circle "
      click: (item, dimension, event) ->
        $scope.$apply ->
          $scope.keyword = item[0]
        $scope.child.changeTag()

      hover: (item, dimension, event) ->
        if item
          $(".tag-cloudy").css "cursor", "pointer"
        else
          $(".tag-cloudy").css "cursor", "default"
        return

    WordCloud canvas, options
    return

  return

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
