(function() {
  window.searchCompany = function(company, keyword) {
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

}).call(this);

//# sourceMappingURL=search.map