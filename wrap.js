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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL25vZGVsaWJzL2xlc2hkYXNoL3dyYXAubHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7RUFHWSxDQUFWLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBO0VBQ0EsSUFBQSxHQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsRUFBVSxJQUFWLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVSxJQUFWLEVBQWdCLElBQWhCLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZ0I7RUFDaEIsQ0FBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsRUFBYyxLQUFkLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYyxLQUFkLEVBQXFCLFlBQXJCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBcUIsWUFBckIsRUFBbUMsTUFBbkMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFtQyxNQUFuQyxFQUEyQyxXQUEzQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQTJDO2dCQUszQztJQUFBLFVBQVUsUUFBUyxDQUFBLENBQUEsQ0FDakI7TUFBQSxTQUFTLFFBQUEsQ0FBQSxRQUFBLEVBQUEsSUFBQTtlQUFvQjs7TUFFN0IsT0FBTyxRQUFBLENBQUEsUUFBQSxFQUFBLElBQUE7ZUFDTCxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFFLElBQUYsQ0FBQTs7TUFFMUIsWUFBWSxRQUFBLENBQUEsUUFBQSxFQUFBLElBQUE7UUFDVixJQUFHLFFBQUg7aUJBQWlCLFdBQUEsQ0FBSyxRQUFMLENBQUEsUUFBQSxDQUFlLElBQWYsQ0FBQTtTQUNqQjtpQkFBSyxDQUFFLElBQUY7OztJQVBQO0lBU0YsVUFBVSxRQUFTLENBQUEsQ0FBQSxDQUNqQjtNQUFBLE9BQU8sUUFBQSxDQUFBLFFBQUEsRUFBQSxHQUFBO2VBQ0wsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksVUFBVSxHQUFYLEdBQWlCLFFBQUEsQ0FBQSxJQUFBOztVQUFLLGtC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LENBQUEsQ0FBQSxLQUFNLEVBQUUsUUFBQSxDQUFBLE9BQUEsRUFBQSxNQUFBO2NBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRTtxQkFDbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFFO2FBRks7Ozs7O0VBL0ZoQyIsInNvdXJjZXNDb250ZW50IjpbIiMgYXV0b2NvbXBpbGVcblxucmVxdWlyZSEge1xuICBibHVlYmlyZDogcFxuICBsb2Rhc2g6IHsgaGVhZCwgdGFpbCB9XG4gICcuL2luZGV4JzogIHsgcHdhaXQsIGRlZmF1bHRzRGVlcCwgYXNzaWduLCBmbGF0dGVuRGVlcCB9OiBfXG59XG5cbmV4cG9ydCBkb1xuXG4gIGFyZ3NKb2luOiBhcmdzSm9pbiA9IGRvXG4gICAgcmVwbGFjZTogKHByZXZBcmdzLCBhcmdzKSAtPiBhcmdzXG4gICAgXG4gICAgYXJyYXk6IChwcmV2QXJncywgYXJncykgLT5cbiAgICAgIChwcmV2QXJncyBvciBbXSkuY29uY2F0IFsgYXJncyBdXG4gICAgICBcbiAgICBtdWx0aUFycmF5OiAocHJldkFyZ3MsIGFyZ3MpIC0+XG4gICAgICBpZiBwcmV2QXJncyB0aGVuIFsgLi4ucHJldkFyZ3MsIGFyZ3MgXVxuICAgICAgZWxzZSBbIGFyZ3MgXVxuXG4gIHJldFNwbGl0OiByZXRTcGxpdCA9IGRvXG4gICAgYXJyYXk6IChwcm9taXNlcywgcmV0KSAtPlxuICAgICAgXy5lYWNoIF8uemlwKHByb21pc2VzLCByZXQpLCAoWyB7IHJlc29sdmUgfSwgdmFsdWUgXSApIC0+IHJlc29sdmUgdmFsdWVcbiAgICBcbiAgbGF6eSA6IChmKSAtPlxuICAgIHJlcyA9IHt9XG4gICAgKC4uLmFyZ3MpIC0+XG4gICAgICBpZiByZXMucHJvbWlzZSB0aGVuIHJlcy5wcm9taXNlXG4gICAgICBlbHNlIHJlcy5wcm9taXNlID0gZi5hcHBseSBALCBhcmdzXG5cbiAgbGlzdDogKGYpIC0+ICguLi5zdHVmZikgLT4gZi5jYWxsIEAsIGZsYXR0ZW5EZWVwIHN0dWZmXG5cbiAgaWQ6IChmKSAtPiAoLi4uYXJncykgLT4gZi5hcHBseSBALCBhcmdzXG5cbiAgY2FuY2VsOiAoZiwgZGF0YSkgLT5cbiAgICBjYW5jZWwgPSB2b2lkXG4gICAgKC4uLmFyZ3MpIC0+XG4gICAgICBpZiBjYW5jZWw/QEAgaXMgRnVuY3Rpb24gdGhlbiBjYW5jZWwhXG4gICAgICBjYW5jZWwgOj0gZi5hcHBseSBALCBhcmdzXG5cbiAgdHlwZUNhc3Q6IChUeXBlLCBmKSAtPlxuICAgICguLi5hcmdzKSAtPlxuICAgICAgaWYgKGggPSBoZWFkKGFyZ3MpPykgYW5kIGhAQCBpc250IFR5cGVcbiAgICAgICAgYXJncyA9IFsgbmV3IFR5cGUoaGVhZCBhcmdzKSwgLi4uKHRhaWwgYXJncykgXVxuICAgICAgZi5hcHBseSBALCBhcmdzXG5cbiAgZGVsYXlBZ2dyZWdhdGU6IChvcHRzLCBmKSAtPlxuICAgIGlmIG9wdHM/QEAgaXMgRnVuY3Rpb24gdGhlbiBmID0gb3B0czsgb3B0cyA9IHt9XG5cbiAgICBkb3B0cyA9IGRvXG4gICAgICBkZWxheTogMTAwXG4gICAgICBjYW5jZWw6IHRydWVcbiAgICAgIGFyZ3NKb2luOiBhcmdzSm9pbi5hcnJheVxuICAgICAgcmV0U3BsaXQ6IGZhbHNlXG5cbiAgICBvcHRzID0gZG9wdHMgPDw8IG9wdHNcblxuICAgIGVudiA9IHt9XG5cbiAgICAoLi4uYXJncykgLT5cbiAgICAgIGlmIG9wdHMuY2FuY2VsIHRoZW4gZW52LmNhbmNlbD8hXG4gICAgICBcbiAgICAgIGVudi5hcmdzID0gb3B0cy5hcmdzSm9pbiBlbnYuYXJncywgYXJnc1xuICAgICAgXG4gICAgICBkZWxheSA9IF8ucHdhaXQgb3B0cy5kZWxheVxuICAgICAgLnRoZW4gfj4gXG5cbiAgICAgICAgcmVzZXRFbnYgPSAtPlxuICAgICAgICAgIHJldCA9IHt9IDw8PCBlbnZcbiAgICAgICAgICBfLmVhY2ggZW52LCAodmFsLCBrZXkpIC0+ICBkZWxldGUgZW52W2tleV1cbiAgICAgICAgICByZXRcbiAgICAgICAgXG4gICAgICAgIGYuYXBwbHkgQCwgZW52LmFyZ3NcblxuICAgICAgICAudGhlbiAodmFsKSAtPlxuICAgICAgICAgIGVudiA9IHJlc2V0RW52KClcbiAgICAgICAgICBcbiAgICAgICAgICBpZiBub3Qgb3B0cy5yZXRTcGxpdCB0aGVuIGVudi5yZXQucmVzb2x2ZSB2YWxcbiAgICAgICAgICBlbHNlIG9wdHMucmV0U3BsaXQgZW52LnJldCwgdmFsXG4gICAgICAgICAgXG4gICAgICAgIC5jYXRjaCAodmFsKSAtPlxuICAgICAgICAgIGVudiA9IHJlc2V0RW52KClcbiAgICAgICAgICAgIFxuICAgICAgICAgIGlmIG5vdCBvcHRzLnJldFNwbGl0IHRoZW4gZW52LnJldC5yZWplY3QgdmFsXG4gICAgICAgICAgZWxzZSBfLmVhY2ggZW52LnJldCwgKC5yZWplY3QgdmFsKVxuXG4gICAgICBlbnYuY2FuY2VsID0gLT5cbiAgICAgICAgZGVsZXRlIGVudi5jYW5jZWxcbiAgICAgICAgZGVsYXkuY2FuY2VsKClcblxuICAgICAgaWYgb3B0cy5yZXRTcGxpdFxuICAgICAgICBpZiBub3QgZW52LnJldCB0aGVuIGVudi5yZXQgPSBbXVxuICAgICAgICAgIFxuICAgICAgICByZXQgPSB7fVxuICAgICAgICBlbnYucmV0LnB1c2ggcmV0XG4gICAgICAgIFxuICAgICAgICByZXQucHJvbWlzZSA9IG5ldyBwIChyZXNvbHZlLHJlamVjdCkgfj5cbiAgICAgICAgICByZXQucmVzb2x2ZSA9IHJlc29sdmVcbiAgICAgICAgICByZXQucmVqZWN0ID0gcmVqZWN0XG5cbiAgICAgIGVsc2VcblxuICAgICAgICBpZiBlbnYucmV0IHRoZW4gcmV0dXJuIGVudi5yZXQucHJvbWlzZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZW52LnJldCA9IHt9XG4gICAgICAgICAgZW52LnJldC5wcm9taXNlID0gbmV3IHAgKHJlc29sdmUscmVqZWN0KSB+PlxuICAgICAgICAgICAgZW52LnJldC5yZXNvbHZlID0gcmVzb2x2ZVxuICAgICAgICAgICAgZW52LnJldC5yZWplY3QgPSByZWplY3RcblxuIl19
