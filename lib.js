(function(){
  var p, leshdash, toPromise, mapValues, head, tail, pwait, assign, flattenDeep, defaultsDeep, reduce, dChars, jsonQuery, jsonError, wait, waitCancel, abstractPad, pad, rpad, antipad, push, pop, token, identity, asyncDepthFirst, matchString, cbc, renameKeys, mapObject, randomId, time, second, minute, hour, pairsTails, pairs, mapFilter, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, toString$ = {}.toString;
  p = require('bluebird');
  leshdash = require('./index'), toPromise = leshdash.toPromise, mapValues = leshdash.mapValues, head = leshdash.head, tail = leshdash.tail, pwait = leshdash.pwait, assign = leshdash.assign, flattenDeep = leshdash.flattenDeep, defaultsDeep = leshdash.defaultsDeep, reduce = leshdash.reduce;
  out$.dChars = dChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  out$.jsonQuery = jsonQuery = function(path, object, seperator){
    var deeperObject;
    seperator == null && (seperator = "/");
    if (path.constructor === String) {
      path = path.split(seperator);
    }
    if (!path.length) {
      return object;
    } else {
      if (!(deeperObject = object[leshdash.head(path)])) {} else {
        return leshdash.jsonQuery(leshdash.tail(path), deeperObject);
      }
    }
  };
  out$.jsonError = jsonError = function(error){
    var serializeError;
    return serializeError = function(error){
      ({
        stack: error.stack,
        name: error.name,
        message: error.message
      });
      switch (error.constructor) {
      case Error:
        return serializeError(error);
      default:
        return {
          name: error.constructor.name,
          message: String(error)
        };
      }
    };
  };
  out$.wait = wait = function(t, f){
    return setTimeout(f, t);
  };
  out$.waitCancel = waitCancel = function(t, f){
    var id;
    id = leshdash.wait(t, f);
    return function(){
      return clearTimeout(id);
    };
  };
  out$.abstractPad = abstractPad = function(operation, success, text){
    var modifyText;
    if (text == null) {
      text = "";
    }
    if (text.constructor !== String) {
      text = String(text);
    }
    modifyText = function(text){
      if (success(text)) {
        return text;
      } else {
        return modifyText(operation(text));
      }
    };
    return modifyText(text);
  };
  out$.pad = pad = function(text, length, chr){
    chr == null && (chr = 0);
    return abstractPad(function(text){
      return chr + text;
    }, function(text){
      return text.length >= length;
    }, text);
  };
  out$.rpad = rpad = function(text, length, chr){
    chr == null && (chr = 0);
    return abstractPad(function(text){
      return text + chr;
    }, function(text){
      return text.length >= length;
    }, text);
  };
  out$.antipad = antipad = function(text, chr){
    chr == null && (chr = "0");
    return abstractPad(function(text){
      return text.slice(0, text.length - 1);
    }, function(text){
      return text[text.length - 1] === chr;
    }, text);
  };
  out$.push = push = function(array){
    var stuff, res$, i$, to$;
    res$ = [];
    for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    stuff = res$;
    return slice$.call(array).concat(slice$.call(stuff));
  };
  out$.pop = pop = function(object, key){
    var ret;
    ret = object[key];
    delete object.key;
    return ret;
  };
  out$.token = token = function(targetLen, chars){
    var ret;
    targetLen == null && (targetLen = 25);
    chars == null && (chars = dChars);
    ret = [];
    while (ret.length < targetLen) {
      ret.push(leshdash.sample(chars));
    }
    return ret.join('');
  };
  out$.identity = identity = function(it){
    return it;
  };
  out$.asyncDepthFirst = asyncDepthFirst = function(node, opts){
    var search;
    opts = leshdash.defaultsDeep(opts, {
      getChildren: function(){
        throw Error('unimplemented');
      },
      callback: function(){
        throw Error('unimplemented');
      }
    });
    search = function(node, visited){
      visited == null && (visited = {});
      return leshdash.maybeP(opts.callback(node)).then(function(){
        return opts.getChildren(node);
      }).then(function(children){
        if (children == null) {
          return node;
        } else {
          return p.props(leshdash.mapValues(children, function(node, id){
            if (visited[id] != null) {} else {
              return search(node, visited);
            }
          }));
        }
      });
    };
    return search(node);
  };
  out$.matchString = matchString = curry$(function(matcher, target){
    switch (toString$.call(matcher).slice(8, -1)) {
    case "String":
      return true;
    case "Array":
      return leshdash.find(matcher, leshdash.matchString);
    case "Function":
      if (ignore(nextLoc)) {}
      break;
    case "RegExp":
      if (matcher.test(nextLoc)) {}
    }
  });
  out$.cbc = cbc = function(cb, err, data){
    if (cb) {
      return cb(err, data);
    }
  };
  out$.renameKeys = renameKeys = function(target, map){
    return leshdash.mapKeys(target, function(val, keyName){
      var newName;
      if (newName = map[keyName]) {
        return newName;
      } else {
        return keyName;
      }
    });
  };
  out$.mapObject = mapObject = function(target, cb){
    var ret;
    ret = {};
    leshdash.each(target, function(val, key){
      var res;
      res = cb(val, key);
      if ((res != null ? res.constructor : void 8) !== Array) {
        return;
      }
      key = res[0], val = res[1];
      if (key) {
        return ret[key] = val;
      }
    });
    return ret;
  };
  out$.randomId = randomId = function(targetLen, alphabet){
    var ret;
    targetLen == null && (targetLen = 20);
    ret = "";
    if (!alphabet) {
      alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }
    while (ret.length < targetLen) {
      ret += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return ret;
  };
  out$.time = time = {
    second: second = 1000,
    minute: minute = second * 60,
    hour: hour = minute * 60
  };
  out$.pairsTails = pairsTails = function(array, cb){
    var ret;
    if (!cb) {
      cb = function(x, y){
        return [x, y];
      };
    }
    ret = leshdash.reduce(array, function(pairs, current){
      if (!pairs.length) {
        return [cb(void 8, current)];
      } else {
        return slice$.call(pairs).concat([cb(leshdash.last(leshdash.last(pairs)), current)]);
      }
    }, []);
    return slice$.call(ret).concat([cb(leshdash.last(leshdash.last(ret)), void 8)]);
  };
  out$.pairs = pairs = function(array, cb){
    var this$ = this;
    if (!cb) {
      cb = function(x, y){
        return [x, y];
      };
    }
    return leshdash.reduce(array, function(total, element, index){
      if (!index) {
        return [];
      }
      return slice$.call(total).concat([cb(array[index - 1], element)]);
    });
  };
  out$.mapFilter = mapFilter = function(target, cb){
    return reduce(target, function(ret, element){
      var newElement;
      if ((newElement = cb(element, target)) !== void 8) {
        return slice$.call(ret).concat([newElement]);
      } else {
        return ret;
      }
    });
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
