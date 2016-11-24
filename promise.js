(function(){
  var p, pwait, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
  p = require('bluebird');
  out$.p = p;
  out$.pwait = pwait = function(t, f){
    var this$ = this;
    if (toString$.call(f).slice(8, -1) === 'Function') {
      return setTimeout(f, t);
    } else {
      return new p(function(resolve, reject){
        return setTimeout(function(){
          return resolve(f);
        }, t);
      });
    }
  };
}).call(this);
