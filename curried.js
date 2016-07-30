(function(){
  var lodash, wrap, toCurry, slice$ = [].slice;
  lodash = require('lodash');
  wrap = function(targetF){
    var figureArgs, figureCurry;
    figureArgs = function(arg$){
      var x, y;
      x = arg$[0], y = arg$[1];
      if ((x != null ? x.constructor : void 8) === Function) {
        return {
          fun: x,
          arg: y
        };
      } else if ((y != null ? y.constructor : void 8) === Function) {
        return {
          fun: y,
          arg: x
        };
      } else {
        throw "got weird arguments";
      }
    };
    figureCurry = function(arg$){
      var fun, arg;
      fun = arg$.fun, arg = arg$.arg;
      if (!fun) {
        (function(fun){
          return targetF(arg, fun);
        });
      }
      if (!arg) {
        return function(arg){
          return targetF(arg, fun);
        };
      } else if (fun && arg) {
        return targetF(arg, fun);
      } else {
        throw "didn't get any arguments";
      }
    };
    return function(){
      var args;
      args = slice$.call(arguments);
      return figureCurry(
      figureArgs(
      args));
    };
  };
  toCurry = ['map', 'remove'];
  lodash.each(toCurry, function(name){
    return exports["c" + name] = wrap(lodash[name]);
  });
}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL3Jlc2JvdS9jb3JlL25vZGVfbW9kdWxlcy9sZXNoZGFzaC9jdXJyaWVkLmxzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0VBQ1csTUFBQSxDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQTtFQUVYLElBQUssQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBLE9BQUE7O0lBRUwsVUFBVyxDQUFBLENBQUEsQ0FBRSxRQUFBLENBQUEsSUFBQTs7TUFBRSxhQUFHO01BQ2hCLElBQVEsQ0FBTCxDQUFLLFFBQUEsQ0FBTCxFQUFBLENBQUUsQ0FBQSxXQUFHLENBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLENBQUcsUUFBWDtRQUF5QixNQUFBLENBQU8sQ0FBUDtBQUFBLFVBQU8sR0FBUCxFQUFZLENBQVosQ0FBQTtBQUFBLFVBQWUsR0FBZixFQUFvQixDQUFwQjtBQUFBLFFBQU8sQ0FBUDtPQUN6QixNQUFBLElBQWEsQ0FBTCxDQUFLLFFBQUEsQ0FBTCxFQUFBLENBQUUsQ0FBQSxXQUFHLENBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLENBQUcsUUFBaEI7UUFBOEIsTUFBQSxDQUFPLENBQVA7QUFBQSxVQUFPLEdBQVAsRUFBWSxDQUFaLENBQUE7QUFBQSxVQUFlLEdBQWYsRUFBb0IsQ0FBcEI7QUFBQSxRQUFPLENBQVA7T0FDOUI7UUFBSyxNQUEyQixxQkFBM0I7OztJQUVQLFdBQVksQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBLElBQUE7O01BQUUsV0FBQSxLQUFLLFdBQUE7TUFDbkIsSUFBRyxDQUFJLEdBQVA7U0FBZ0IsUUFBQSxDQUFBLEdBQUE7aUJBQVMsUUFBUSxLQUFLLEdBQUw7OztNQUNqQyxJQUFHLENBQUksR0FBUDtlQUFnQixRQUFBLENBQUEsR0FBQTtpQkFBUyxRQUFRLEtBQUssR0FBTDs7T0FDakMsTUFBQSxJQUFRLEdBQUksQ0FBQSxFQUFBLENBQUksR0FBaEI7ZUFBeUIsUUFBUSxLQUFLLEdBQUw7T0FDakM7UUFBSyxNQUFnQywwQkFBaEM7OztXQUVQLFFBQUEsQ0FBQTs7TUFBSTthQUErQjtNQUFkO01BQVI7OztFQUVmLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQSxPQUFBLFFBQUE7RUFFVixNQUFNLENBQUMsS0FBSyxTQUFTLFFBQUEsQ0FBQSxJQUFBO1dBQ25CLE9BQU8sQ0FBQyxHQUFBLENBQUEsQ0FBQSxDQUFJLElBQUwsQ0FBYSxDQUFBLENBQUEsQ0FBRSxLQUFLLE1BQU0sQ0FBQyxJQUFELENBQU47R0FEakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIGF1dG9jb21waWxlXG5yZXF1aXJlISB7IGxvZGFzaCB9XG5cbndyYXAgPSAodGFyZ2V0RikgLT5cblxuICBmaWd1cmVBcmdzID0gKFt4LCB5XSkgLT5cbiAgICBpZiB4P0BAIGlzIEZ1bmN0aW9uIHRoZW4gcmV0dXJuIGZ1bjogeCwgYXJnOiB5XG4gICAgZWxzZSBpZiB5P0BAIGlzIEZ1bmN0aW9uIHRoZW4gcmV0dXJuIGZ1bjogeSwgYXJnOiB4XG4gICAgZWxzZSB0aHJvdyBcImdvdCB3ZWlyZCBhcmd1bWVudHNcIlxuXG4gIGZpZ3VyZUN1cnJ5ID0gKHtmdW4sIGFyZ30pIC0+IFxuICAgIGlmIG5vdCBmdW4gdGhlbiAoZnVuKSAtPiB0YXJnZXRGIGFyZywgZnVuXG4gICAgaWYgbm90IGFyZyB0aGVuIChhcmcpIC0+IHRhcmdldEYgYXJnLCBmdW5cbiAgICBlbHNlIGlmIGZ1biBhbmQgYXJnIHRoZW4gdGFyZ2V0RiBhcmcsIGZ1blxuICAgIGVsc2UgdGhyb3cgXCJkaWRuJ3QgZ2V0IGFueSBhcmd1bWVudHNcIlxuXG4gICguLi5hcmdzKSAtPiBhcmdzIHw+IGZpZ3VyZUFyZ3MgfD4gZmlndXJlQ3VycnlcblxudG9DdXJyeSA9IDxbIG1hcCByZW1vdmUgXT5cblxubG9kYXNoLmVhY2ggdG9DdXJyeSwgKG5hbWUpIC0+XG4gIGV4cG9ydHNbXCJjI3tuYW1lfVwiXSA9IHdyYXAgbG9kYXNoW25hbWVdXG5cblxuXG4iXX0=
