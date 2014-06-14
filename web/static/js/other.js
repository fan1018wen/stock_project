(function() {
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

}).call(this);

//# sourceMappingURL=other.map