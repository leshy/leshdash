(function(){
  var leshdash, pwait, defaultsDeep, assign, flattenDeep, p, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
  leshdash = require('./index'), pwait = leshdash.pwait, defaultsDeep = leshdash.defaultsDeep, assign = leshdash.assign, flattenDeep = leshdash.flattenDeep;
  p = require('bluebird');
  out$.p = p;
  out$.pwait = pwait = function(t, f){
    var this$ = this;
    if (toString$.call(f).slice(8, -1) === 'Function') {
      return setTimeout(f, t);
    } else {
      return new p(function(resolve, reject, onCancel){
        var timeout;
        timeout = setTimeout(function(){
          return resolve(f);
        }, t);
        return onCancel = function(){
          return clearTimeout(timeout);
        };
      });
    }
  };
}).call(this);
