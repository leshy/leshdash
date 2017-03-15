(function(){
  var p, leshdash, toPromise, mapValues, head, tail, pwait, assign, flattenDeep, defaultsDeep, dChars, jsonQuery, jsonError, wait, waitCancel, abstractPad, pad, rpad, antipad, push, pop, token, identity, asyncDepthFirst, matchString, cbc, renameKeys, randomId, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, toString$ = {}.toString;
  p = require('bluebird');
  leshdash = require('./index'), toPromise = leshdash.toPromise, mapValues = leshdash.mapValues, head = leshdash.head, tail = leshdash.tail, pwait = leshdash.pwait, assign = leshdash.assign, flattenDeep = leshdash.flattenDeep, defaultsDeep = leshdash.defaultsDeep;
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
    return array.concat(stuff);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL3Jlc2JvdS9zZXJ2ZXJzaWRlL25vZGVfbW9kdWxlcy9sZXNoZGFzaC9saWIubHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7RUFHWSxDQUFWLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBO0VBQ0EsUUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsRUFBYyxTQUFkLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBYyxTQUFkLEVBQXlCLFNBQXpCLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBeUIsU0FBekIsRUFBb0MsSUFBcEMsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQTBDLElBQTFDLEVBQWdELEtBQWhELENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBZ0QsS0FBaEQsRUFBdUQsTUFBdkQsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUF1RCxNQUF2RCxFQUErRCxXQUEvRCxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQStELFdBQS9ELEVBQTRFLFlBQTVFLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBNEU7Z0JBR3ZFLE1BQU8sQ0FBQSxDQUFBLENBQUUsZ0VBQWdFLENBQUMsTUFBTSxFQUFBO21CQUVoRixTQUFVLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLFNBQUE7O0lBQWUsc0JBQUEsWUFBYTtJQUM3QyxJQUFHLElBQUksQ0FBQSxXQUFHLENBQUEsR0FBQSxDQUFHLE1BQWI7TUFBeUIsSUFBSyxDQUFBLENBQUEsQ0FBRSxJQUFJLENBQUMsTUFBTSxTQUFBOztJQUMzQyxJQUFHLENBQUksSUFBSSxDQUFDLE1BQVo7TUFBd0IsTUFBQSxDQUFPLE1BQVA7S0FDeEI7TUFDRSxJQUFHLENBQUEsQ0FBSSxZQUFhLENBQUEsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBVixDQUFlLElBQUEsQ0FBZixDQUF6QixD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QUE7QUFBQSxhQUFJO0lBRUwsS0FBQSxPQUFBO0FBQUEsYUFDUCxRQUFRLENBQUMsS0FBSyxTQUFTLFFBQVEsQ0FBQyxXQUFsQjtJQUVKLEtBQUEsVUFBQTtBQUFBLE1BQ1YsSUFBRyxNQUFILENBQVUsT0FBRCxDQUFUOztJQUVRLEtBQUEsUUFBQTtBQUFBLE1BQ1IsSUFBRyxPQUFPLENBQUMsSUFBWCxDQUFnQixPQUFBLENBQWhCOzs7YUFFQyxHQUFJLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUE7SUFBaUIsSUFBRyxFQUFIO2FBQVcsR0FBRyxLQUFLLElBQUw7OztvQkFFckMsVUFBVyxDQUFBLENBQUEsQ0FBRSxRQUFBLENBQUEsTUFBQSxFQUFBLEdBQUE7V0FDbEIsUUFBUSxDQUFDLFFBQVEsUUFBUSxRQUFBLENBQUEsR0FBQSxFQUFBLE9BQUE7O01BQWlCLElBQUcsT0FBUSxDQUFBLENBQUEsQ0FBRSxHQUFHLENBQUMsT0FBRCxDQUFoQjtlQUErQjtPQUFRO2VBQUs7O0tBQXJFOztrQkFFWixRQUFTLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxTQUFBLEVBQUEsUUFBQTs7SUFBQyxzQkFBQSxZQUFVO0lBQzNCLEdBQUksQ0FBQSxDQUFBLENBQUU7SUFDTixJQUFHLENBQUksUUFBUDtNQUFxQixRQUFTLENBQUEsQ0FBQSxDQUFFOztJQUNoQyxPQUFNLEdBQUcsQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFFLFNBQW5CO01BQ0UsR0FBSSxDQUFBLEVBQUEsQ0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFJLENBQUMsTUFBUSxDQUFGLENBQUUsQ0FBQSxDQUFBLENBQUUsUUFBUSxDQUFDLE1BQXpCLENBQVg7O1dBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiIyBhdXRvY29tcGlsZVxuXG5yZXF1aXJlISB7XG4gIGJsdWViaXJkOiBwXG4gICcuL2luZGV4JzogIHsgdG9Qcm9taXNlLCBtYXBWYWx1ZXMsIGhlYWQsIHRhaWwsIHB3YWl0LCBhc3NpZ24sIGZsYXR0ZW5EZWVwLCBkZWZhdWx0c0RlZXAgfTogbGVzaGRhc2hcbn1cblxuZXhwb3J0IGRDaGFycyA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicuc3BsaXQgJydcblxuZXhwb3J0IGpzb25RdWVyeSA9IChwYXRoLCBvYmplY3QsIHNlcGVyYXRvcj1cIi9cIikgLT5cbiAgaWYgcGF0aEBAIGlzIFN0cmluZyB0aGVuIHBhdGggPSBwYXRoLnNwbGl0IHNlcGVyYXRvclxuICBpZiBub3QgcGF0aC5sZW5ndGggdGhlbiByZXR1cm4gb2JqZWN0XG4gIGVsc2VcbiAgICBpZiBub3QgZGVlcGVyT2JqZWN0ID0gb2JqZWN0W2xlc2hkYXNoLmhlYWQgcGF0aF0gdGhlbiByZXR1cm4gdm9pZFxuICAgIGVsc2UgbGVzaGRhc2guanNvblF1ZXJ5IGxlc2hkYXNoLnRhaWwocGF0aCksIGRlZXBlck9iamVjdFxuICAgICAgXG5leHBvcnQganNvbkVycm9yID0gKGVycm9yKSAtPlxuICBzZXJpYWxpemVFcnJvciA9IChlcnJvcikgLT4gZG9cbiAgICBzdGFjazogZXJyb3Iuc3RhY2tcbiAgICBuYW1lOiBlcnJvci5uYW1lXG4gICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZVxuICAgIFxuICAgIHN3aXRjaCBlcnJvci5jb25zdHJ1Y3RvclxuICAgICAgfCBFcnJvciA9PiBzZXJpYWxpemVFcnJvciBlcnJvclxuICAgICAgfCBvdGhlcndpc2UgPT4geyBuYW1lOiBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lLCBtZXNzYWdlOiBTdHJpbmcoZXJyb3IpIH1cblxuZXhwb3J0IHdhaXQgPSAodCwgZikgLT4gc2V0VGltZW91dCBmLCB0XG5cbmV4cG9ydCB3YWl0Q2FuY2VsID0gKHQsIGYpIC0+XG4gIGlkID0gbGVzaGRhc2gud2FpdCB0LCBmXG4gIC0+IGNsZWFyVGltZW91dCBpZFxuXG5leHBvcnQgYWJzdHJhY3RQYWQgPSAob3BlcmF0aW9uLCBzdWNjZXNzLCB0ZXh0KSAtPlxuICBpZiBub3QgdGV4dD8gdGhlbiB0ZXh0ID0gXCJcIlxuICBpZiB0ZXh0LmNvbnN0cnVjdG9yIGlzbnQgU3RyaW5nIHRoZW4gdGV4dCA9IFN0cmluZyB0ZXh0XG5cbiAgbW9kaWZ5VGV4dCA9ICh0ZXh0KSAtPlxuICAgIGlmIHN1Y2Nlc3ModGV4dCkgdGhlbiByZXR1cm4gdGV4dFxuICAgIGVsc2UgbW9kaWZ5VGV4dCBvcGVyYXRpb24gdGV4dFxuXG4gIG1vZGlmeVRleHQgdGV4dFxuXG5leHBvcnQgcGFkID0gKHRleHQsbGVuZ3RoLGNocj0wKSAtPlxuICBhYnN0cmFjdFBhZChcbiAgICAoKHRleHQpIC0+IGNociArIHRleHQpLFxuICAgICgodGV4dCkgLT4gdGV4dC5sZW5ndGggPj0gbGVuZ3RoKSxcbiAgICB0ZXh0KVxuXG5leHBvcnQgcnBhZCA9ICh0ZXh0LGxlbmd0aCxjaHI9MCkgLT5cbiAgYWJzdHJhY3RQYWQoXG4gICAgKCh0ZXh0KSAtPiB0ZXh0ICsgY2hyKSxcbiAgICAoKHRleHQpIC0+IHRleHQubGVuZ3RoID49IGxlbmd0aCksXG4gICAgdGV4dClcblxuZXhwb3J0IGFudGlwYWQgPSAodGV4dCxjaHI9XCIwXCIpIC0+XG4gIGFic3RyYWN0UGFkKFxuICAgICgodGV4dCkgLT4gdGV4dC5zbGljZSgwLCB0ZXh0Lmxlbmd0aCAtIDEpKSxcbiAgICAoKHRleHQpIC0+IHRleHRbdGV4dC5sZW5ndGggLSAxXSBpcyBjaHIpLFxuICAgIHRleHQpXG5cbiMgaW1tdXRhYmxlIHB1c2hcbmV4cG9ydCBwdXNoID0gKGFycmF5LCAuLi5zdHVmZikgLT4gYXJyYXkuY29uY2F0IHN0dWZmICBcblxuZXhwb3J0IHBvcCA9IChvYmplY3QsIGtleSkgLT5cbiAgcmV0ID0gb2JqZWN0W2tleV1cbiAgZGVsZXRlIG9iamVjdC5rZXlcbiAgcmV0XG5cblxuZXhwb3J0IHRva2VuID0gKHRhcmdldExlbj0yNSwgY2hhcnM9ZENoYXJzKSAtPlxuICByZXQgPSBbXVxuICB3aGlsZSByZXQubGVuZ3RoIDwgdGFyZ2V0TGVuXG4gICAgcmV0LnB1c2ggbGVzaGRhc2guc2FtcGxlIGNoYXJzXG4gIHJldC5qb2luICcnXG5cbmV4cG9ydCBpZGVudGl0eSA9IC0+IGl0XG4gIFxuZXhwb3J0IGFzeW5jRGVwdGhGaXJzdCA9IChub2RlLCBvcHRzKSAtPlxuICBcbiAgb3B0cyA9IGxlc2hkYXNoLmRlZmF1bHRzRGVlcCBvcHRzLCBkb1xuICAgIGdldENoaWxkcmVuOiAtPiAuLi5cbiAgICBjYWxsYmFjazogLT4gLi4uXG4gICAgXG4gIHNlYXJjaCA9IChub2RlLCB2aXNpdGVkPXt9KSAtPlxuICAgIGxlc2hkYXNoLm1heWJlUCBvcHRzLmNhbGxiYWNrIG5vZGVcbiMgICAgLnRoZW4gKHJldCkgLT5cbiMgICAgICB2aXNpdGVkIDw8PCB7IFwiI3tyZXR9XCI6IHRydWUgfVxuICAgIC50aGVuIC0+IG9wdHMuZ2V0Q2hpbGRyZW4gbm9kZVxuICAgIC50aGVuIChjaGlsZHJlbikgLT4gXG4gICAgICBpZiBub3QgY2hpbGRyZW4/IHRoZW4gcmV0dXJuIG5vZGVcbiAgICAgIGVsc2UgcC5wcm9wcyBsZXNoZGFzaC5tYXBWYWx1ZXMgY2hpbGRyZW4sIChub2RlLCBpZCkgLT4gXG4gICAgICAgIGlmIHZpc2l0ZWRbaWRdPyB0aGVuIHJldHVybiBlbHNlIHNlYXJjaCBub2RlLCB2aXNpdGVkXG4gIFxuICBzZWFyY2ggbm9kZVxuXG5leHBvcnQgbWF0Y2hTdHJpbmcgPSAobWF0Y2hlciwgdGFyZ2V0KSAtLT5cbiAgc3dpdGNoIHR5cGVvZiEgbWF0Y2hlclxuICAgIHwgXCJTdHJpbmdcIiA9PiB0cnVlXG5cbiAgICB8IFwiQXJyYXlcIiA9PlxuICAgICAgbGVzaGRhc2guZmluZCBtYXRjaGVyLCBsZXNoZGFzaC5tYXRjaFN0cmluZ1xuXG4gICAgfCBcIkZ1bmN0aW9uXCIgPT5cbiAgICAgIGlmIGlnbm9yZShuZXh0TG9jKSB0aGVuIHJldHVyblxuXG4gICAgfCBcIlJlZ0V4cFwiID0+XG4gICAgICBpZiBtYXRjaGVyLnRlc3QgbmV4dExvYyB0aGVuIHJldHVyblxuXG5leHBvcnQgY2JjID0gKGNiLGVycixkYXRhKSAtPiBpZiBjYiB0aGVuIGNiIGVyciwgZGF0YVxuXG5leHBvcnQgcmVuYW1lS2V5cyA9ICh0YXJnZXQsIG1hcCkgLT5cbiAgbGVzaGRhc2gubWFwS2V5cyB0YXJnZXQsICh2YWwsa2V5TmFtZSkgLT4gaWYgbmV3TmFtZSA9IG1hcFtrZXlOYW1lXSB0aGVuIG5ld05hbWUgZWxzZSBrZXlOYW1lXG5cbmV4cG9ydCByYW5kb21JZCA9ICh0YXJnZXRMZW49MjAsIGFscGhhYmV0KSAtPlxuICByZXQgPSBcIlwiXG4gIGlmIG5vdCBhbHBoYWJldCB0aGVuIGFscGhhYmV0ID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6J1xuICB3aGlsZSByZXQubGVuZ3RoIDwgdGFyZ2V0TGVuXG4gICAgcmV0ICs9IGFscGhhYmV0W01hdGguZmxvb3IoTWF0aC5yYW5kb20hICogYWxwaGFiZXQubGVuZ3RoKV1cbiAgcmV0ICAgIFxuIl19
