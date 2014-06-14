(function() {
  var modifyatarget;

  modifyatarget = function() {
    return {
      restrict: "EA",
      replace: true,
      priority: 1,
      link: function(scope, element, attrs) {
        element.find("a").attr("target", "_blank");
        return scope.$watch(element.attr("ng-bind-html"), function() {
          return element.find("a").attr("target", "_blank");
        });
      }
    };
  };

  myAppModule.directive("modifyatarget", modifyatarget);

}).call(this);

//# sourceMappingURL=directive.map