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
