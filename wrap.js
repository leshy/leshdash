(function(){
  var p, ref$, head, tail, _, pwait, defaultsDeep, assign, flattenDeep, argsJoin, retSplit, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
  p = require('bluebird');
  ref$ = require('lodash'), head = ref$.head, tail = ref$.tail;
  _ = require('./index'), pwait = _.pwait, defaultsDeep = _.defaultsDeep, assign = _.assign, flattenDeep = _.flattenDeep;
  import$(out$, {
    argsJoin: argsJoin = {
      replace: function(prevArgs, args){
        return args;
      },
      array: function(prevArgs, args){
        return (prevArgs || []).concat([args]);
      },
      multiArray: function(prevArgs, args){
        if (prevArgs) {
          return slice$.call(prevArgs).concat([args]);
        } else {
          return [args];
        }
      }
    },
    retSplit: retSplit = {
      array: function(promises, ret){
        return _.each(_.zip(promises, ret), function(arg$){
          var resolve, value;
          resolve = arg$[0].resolve, value = arg$[1];
          return resolve(value);
        });
      }
    },
    lazy: function(f){
      var res;
      res = {};
      return function(){
        var args, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        if (res.promise) {
          return res.promise;
        } else {
          return res.promise = f.apply(this, args);
        }
      };
    },
    list: function(f){
      return function(){
        var stuff, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        stuff = res$;
        return f.call(this, flattenDeep(stuff));
      };
    },
    id: function(f){
      return function(){
        var args, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        return f.apply(this, args);
      };
    },
    cooldown: function(time, f){
      var data, startCooldown;
      data = {};
      startCooldown = function(){
        data.cooling = true;
        return setTimeout(function(){
          return data.cooling = false;
        }, time);
      };
      return function(){
        var args, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        if (data.cooling) {
          return false;
        } else {
          startCooldown();
          return f.apply(this, args);
        }
      };
    },
    cancel: function(f, data){
      var cancel;
      cancel = void 8;
      return function(){
        var args, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        if ((cancel != null ? cancel.constructor : void 8) === Function) {
          cancel();
        }
        return cancel = f.apply(this, args);
      };
    },
    typeCast: function(Type, f){
      return function(){
        var args, res$, i$, to$, h;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        if ((h = head(args) != null) && h.constructor !== Type) {
          args = [new Type(head(args))].concat(slice$.call(tail(args)));
        }
        return f.apply(this, args);
      };
    },
    delayAggregate: function(opts, f){
      var dopts, env;
      if ((opts != null ? opts.constructor : void 8) === Function) {
        f = opts;
        opts = {};
      }
      dopts = {
        delay: 100,
        cancel: true,
        argsJoin: argsJoin.array,
        retSplit: false
      };
      opts = import$(dopts, opts);
      env = {};
      return function(){
        var args, res$, i$, to$, delay, ret, this$ = this;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        if (opts.cancel) {
          if (typeof env.cancel == 'function') {
            env.cancel();
          }
        }
        env.args = opts.argsJoin(env.args, args);
        delay = _.pwait(opts.delay).then(function(){
          var resetEnv;
          resetEnv = function(){
            var ret;
            ret = import$({}, env);
            _.each(env, function(val, key){
              var ref$;
              return ref$ = env[key], delete env[key], ref$;
            });
            return ret;
          };
          return f.apply(this$, env.args).then(function(val){
            var env;
            env = resetEnv();
            if (!opts.retSplit) {
              return env.ret.resolve(val);
            } else {
              return opts.retSplit(env.ret, val);
            }
          })['catch'](function(val){
            var env, this$ = this;
            env = resetEnv();
            if (!opts.retSplit) {
              return env.ret.reject(val);
            } else {
              return _.each(env.ret, function(it){
                return it.reject(val);
              });
            }
          });
        });
        env.cancel = function(){
          delete env.cancel;
          return delay.cancel();
        };
        if (opts.retSplit) {
          if (!env.ret) {
            env.ret = [];
          }
          ret = {};
          env.ret.push(ret);
          return ret.promise = new p(function(resolve, reject){
            ret.resolve = resolve;
            return ret.reject = reject;
          });
        } else {
          if (env.ret) {
            return env.ret.promise;
          } else {
            env.ret = {};
            return env.ret.promise = new p(function(resolve, reject){
              env.ret.resolve = resolve;
              return env.ret.reject = reject;
            });
          }
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
