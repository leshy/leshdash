(function(){
  var lodash, assign, defaultsDeep, ref$, out$ = typeof exports != 'undefined' && exports || this;
  lodash = require('lodash'), assign = lodash.assign, defaultsDeep = lodash.defaultsDeep;
  import$(out$, (ref$ = import$(import$(import$(lodash, require('./lib')), require('./curried')), require('./promise')), ref$.w = require('./wrap'), ref$));
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
