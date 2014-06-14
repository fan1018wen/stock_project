
# 把 ng-bind-html 中的html的链接的 target属性改为 _blank
modifyatarget = ->
  restrict: "EA"
  replace: true
  priority:1
  link: (scope,element,attrs)->
    element.find("a").attr("target","_blank")
    scope.$watch element.attr("ng-bind-html"),->
      element.find("a").attr("target","_blank")

      
myAppModule.directive "modifyatarget",modifyatarget
