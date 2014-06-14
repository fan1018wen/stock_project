
articleListCtrl = ($scope, $http, $location) ->
  window.articleScope = $scope
  $scope.articleList = []
  $scope.toggle = (index, event) ->
    event.target.parentElement.parentElement.childNodes[1].scrollIntoViewIfNeeded()  unless typeof event is "undefined"
    article = $scope.articleList[index]
    article.readed = true
    if typeof article.body isnt "undefined" and article.body.length > 10
      article.body = ""
    article.body = "<h1>loading ... </h1>"
    $http(
      method: "GET"
      url: "/api/article/" + article._id
    ).success((data, status, headers, config) ->
      article.body = data.body
    ).error (data, status, headers, config) ->
      article.body = "获取数据失败,请刷新页面"

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
    ).error (data, status, headers, config) ->
      console.log "获取数据失败,请刷新页面"

  unless typeof $scope.child is "undefined"
    $scope.child.changeTag = ->
      console.log "chanTag"
      $scope.articleList = []
      $scope.loadMore()

mainCtrl = ($scope, $http, $route, loginService) ->
  login = ->
    loginService.isLogin().then (e) ->
      $scope.isLogin = e
      $scope.username = loginService.username()
  do login
  $scope.bodyKeyDown = (event) ->
    $route.reload()  if event.keyCode is 82

  $scope.logout = ->
    loginService.logout().then ->
      $scope.isLogin = false

  $scope.$on "loginSuccess", ->
    login()


loginCtrl = ($scope, $http, $routeParams, $route, $location, loginService) ->
  $scope.submit = (e) ->
    if $scope.user.username and $scope.user.password
      loginService.login($scope.user.username, $scope.user.password).then (->
        $location.path "/"
        $scope.$emit "loginSuccess"
      ), (data) ->
        $scope.user.msg = data.msg
    else
      $scope.user.msg = "填写不正确"

registerCtrl = ($scope, $http, $routeParams, $route, $location, loginService) ->
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


fenleiCtrl = ($scope, $http, $filter) ->
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

  $scope.clickFenlei = (index) ->
    $scope.showFenlei = not $scope.showFenlei
    $scope.companyShow = $scope.fenlei[$scope.fenleiList[index].name]

  $scope.searchCompany = ->
    $scope.companyShow =
      id_list: []
      title_list: []
      title_list_pinyin: []

    re = searchCompany($scope.company, $scope.companySearch)
    for i of re
      item = re[i]
      $scope.companyShow.id_list.push item.id
      $scope.companyShow.title_list.push item.title
      $scope.companyShow.title_list_pinyin.push item.title_pinyin
    return

  $scope.clickCompany = (index) ->
    $scope.nowCompany = $scope.companyShow.id_list[index]


companyCtrl = ($scope, $http) ->
  $scope.nowCompany = 603002
  $scope.nav =[
    "最新指标"
    "财务透视"
    "主营构成"
    "行业新闻"
    "大事提醒"
    "八面来风"
    "公司概况"
    "管理层　"
    "季度财务"
    "大股东　"
    "股本分红"
    "资本运作"
    "行业地位"
    "公司公告"
    "回顾展望"
    "盈利预测"]
  $scope.clickNav = (index)->
    $scope.tabNow=index+1

  getCompanyData =  ->
    $http.get('/api/f10/'+$scope.nowCompany).success (data)->
      $scope.companyData = data
  do getCompanyData
  $scope.$watch "nowCompany",getCompanyData
myAppModule.controller "canvasCtrl", ($scope, $http, $route) ->
  $scope.keyword = ""
  $scope.yaowenNoShowNav = 1
  $http(
    method: "GET"
    url: "/api/tags"
  ).success (data) ->
    drawTag data

  $scope.child = {} #传替到子控制器
  drawTag = (list) ->
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

    WordCloud canvas, options

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



articleNavCtrl = ($scope) ->



myAppModule.controller "articleListCtrl", articleListCtrl
myAppModule.controller "mainCtrl",mainCtrl
myAppModule.controller "loginCtrl",loginCtrl
myAppModule.controller "registerCtrl",registerCtrl
myAppModule.controller "fenleiCtrl",fenleiCtrl
myAppModule.controller "companyCtrl" ,companyCtrl
myAppModule.controller "articleNavCtrl",articleNavCtrl

