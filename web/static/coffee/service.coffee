

loginService = ($http, $q) ->
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
    delay.promise

  @username = -> _username

  @logout = ->
    delay = $q.defer()
    $http.get("/api/logout").success ->
      _isLogin = false
      delay.resolve _isLogin
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
    delay.promise
  return
  

myAppModule.service "loginService",loginService
