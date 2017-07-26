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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL3Jlc2JvdS9zZXJ2ZXJzaWRlL25vZGVfbW9kdWxlcy9sZXNoZGFzaC9saWIubHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7RUFHWSxDQUFWLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBO0VBQ0EsUUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsRUFBYyxTQUFkLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBYyxTQUFkLEVBQXlCLFNBQXpCLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBeUIsU0FBekIsRUFBb0MsSUFBcEMsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQTBDLElBQTFDLEVBQWdELEtBQWhELENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBZ0QsS0FBaEQsRUFBdUQsTUFBdkQsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUF1RCxNQUF2RCxFQUErRCxXQUEvRCxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQStELFdBQS9ELEVBQTRFLFlBQTVFLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBNEUsWUFBNUUsRUFBMEYsTUFBMUYsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUEwRjtnQkFHckYsTUFBTyxDQUFBLENBQUEsQ0FBRSxnRUFBZ0UsQ0FBQyxNQUFNLEVBQUE7bUJBRWhGLFNBQVUsQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsU0FBQTs7SUFBZSxzQkFBQSxZQUFhO0lBQzdDLElBQUcsSUFBSSxDQUFBLFdBQUcsQ0FBQSxHQUFBLENBQUcsTUFBYjtNQUF5QixJQUFLLENBQUEsQ0FBQSxDQUFFLElBQUksQ0FBQyxNQUFNLFNBQUE7O0lBQzNDLElBQUcsQ0FBSSxJQUFJLENBQUMsTUFBWjtNQUF3QixNQUFBLENBQU8sTUFBUDtLQUN4QjtNQUNFLElBQUcsQ0FBQSxDQUFJLFlBQWEsQ0FBQSxDQUFBLENBQUUsTUFB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eEMsQ0FBNkMsS0FBQSxDQUFkLENBQS9CLEVBQXFELE9BQXZDLENBQWQsQ0FBQTs7T0FDUCxFQUpBO1dBTUYsV0FBQSxDQUFLLEdBQUwsQ0FBQSxRQUFBLENBQVUsRUFBVixDQUFlLFFBQVEsQ0FBQyxJQUF4QixDQUE2QixRQUFRLENBQUMsSUFBdEMsQ0FBMkMsR0FBQSxDQUFkLENBQTdCLEVBQWlELE1BQXJDLENBQVosQ0FBQTs7ZUFFSyxLQUFNLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQTs7SUFDYixJQUFHLENBQUksRUFBUDtNQUFlLEVBQUcsQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBO2VBQVMsQ0FBRSxHQUFHLENBQUw7OztXQUU3QixRQUFRLENBQUMsT0FBTyxPQUNkLFFBQUEsQ0FBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7TUFDRSxJQUFHLENBQUksS0FBUDtRQUFrQixNQUFBLENBQU8sRUFBUDs7YUFDbEIsV0FBQSxDQUFLLEtBQUwsQ0FBQSxRQUFBLENBQVksRUFBWixDQUFnQixLQUFLLENBQUMsS0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFOLENBQXJCLEVBQWdDLE9BQWxCLENBQWQsQ0FBQTtLQUhZIiwic291cmNlc0NvbnRlbnQiOlsiIyBhdXRvY29tcGlsZVxuXG5yZXF1aXJlISB7XG4gIGJsdWViaXJkOiBwXG4gICcuL2luZGV4JzogIHsgdG9Qcm9taXNlLCBtYXBWYWx1ZXMsIGhlYWQsIHRhaWwsIHB3YWl0LCBhc3NpZ24sIGZsYXR0ZW5EZWVwLCBkZWZhdWx0c0RlZXAsIHJlZHVjZSB9OiBsZXNoZGFzaFxufVxuXG5leHBvcnQgZENoYXJzID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCAnJ1xuXG5leHBvcnQganNvblF1ZXJ5ID0gKHBhdGgsIG9iamVjdCwgc2VwZXJhdG9yPVwiL1wiKSAtPlxuICBpZiBwYXRoQEAgaXMgU3RyaW5nIHRoZW4gcGF0aCA9IHBhdGguc3BsaXQgc2VwZXJhdG9yXG4gIGlmIG5vdCBwYXRoLmxlbmd0aCB0aGVuIHJldHVybiBvYmplY3RcbiAgZWxzZVxuICAgIGlmIG5vdCBkZWVwZXJPYmplY3QgPSBvYmplY3RbbGVzaGRhc2guaGVhZCBwYXRoXSB0aGVuIHJldHVybiB2b2lkXG4gICAgZWxzZSBsZXNoZGFzaC5qc29uUXVlcnkgbGVzaGRhc2gudGFpbChwYXRoKSwgZGVlcGVyT2JqZWN0XG4gICAgICBcbmV4cG9ydCBqc29uRXJyb3IgPSAoZXJyb3IpIC0+XG4gIHNlcmlhbGl6ZUVycm9yID0gKGVycm9yKSAtPiBkb1xuICAgIHN0YWNrOiBlcnJvci5zdGFja1xuICAgIG5hbWU6IGVycm9yLm5hbWVcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlXG4gICAgXG4gICAgc3dpdGNoIGVycm9yLmNvbnN0cnVjdG9yXG4gICAgICB8IEVycm9yID0+IHNlcmlhbGl6ZUVycm9yIGVycm9yXG4gICAgICB8IG90aGVyd2lzZSA9PiB7IG5hbWU6IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUsIG1lc3NhZ2U6IFN0cmluZyhlcnJvcikgfVxuXG5leHBvcnQgd2FpdCA9ICh0LCBmKSAtPiBzZXRUaW1lb3V0IGYsIHRcblxuZXhwb3J0IHdhaXRDYW5jZWwgPSAodCwgZikgLT5cbiAgaWQgPSBsZXNoZGFzaC53YWl0IHQsIGZcbiAgLT4gY2xlYXJUaW1lb3V0IGlkXG5cbmV4cG9ydCBhYnN0cmFjdFBhZCA9IChvcGVyYXRpb24sIHN1Y2Nlc3MsIHRleHQpIC0+XG4gIGlmIG5vdCB0ZXh0PyB0aGVuIHRleHQgPSBcIlwiXG4gIGlmIHRleHQuY29uc3RydWN0b3IgaXNudCBTdHJpbmcgdGhlbiB0ZXh0ID0gU3RyaW5nIHRleHRcblxuICBtb2RpZnlUZXh0ID0gKHRleHQpIC0+XG4gICAgaWYgc3VjY2Vzcyh0ZXh0KSB0aGVuIHJldHVybiB0ZXh0XG4gICAgZWxzZSBtb2RpZnlUZXh0IG9wZXJhdGlvbiB0ZXh0XG5cbiAgbW9kaWZ5VGV4dCB0ZXh0XG5cbmV4cG9ydCBwYWQgPSAodGV4dCxsZW5ndGgsY2hyPTApIC0+XG4gIGFic3RyYWN0UGFkKFxuICAgICgodGV4dCkgLT4gY2hyICsgdGV4dCksXG4gICAgKCh0ZXh0KSAtPiB0ZXh0Lmxlbmd0aCA+PSBsZW5ndGgpLFxuICAgIHRleHQpXG5cbmV4cG9ydCBycGFkID0gKHRleHQsbGVuZ3RoLGNocj0wKSAtPlxuICBhYnN0cmFjdFBhZChcbiAgICAoKHRleHQpIC0+IHRleHQgKyBjaHIpLFxuICAgICgodGV4dCkgLT4gdGV4dC5sZW5ndGggPj0gbGVuZ3RoKSxcbiAgICB0ZXh0KVxuXG5leHBvcnQgYW50aXBhZCA9ICh0ZXh0LGNocj1cIjBcIikgLT5cbiAgYWJzdHJhY3RQYWQoXG4gICAgKCh0ZXh0KSAtPiB0ZXh0LnNsaWNlKDAsIHRleHQubGVuZ3RoIC0gMSkpLFxuICAgICgodGV4dCkgLT4gdGV4dFt0ZXh0Lmxlbmd0aCAtIDFdIGlzIGNociksXG4gICAgdGV4dClcblxuIyBpbW11dGFibGUgcHVzaFxuZXhwb3J0IHB1c2ggPSAoYXJyYXksIC4uLnN0dWZmKSAtPiBbIC4uLmFycmF5LCAuLi5zdHVmZiBdXG5cbmV4cG9ydCBwb3AgPSAob2JqZWN0LCBrZXkpIC0+XG4gIHJldCA9IG9iamVjdFtrZXldXG4gIGRlbGV0ZSBvYmplY3Qua2V5XG4gIHJldFxuXG5leHBvcnQgdG9rZW4gPSAodGFyZ2V0TGVuPTI1LCBjaGFycz1kQ2hhcnMpIC0+XG4gIHJldCA9IFtdXG4gIHdoaWxlIHJldC5sZW5ndGggPCB0YXJnZXRMZW5cbiAgICByZXQucHVzaCBsZXNoZGFzaC5zYW1wbGUgY2hhcnNcbiAgcmV0LmpvaW4gJydcblxuZXhwb3J0IGlkZW50aXR5ID0gLT4gaXRcbiAgXG5leHBvcnQgYXN5bmNEZXB0aEZpcnN0ID0gKG5vZGUsIG9wdHMpIC0+XG4gIFxuICBvcHRzID0gbGVzaGRhc2guZGVmYXVsdHNEZWVwIG9wdHMsIGRvXG4gICAgZ2V0Q2hpbGRyZW46IC0+IC4uLlxuICAgIGNhbGxiYWNrOiAtPiAuLi5cbiAgICBcbiAgc2VhcmNoID0gKG5vZGUsIHZpc2l0ZWQ9e30pIC0+XG4gICAgbGVzaGRhc2gubWF5YmVQIG9wdHMuY2FsbGJhY2sgbm9kZVxuIyAgICAudGhlbiAocmV0KSAtPlxuIyAgICAgIHZpc2l0ZWQgPDw8IHsgXCIje3JldH1cIjogdHJ1ZSB9XG4gICAgLnRoZW4gLT4gb3B0cy5nZXRDaGlsZHJlbiBub2RlXG4gICAgLnRoZW4gKGNoaWxkcmVuKSAtPiBcbiAgICAgIGlmIG5vdCBjaGlsZHJlbj8gdGhlbiByZXR1cm4gbm9kZVxuICAgICAgZWxzZSBwLnByb3BzIGxlc2hkYXNoLm1hcFZhbHVlcyBjaGlsZHJlbiwgKG5vZGUsIGlkKSAtPiBcbiAgICAgICAgaWYgdmlzaXRlZFtpZF0/IHRoZW4gcmV0dXJuIGVsc2Ugc2VhcmNoIG5vZGUsIHZpc2l0ZWRcbiAgXG4gIHNlYXJjaCBub2RlXG5cbmV4cG9ydCBtYXRjaFN0cmluZyA9IChtYXRjaGVyLCB0YXJnZXQpIC0tPlxuICBzd2l0Y2ggdHlwZW9mISBtYXRjaGVyXG4gICAgfCBcIlN0cmluZ1wiID0+IHRydWVcblxuICAgIHwgXCJBcnJheVwiID0+XG4gICAgICBsZXNoZGFzaC5maW5kIG1hdGNoZXIsIGxlc2hkYXNoLm1hdGNoU3RyaW5nXG5cbiAgICB8IFwiRnVuY3Rpb25cIiA9PlxuICAgICAgaWYgaWdub3JlKG5leHRMb2MpIHRoZW4gcmV0dXJuXG5cbiAgICB8IFwiUmVnRXhwXCIgPT5cbiAgICAgIGlmIG1hdGNoZXIudGVzdCBuZXh0TG9jIHRoZW4gcmV0dXJuXG5cbmV4cG9ydCBjYmMgPSAoY2IsZXJyLGRhdGEpIC0+IGlmIGNiIHRoZW4gY2IgZXJyLCBkYXRhXG5cbmV4cG9ydCByZW5hbWVLZXlzID0gKHRhcmdldCwgbWFwKSAtPlxuICBsZXNoZGFzaC5tYXBLZXlzIHRhcmdldCwgKHZhbCxrZXlOYW1lKSAtPiBpZiBuZXdOYW1lID0gbWFwW2tleU5hbWVdIHRoZW4gbmV3TmFtZSBlbHNlIGtleU5hbWVcblxuZXhwb3J0IG1hcE9iamVjdCA9ICh0YXJnZXQsIGNiKSAtPlxuICByZXQgPSB7fVxuICBcbiAgbGVzaGRhc2guZWFjaCB0YXJnZXQsICh2YWwsIGtleSkgLT5cbiAgICByZXMgPSBjYiB2YWwsIGtleVxuICAgIGlmIHJlcz9AQCBpc250IEFycmF5IHRoZW4gcmV0dXJuXG4gICAgWyBrZXksIHZhbCBdID0gcmVzXG4gICAgaWYga2V5IHRoZW4gcmV0W2tleV0gPSB2YWxcbiAgcmV0XG4gIFxuZXhwb3J0IHJhbmRvbUlkID0gKHRhcmdldExlbj0yMCwgYWxwaGFiZXQpIC0+XG4gIHJldCA9IFwiXCJcbiAgaWYgbm90IGFscGhhYmV0IHRoZW4gYWxwaGFiZXQgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonXG4gIHdoaWxlIHJldC5sZW5ndGggPCB0YXJnZXRMZW5cbiAgICByZXQgKz0gYWxwaGFiZXRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSEgKiBhbHBoYWJldC5sZW5ndGgpXVxuICByZXQgICAgXG5cbmV4cG9ydCB0aW1lID0gZG9cbiAgc2Vjb25kOiBzZWNvbmQgPSAxMDAwXG4gIG1pbnV0ZTogbWludXRlID0gc2Vjb25kICogNjBcbiAgaG91cjogaG91ciA9IG1pbnV0ZSAqIDYwXG5cblxuZXhwb3J0IHBhaXJzVGFpbHMgPSAoYXJyYXksIGNiKSAtPlxuICBpZiBub3QgY2IgdGhlbiBjYiA9ICh4LHkpIC0+IFsgeCwgeSBdXG4gICAgXG4gIHJldCA9IGxlc2hkYXNoLnJlZHVjZSBkb1xuICAgIGFycmF5LFxuICAgIChwYWlycywgY3VycmVudCkgLT5cbiAgICAgIGlmIG5vdCBwYWlycy5sZW5ndGggdGhlbiBbIGNiKHZvaWQsIGN1cnJlbnQpIF1cbiAgICAgIGVsc2UgWyAuLi5wYWlycywgY2IoIChsZXNoZGFzaC5sYXN0IGxlc2hkYXNoLmxhc3QgcGFpcnMpLCBjdXJyZW50KSBdXG4gICAgW11cblxuICBbIC4uLnJldCwgY2IoIChsZXNoZGFzaC5sYXN0IGxlc2hkYXNoLmxhc3QgcmV0KSwgdm9pZCApICBdXG5cbmV4cG9ydCBwYWlycyA9IChhcnJheSwgY2IpIC0+XG4gIGlmIG5vdCBjYiB0aGVuIGNiID0gKHgseSkgLT4gWyB4LCB5IF1cbiAgXG4gIGxlc2hkYXNoLnJlZHVjZSBhcnJheSxcbiAgICAodG90YWwsIGVsZW1lbnQsIGluZGV4KSB+PlxuICAgICAgaWYgbm90IGluZGV4IHRoZW4gcmV0dXJuIFtdXG4gICAgICBbIC4uLnRvdGFsLCBjYiggYXJyYXlbaW5kZXgtMV0sIGVsZW1lbnQpIF1cbiAgICAgIFxuIl19
