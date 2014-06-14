(function() {
  var loginService;

  loginService = function($http, $q) {
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
  };

  myAppModule.service("loginService", loginService);

}).call(this);

//# sourceMappingURL=service.map