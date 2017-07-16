(function(){
  var p, leshdash, toPromise, mapValues, head, tail, pwait, assign, flattenDeep, defaultsDeep, reduce, dChars, jsonQuery, jsonError, wait, waitCancel, abstractPad, pad, rpad, antipad, push, pop, token, identity, asyncDepthFirst, matchString, cbc, renameKeys, mapObject, randomId, time, second, minute, hour, pairsTails, pairs, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, toString$ = {}.toString;
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
    var stuff;
    stuff = slice$.call(arguments, 1);
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
    ret = reduce(array, function(pairs, current){
      if (!pairs.length) {
        return [cb(void 8, current)];
      } else {
        return slice$.call(pairs).concat([cb(last(last(pairs)), current)]);
      }
    }, []);
    return slice$.call(ret).concat([cb(last(last(ret)), void 8)]);
  };
  out$.pairs = pairs = function(array, cb){
    var this$ = this;
    if (!cb) {
      cb = function(x, y){
        return [x, y];
      };
    }
    return reduce(this.path, function(total, element, index){
      if (!index) {
        return [];
      }
      if (index === array.length - 1) {
        return total;
      }
      return slice$.call(total).concat([cb(array[index - 1], element)]);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL3Jlc2JvdS9zZXJ2ZXJzaWRlL25vZGVfbW9kdWxlcy9sZXNoZGFzaC9saWIubHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7RUFHWSxDQUFWLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBO0VBQ0EsUUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsRUFBYyxTQUFkLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBYyxTQUFkLEVBQXlCLFNBQXpCLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBeUIsU0FBekIsRUFBb0MsSUFBcEMsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQTBDLElBQTFDLEVBQWdELEtBQWhELENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBZ0QsS0FBaEQsRUFBdUQsTUFBdkQsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUF1RCxNQUF2RCxFQUErRCxXQUEvRCxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQStELFdBQS9ELEVBQTRFLFlBQTVFLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBNEUsWUFBNUUsRUFBMEYsTUFBMUYsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUEwRjtnQkFHckYsTUFBTyxDQUFBLENBQUEsQ0FBRSxnRUFBZ0UsQ0FBQyxNQUFNLEVBQUE7bUJBRWhGLFNBQVUsQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsU0FBQTs7SUFBZSxzQkFBQSxZQUFhO0lBQzdDLElBQUcsSUFBSSxDQUFBLFdBQUcsQ0FBQSxHQUFBLENBQUcsTUFBYjtNQUF5QixJQUFLLENBQUEsQ0FBQSxDQUFFLElBQUksQ0FBQyxNQUFNLFNBQUE7O0lBQzNDLElBQUcsQ0FBSSxJQUFJLENBQUMsTUFBWjtNQUF3QixNQUFBLENBQU8sTUFBUDtLQUN4QjtNQUNFLElBQUcsQ0FBQSxDQUFJLFlBQWEsQ0FBQSxDQUFBLENBQUUsTUFB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LE9BQXJCLENBQWQsQ0FBQTs7T0FDUCxFQUpBO1dBTUYsV0FBQSxDQUFLLEdBQUwsQ0FBQSxRQUFBLENBQVUsRUFBVixDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBeUIsR0FBQSxDQUFMLENBQXBCLEVBQStCLE1BQW5CLENBQVosQ0FBQTs7ZUFHSyxLQUFNLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQTs7SUFDYixJQUFHLENBQUksRUFBUDtNQUFlLEVBQUcsQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBO2VBQVMsQ0FBRSxHQUFHLENBQUw7OztXQUU3QixPQUFPLElBQUMsQ0FBQSxNQUNOLFFBQUEsQ0FBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7TUFDRSxJQUFHLENBQUksS0FBUDtRQUFrQixNQUFBLENBQU8sRUFBUDs7TUFDbEIsSUFBRyxLQUFNLENBQUEsR0FBQSxDQUFJLEtBQUssQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQTVCO1FBQW9DLE1BQUEsQ0FBTyxLQUFQOzthQUNwQyxXQUFBLENBQUssS0FBTCxDQUFBLFFBQUEsQ0FBWSxFQUFaLENBQWdCLEtBQUssQ0FBQyxLQUFLLENBQUEsQ0FBQSxDQUFBLENBQU4sQ0FBckIsRUFBZ0MsT0FBbEIsQ0FBZCxDQUFBO0tBSkciLCJzb3VyY2VzQ29udGVudCI6WyIjIGF1dG9jb21waWxlXG5cbnJlcXVpcmUhIHtcbiAgYmx1ZWJpcmQ6IHBcbiAgJy4vaW5kZXgnOiAgeyB0b1Byb21pc2UsIG1hcFZhbHVlcywgaGVhZCwgdGFpbCwgcHdhaXQsIGFzc2lnbiwgZmxhdHRlbkRlZXAsIGRlZmF1bHRzRGVlcCwgcmVkdWNlIH06IGxlc2hkYXNoXG59XG5cbmV4cG9ydCBkQ2hhcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0ICcnXG5cbmV4cG9ydCBqc29uUXVlcnkgPSAocGF0aCwgb2JqZWN0LCBzZXBlcmF0b3I9XCIvXCIpIC0+XG4gIGlmIHBhdGhAQCBpcyBTdHJpbmcgdGhlbiBwYXRoID0gcGF0aC5zcGxpdCBzZXBlcmF0b3JcbiAgaWYgbm90IHBhdGgubGVuZ3RoIHRoZW4gcmV0dXJuIG9iamVjdFxuICBlbHNlXG4gICAgaWYgbm90IGRlZXBlck9iamVjdCA9IG9iamVjdFtsZXNoZGFzaC5oZWFkIHBhdGhdIHRoZW4gcmV0dXJuIHZvaWRcbiAgICBlbHNlIGxlc2hkYXNoLmpzb25RdWVyeSBsZXNoZGFzaC50YWlsKHBhdGgpLCBkZWVwZXJPYmplY3RcbiAgICAgIFxuZXhwb3J0IGpzb25FcnJvciA9IChlcnJvcikgLT5cbiAgc2VyaWFsaXplRXJyb3IgPSAoZXJyb3IpIC0+IGRvXG4gICAgc3RhY2s6IGVycm9yLnN0YWNrXG4gICAgbmFtZTogZXJyb3IubmFtZVxuICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2VcbiAgICBcbiAgICBzd2l0Y2ggZXJyb3IuY29uc3RydWN0b3JcbiAgICAgIHwgRXJyb3IgPT4gc2VyaWFsaXplRXJyb3IgZXJyb3JcbiAgICAgIHwgb3RoZXJ3aXNlID0+IHsgbmFtZTogZXJyb3IuY29uc3RydWN0b3IubmFtZSwgbWVzc2FnZTogU3RyaW5nKGVycm9yKSB9XG5cbmV4cG9ydCB3YWl0ID0gKHQsIGYpIC0+IHNldFRpbWVvdXQgZiwgdFxuXG5leHBvcnQgd2FpdENhbmNlbCA9ICh0LCBmKSAtPlxuICBpZCA9IGxlc2hkYXNoLndhaXQgdCwgZlxuICAtPiBjbGVhclRpbWVvdXQgaWRcblxuZXhwb3J0IGFic3RyYWN0UGFkID0gKG9wZXJhdGlvbiwgc3VjY2VzcywgdGV4dCkgLT5cbiAgaWYgbm90IHRleHQ/IHRoZW4gdGV4dCA9IFwiXCJcbiAgaWYgdGV4dC5jb25zdHJ1Y3RvciBpc250IFN0cmluZyB0aGVuIHRleHQgPSBTdHJpbmcgdGV4dFxuXG4gIG1vZGlmeVRleHQgPSAodGV4dCkgLT5cbiAgICBpZiBzdWNjZXNzKHRleHQpIHRoZW4gcmV0dXJuIHRleHRcbiAgICBlbHNlIG1vZGlmeVRleHQgb3BlcmF0aW9uIHRleHRcblxuICBtb2RpZnlUZXh0IHRleHRcblxuZXhwb3J0IHBhZCA9ICh0ZXh0LGxlbmd0aCxjaHI9MCkgLT5cbiAgYWJzdHJhY3RQYWQoXG4gICAgKCh0ZXh0KSAtPiBjaHIgKyB0ZXh0KSxcbiAgICAoKHRleHQpIC0+IHRleHQubGVuZ3RoID49IGxlbmd0aCksXG4gICAgdGV4dClcblxuZXhwb3J0IHJwYWQgPSAodGV4dCxsZW5ndGgsY2hyPTApIC0+XG4gIGFic3RyYWN0UGFkKFxuICAgICgodGV4dCkgLT4gdGV4dCArIGNociksXG4gICAgKCh0ZXh0KSAtPiB0ZXh0Lmxlbmd0aCA+PSBsZW5ndGgpLFxuICAgIHRleHQpXG5cbmV4cG9ydCBhbnRpcGFkID0gKHRleHQsY2hyPVwiMFwiKSAtPlxuICBhYnN0cmFjdFBhZChcbiAgICAoKHRleHQpIC0+IHRleHQuc2xpY2UoMCwgdGV4dC5sZW5ndGggLSAxKSksXG4gICAgKCh0ZXh0KSAtPiB0ZXh0W3RleHQubGVuZ3RoIC0gMV0gaXMgY2hyKSxcbiAgICB0ZXh0KVxuXG4jIGltbXV0YWJsZSBwdXNoXG5leHBvcnQgcHVzaCA9IChhcnJheSwgLi4uc3R1ZmYpIC0+IFsgLi4uYXJyYXksIC4uLnN0dWZmIF1cblxuZXhwb3J0IHBvcCA9IChvYmplY3QsIGtleSkgLT5cbiAgcmV0ID0gb2JqZWN0W2tleV1cbiAgZGVsZXRlIG9iamVjdC5rZXlcbiAgcmV0XG5cbmV4cG9ydCB0b2tlbiA9ICh0YXJnZXRMZW49MjUsIGNoYXJzPWRDaGFycykgLT5cbiAgcmV0ID0gW11cbiAgd2hpbGUgcmV0Lmxlbmd0aCA8IHRhcmdldExlblxuICAgIHJldC5wdXNoIGxlc2hkYXNoLnNhbXBsZSBjaGFyc1xuICByZXQuam9pbiAnJ1xuXG5leHBvcnQgaWRlbnRpdHkgPSAtPiBpdFxuICBcbmV4cG9ydCBhc3luY0RlcHRoRmlyc3QgPSAobm9kZSwgb3B0cykgLT5cbiAgXG4gIG9wdHMgPSBsZXNoZGFzaC5kZWZhdWx0c0RlZXAgb3B0cywgZG9cbiAgICBnZXRDaGlsZHJlbjogLT4gLi4uXG4gICAgY2FsbGJhY2s6IC0+IC4uLlxuICAgIFxuICBzZWFyY2ggPSAobm9kZSwgdmlzaXRlZD17fSkgLT5cbiAgICBsZXNoZGFzaC5tYXliZVAgb3B0cy5jYWxsYmFjayBub2RlXG4jICAgIC50aGVuIChyZXQpIC0+XG4jICAgICAgdmlzaXRlZCA8PDwgeyBcIiN7cmV0fVwiOiB0cnVlIH1cbiAgICAudGhlbiAtPiBvcHRzLmdldENoaWxkcmVuIG5vZGVcbiAgICAudGhlbiAoY2hpbGRyZW4pIC0+IFxuICAgICAgaWYgbm90IGNoaWxkcmVuPyB0aGVuIHJldHVybiBub2RlXG4gICAgICBlbHNlIHAucHJvcHMgbGVzaGRhc2gubWFwVmFsdWVzIGNoaWxkcmVuLCAobm9kZSwgaWQpIC0+IFxuICAgICAgICBpZiB2aXNpdGVkW2lkXT8gdGhlbiByZXR1cm4gZWxzZSBzZWFyY2ggbm9kZSwgdmlzaXRlZFxuICBcbiAgc2VhcmNoIG5vZGVcblxuZXhwb3J0IG1hdGNoU3RyaW5nID0gKG1hdGNoZXIsIHRhcmdldCkgLS0+XG4gIHN3aXRjaCB0eXBlb2YhIG1hdGNoZXJcbiAgICB8IFwiU3RyaW5nXCIgPT4gdHJ1ZVxuXG4gICAgfCBcIkFycmF5XCIgPT5cbiAgICAgIGxlc2hkYXNoLmZpbmQgbWF0Y2hlciwgbGVzaGRhc2gubWF0Y2hTdHJpbmdcblxuICAgIHwgXCJGdW5jdGlvblwiID0+XG4gICAgICBpZiBpZ25vcmUobmV4dExvYykgdGhlbiByZXR1cm5cblxuICAgIHwgXCJSZWdFeHBcIiA9PlxuICAgICAgaWYgbWF0Y2hlci50ZXN0IG5leHRMb2MgdGhlbiByZXR1cm5cblxuZXhwb3J0IGNiYyA9IChjYixlcnIsZGF0YSkgLT4gaWYgY2IgdGhlbiBjYiBlcnIsIGRhdGFcblxuZXhwb3J0IHJlbmFtZUtleXMgPSAodGFyZ2V0LCBtYXApIC0+XG4gIGxlc2hkYXNoLm1hcEtleXMgdGFyZ2V0LCAodmFsLGtleU5hbWUpIC0+IGlmIG5ld05hbWUgPSBtYXBba2V5TmFtZV0gdGhlbiBuZXdOYW1lIGVsc2Uga2V5TmFtZVxuXG5leHBvcnQgbWFwT2JqZWN0ID0gKHRhcmdldCwgY2IpIC0+XG4gIHJldCA9IHt9XG4gIFxuICBsZXNoZGFzaC5lYWNoIHRhcmdldCwgKHZhbCwga2V5KSAtPlxuICAgIHJlcyA9IGNiIHZhbCwga2V5XG4gICAgaWYgcmVzP0BAIGlzbnQgQXJyYXkgdGhlbiByZXR1cm5cbiAgICBbIGtleSwgdmFsIF0gPSByZXNcbiAgICBpZiBrZXkgdGhlbiByZXRba2V5XSA9IHZhbFxuICByZXRcbiAgXG5leHBvcnQgcmFuZG9tSWQgPSAodGFyZ2V0TGVuPTIwLCBhbHBoYWJldCkgLT5cbiAgcmV0ID0gXCJcIlxuICBpZiBub3QgYWxwaGFiZXQgdGhlbiBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eidcbiAgd2hpbGUgcmV0Lmxlbmd0aCA8IHRhcmdldExlblxuICAgIHJldCArPSBhbHBoYWJldFtNYXRoLmZsb29yKE1hdGgucmFuZG9tISAqIGFscGhhYmV0Lmxlbmd0aCldXG4gIHJldCAgICBcblxuZXhwb3J0IHRpbWUgPSBkb1xuICBzZWNvbmQ6IHNlY29uZCA9IDEwMDBcbiAgbWludXRlOiBtaW51dGUgPSBzZWNvbmQgKiA2MFxuICBob3VyOiBob3VyID0gbWludXRlICogNjBcblxuXG5leHBvcnQgcGFpcnNUYWlscyA9IChhcnJheSwgY2IpIC0+XG4gIGlmIG5vdCBjYiB0aGVuIGNiID0gKHgseSkgLT4gWyB4LCB5IF1cbiAgICBcbiAgcmV0ID0gcmVkdWNlIGRvXG4gICAgYXJyYXksXG4gICAgKHBhaXJzLCBjdXJyZW50KSAtPlxuICAgICAgaWYgbm90IHBhaXJzLmxlbmd0aCB0aGVuIFsgY2Iodm9pZCwgY3VycmVudCkgXVxuICAgICAgZWxzZSBbIC4uLnBhaXJzLCBjYiggKGxhc3QgbGFzdCBwYWlycyksIGN1cnJlbnQpIF1cbiAgICBbXVxuXG4gIFsgLi4ucmV0LCBjYiggKGxhc3QgbGFzdCByZXQpLCB2b2lkICkgIF1cblxuXG5leHBvcnQgcGFpcnMgPSAoYXJyYXksIGNiKSAtPlxuICBpZiBub3QgY2IgdGhlbiBjYiA9ICh4LHkpIC0+IFsgeCwgeSBdXG4gICAgXG4gIHJlZHVjZSBAcGF0aCxcbiAgICAodG90YWwsIGVsZW1lbnQsIGluZGV4KSB+PlxuICAgICAgaWYgbm90IGluZGV4IHRoZW4gcmV0dXJuIFtdXG4gICAgICBpZiBpbmRleCBpcyAoYXJyYXkubGVuZ3RoIC0gMSkgdGhlbiByZXR1cm4gdG90YWxcbiAgICAgIFsgLi4udG90YWwsIGNiKCBhcnJheVtpbmRleC0xXSwgZWxlbWVudCkgXVxuICAgICAgXG4iXX0=
