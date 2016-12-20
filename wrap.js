(function(){
  var p, _, pwait, defaultsDeep, assign, flattenDeep, argsJoin, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
  p = require('bluebird');
  _ = require('./index'), pwait = _.pwait, defaultsDeep = _.defaultsDeep, assign = _.assign, flattenDeep = _.flattenDeep;
  import$(out$, {
    argsJoin: argsJoin = {
      replace: function(prevArgs, args){
        return args;
      },
      array: function(prevArgs, args){
        return (prevArgs || []).concat([args]);
      }
    },
    lazy: function(f){
      var res;
      res = {};
      return function(){
        var args;
        args = slice$.call(arguments);
        if (res.promise) {
          return res.promise;
        } else {
          return res.promise = f.apply(this, args);
        }
      };
    },
    list: function(f){
      return function(){
        var stuff;
        stuff = slice$.call(arguments);
        return f.call(this, flattenDeep(stuff));
      };
    },
    id: function(f){
      return function(){
        var args;
        args = slice$.call(arguments);
        return f.apply(this, args);
      };
    },
    cancel: function(f, data){
      var cancel;
      cancel = void 8;
      return function(){
        var args;
        args = slice$.call(arguments);
        if ((cancel != null ? cancel.constructor : void 8) === Function) {
          cancel();
        }
        return cancel = f.apply(this, args);
      };
    },
    delayAggregate: function(opts, f){
      var env;
      if ((opts != null ? opts.constructor : void 8) === Function) {
        f = opts;
        opts = {};
      }
      opts = _.defaultsDeep({
        delay: 100,
        cancel: true,
        argsJoin: argsJoin.array,
        retSplit: false
      }, opts);
      env = {};
      return function(){
        var args, delay, this$ = this;
        args = slice$.call(arguments);
        if (opts.cancel) {
          if (typeof env.cancel == 'function') {
            env.cancel();
          }
        }
        env.args = opts.argsJoin(env.args, args);
        delay = _.pwait(opts.delay).then(function(){
          return f.apply(this, env.args).then(function(val){
            return env.res.resolve(val);
          });
        });
        env.cancel = function(){
          delete env.cancel;
          return delay.cancel();
        };
        if (env.res) {
          return env.res.promise;
        } else {
          env.res = {};
          return env.res.promise = new p(function(resolve, reject){
            env.res.resolve = resolve;
            return env.res.reject = reject;
          });
        }
      };
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
