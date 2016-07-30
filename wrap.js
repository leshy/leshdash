(function(){
  var ref$, assign, flattenDeep, slice$ = [].slice;
  ref$ = require('lodash'), assign = ref$.assign, flattenDeep = ref$.flattenDeep;
  module.exports = {
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
      console.log('cancelF defined');
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
    delayCancel: function(f){
      return true;
    }
  };
}).call(this);
