(function(){
  var leshdash, pwait, defaultsDeep, assign, flattenDeep, p, maybeP, toPromise, toCallback, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString, slice$ = [].slice;
  leshdash = require('./index'), pwait = leshdash.pwait, defaultsDeep = leshdash.defaultsDeep, assign = leshdash.assign, flattenDeep = leshdash.flattenDeep;
  p = require('bluebird');
  p.config({
    cancellation: true
  });
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
        return onCancel(function(){
          return clearTimeout(timeout);
        });
      });
    }
  };
  out$.maybeP = maybeP = function(thing){
    var this$ = this;
    return new p(function(resolve, reject){
      var ref$;
      if ((thing != null ? (ref$ = thing.then) != null ? ref$.constructor : void 8 : void 8) === Function) {
        thing.then(resolve);
        return thing['catch'](reject);
      } else if ((thing != null ? thing.constructor : void 8) === Error) {
        return reject(thing);
      } else {
        return resolve(thing);
      }
    });
  };
  out$.toPromise = toPromise = function(f){
    var args, this$ = this;
    args = slice$.call(arguments, 1);
    return new p(function(resolve, reject){
      var ret;
      ret = f.apply(this$, args.concat(function(err, data){
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      }));
      if ((ret != null ? ret.then.constructor : void 8) === Function) {
        ret.then(resolve);
        return ret['catch'](reject);
      }
    });
  };
  out$.toCallback = toCallback = function(f){
    var i$, args, cb, this$ = this;
    args = 1 < (i$ = arguments.length - 1) ? slice$.call(arguments, 1, i$) : (i$ = 1, []), cb = arguments[i$];
    return new p(function(resolve, reject){
      var ret;
      ret = f.apply(this$, args.concat(cb));
      if ((ret != null ? ret.then.constructor : void 8) === Function) {
        ret.then(function(it){
          return cb(void 8, it);
        });
        return ret['catch'](function(it){
          return cb(it);
        });
      }
    });
  };
}).call(this);
