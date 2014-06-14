
#回到顶部
$ ->
  do ->
    $(window).scroll ->
      scrollValue = $(window).scrollTop()
      (if scrollValue > 100 then $("div[class=scroll]").fadeIn() else $("div[class=scroll]").fadeOut())

    $("#scroll").click ->
      $("html,body").animate
        scrollTop: 0
      , 200


