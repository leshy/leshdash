(function(){
  var p, leshdash, toPromise, mapValues, head, tail, pwait, assign, flattenDeep, defaultsDeep, dChars, jsonQuery, jsonError, wait, waitCancel, abstractPad, pad, rpad, antipad, push, pop, token, identity, asyncDepthFirst, matchString, cbc, renameKeys, mapObject, randomId, time, second, minute, hour, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, toString$ = {}.toString;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL3Jlc2JvdS9zZXJ2ZXJzaWRlL25vZGVfbW9kdWxlcy9sZXNoZGFzaC9saWIubHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7RUFHWSxDQUFWLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBO0VBQ0EsUUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsRUFBYyxTQUFkLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBYyxTQUFkLEVBQXlCLFNBQXpCLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBeUIsU0FBekIsRUFBb0MsSUFBcEMsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQTBDLElBQTFDLEVBQWdELEtBQWhELENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBZ0QsS0FBaEQsRUFBdUQsTUFBdkQsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUF1RCxNQUF2RCxFQUErRCxXQUEvRCxDQUFBLENBQUEsQ0FBQSxRQUFBLENBQStELFdBQS9ELEVBQTRFLFlBQTVFLENBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBNEU7Z0JBR3ZFLE1BQU8sQ0FBQSxDQUFBLENBQUUsZ0VBQWdFLENBQUMsTUFBTSxFQUFBO21CQUVoRixTQUFVLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLFNBQUE7O0lBQWUsc0JBQUEsWUFBYTtJQUM3QyxJQUFHLElBQUksQ0FBQSxXQUFHLENBQUEsR0FBQSxDQUFHLE1BQWI7TUFBeUIsSUFBSyxDQUFBLENBQUEsQ0FBRSxJQUFJLENBQUMsTUFBTSxTQUFBOztJQUMzQyxJQUFHLENBQUksSUFBSSxDQUFDLE1BQVo7TUFBd0IsTUFBQSxDQUFPLE1BQVA7S0FDeEI7TUFDRSxJQUFHLENBQUEsQ0FBSSxZQUFhLENBQUEsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBVixDQUFlLElBQUEsQ0FBZixDQUF6QixD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Q0FBRTs7S0FKWDtXQUtkOztrQkFHSyxRQUFTLENBQUEsQ0FBQSxDQUFFLFFBQUEsQ0FBQSxTQUFBLEVBQUEsUUFBQTs7SUFBQyxzQkFBQSxZQUFVO0lBQzNCLEdBQUksQ0FBQSxDQUFBLENBQUU7SUFDTixJQUFHLENBQUksUUFBUDtNQUFxQixRQUFTLENBQUEsQ0FBQSxDQUFFOztJQUNoQyxPQUFNLEdBQUcsQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFFLFNBQW5CO01BQ0UsR0FBSSxDQUFBLEVBQUEsQ0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFJLENBQUMsTUFBUSxDQUFGLENBQUUsQ0FBQSxDQUFBLENBQUUsUUFBUSxDQUFDLE1BQXpCLENBQVg7O1dBQ2pCOztjQUdLLElBQUssQ0FBQSxDQUFBLENBQ1Y7SUFBQSxRQUFRLE1BQU8sQ0FBQSxDQUFBLENBQUU7SUFDakIsUUFBUSxNQUFPLENBQUEsQ0FBQSxDQUFFLE1BQU8sQ0FBQSxDQUFBLENBQUU7SUFDMUIsTUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFFLE1BQU8sQ0FBQSxDQUFBLENBQUU7RUFGdEIiLCJzb3VyY2VzQ29udGVudCI6WyIjIGF1dG9jb21waWxlXG5cbnJlcXVpcmUhIHtcbiAgYmx1ZWJpcmQ6IHBcbiAgJy4vaW5kZXgnOiAgeyB0b1Byb21pc2UsIG1hcFZhbHVlcywgaGVhZCwgdGFpbCwgcHdhaXQsIGFzc2lnbiwgZmxhdHRlbkRlZXAsIGRlZmF1bHRzRGVlcCB9OiBsZXNoZGFzaFxufVxuXG5leHBvcnQgZENoYXJzID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCAnJ1xuXG5leHBvcnQganNvblF1ZXJ5ID0gKHBhdGgsIG9iamVjdCwgc2VwZXJhdG9yPVwiL1wiKSAtPlxuICBpZiBwYXRoQEAgaXMgU3RyaW5nIHRoZW4gcGF0aCA9IHBhdGguc3BsaXQgc2VwZXJhdG9yXG4gIGlmIG5vdCBwYXRoLmxlbmd0aCB0aGVuIHJldHVybiBvYmplY3RcbiAgZWxzZVxuICAgIGlmIG5vdCBkZWVwZXJPYmplY3QgPSBvYmplY3RbbGVzaGRhc2guaGVhZCBwYXRoXSB0aGVuIHJldHVybiB2b2lkXG4gICAgZWxzZSBsZXNoZGFzaC5qc29uUXVlcnkgbGVzaGRhc2gudGFpbChwYXRoKSwgZGVlcGVyT2JqZWN0XG4gICAgICBcbmV4cG9ydCBqc29uRXJyb3IgPSAoZXJyb3IpIC0+XG4gIHNlcmlhbGl6ZUVycm9yID0gKGVycm9yKSAtPiBkb1xuICAgIHN0YWNrOiBlcnJvci5zdGFja1xuICAgIG5hbWU6IGVycm9yLm5hbWVcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlXG4gICAgXG4gICAgc3dpdGNoIGVycm9yLmNvbnN0cnVjdG9yXG4gICAgICB8IEVycm9yID0+IHNlcmlhbGl6ZUVycm9yIGVycm9yXG4gICAgICB8IG90aGVyd2lzZSA9PiB7IG5hbWU6IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUsIG1lc3NhZ2U6IFN0cmluZyhlcnJvcikgfVxuXG5leHBvcnQgd2FpdCA9ICh0LCBmKSAtPiBzZXRUaW1lb3V0IGYsIHRcblxuZXhwb3J0IHdhaXRDYW5jZWwgPSAodCwgZikgLT5cbiAgaWQgPSBsZXNoZGFzaC53YWl0IHQsIGZcbiAgLT4gY2xlYXJUaW1lb3V0IGlkXG5cbmV4cG9ydCBhYnN0cmFjdFBhZCA9IChvcGVyYXRpb24sIHN1Y2Nlc3MsIHRleHQpIC0+XG4gIGlmIG5vdCB0ZXh0PyB0aGVuIHRleHQgPSBcIlwiXG4gIGlmIHRleHQuY29uc3RydWN0b3IgaXNudCBTdHJpbmcgdGhlbiB0ZXh0ID0gU3RyaW5nIHRleHRcblxuICBtb2RpZnlUZXh0ID0gKHRleHQpIC0+XG4gICAgaWYgc3VjY2Vzcyh0ZXh0KSB0aGVuIHJldHVybiB0ZXh0XG4gICAgZWxzZSBtb2RpZnlUZXh0IG9wZXJhdGlvbiB0ZXh0XG5cbiAgbW9kaWZ5VGV4dCB0ZXh0XG5cbmV4cG9ydCBwYWQgPSAodGV4dCxsZW5ndGgsY2hyPTApIC0+XG4gIGFic3RyYWN0UGFkKFxuICAgICgodGV4dCkgLT4gY2hyICsgdGV4dCksXG4gICAgKCh0ZXh0KSAtPiB0ZXh0Lmxlbmd0aCA+PSBsZW5ndGgpLFxuICAgIHRleHQpXG5cbmV4cG9ydCBycGFkID0gKHRleHQsbGVuZ3RoLGNocj0wKSAtPlxuICBhYnN0cmFjdFBhZChcbiAgICAoKHRleHQpIC0+IHRleHQgKyBjaHIpLFxuICAgICgodGV4dCkgLT4gdGV4dC5sZW5ndGggPj0gbGVuZ3RoKSxcbiAgICB0ZXh0KVxuXG5leHBvcnQgYW50aXBhZCA9ICh0ZXh0LGNocj1cIjBcIikgLT5cbiAgYWJzdHJhY3RQYWQoXG4gICAgKCh0ZXh0KSAtPiB0ZXh0LnNsaWNlKDAsIHRleHQubGVuZ3RoIC0gMSkpLFxuICAgICgodGV4dCkgLT4gdGV4dFt0ZXh0Lmxlbmd0aCAtIDFdIGlzIGNociksXG4gICAgdGV4dClcblxuIyBpbW11dGFibGUgcHVzaFxuZXhwb3J0IHB1c2ggPSAoYXJyYXksIC4uLnN0dWZmKSAtPiBbIC4uLmFycmF5LCAuLi5zdHVmZiBdXG5cbmV4cG9ydCBwb3AgPSAob2JqZWN0LCBrZXkpIC0+XG4gIHJldCA9IG9iamVjdFtrZXldXG4gIGRlbGV0ZSBvYmplY3Qua2V5XG4gIHJldFxuXG5leHBvcnQgdG9rZW4gPSAodGFyZ2V0TGVuPTI1LCBjaGFycz1kQ2hhcnMpIC0+XG4gIHJldCA9IFtdXG4gIHdoaWxlIHJldC5sZW5ndGggPCB0YXJnZXRMZW5cbiAgICByZXQucHVzaCBsZXNoZGFzaC5zYW1wbGUgY2hhcnNcbiAgcmV0LmpvaW4gJydcblxuZXhwb3J0IGlkZW50aXR5ID0gLT4gaXRcbiAgXG5leHBvcnQgYXN5bmNEZXB0aEZpcnN0ID0gKG5vZGUsIG9wdHMpIC0+XG4gIFxuICBvcHRzID0gbGVzaGRhc2guZGVmYXVsdHNEZWVwIG9wdHMsIGRvXG4gICAgZ2V0Q2hpbGRyZW46IC0+IC4uLlxuICAgIGNhbGxiYWNrOiAtPiAuLi5cbiAgICBcbiAgc2VhcmNoID0gKG5vZGUsIHZpc2l0ZWQ9e30pIC0+XG4gICAgbGVzaGRhc2gubWF5YmVQIG9wdHMuY2FsbGJhY2sgbm9kZVxuIyAgICAudGhlbiAocmV0KSAtPlxuIyAgICAgIHZpc2l0ZWQgPDw8IHsgXCIje3JldH1cIjogdHJ1ZSB9XG4gICAgLnRoZW4gLT4gb3B0cy5nZXRDaGlsZHJlbiBub2RlXG4gICAgLnRoZW4gKGNoaWxkcmVuKSAtPiBcbiAgICAgIGlmIG5vdCBjaGlsZHJlbj8gdGhlbiByZXR1cm4gbm9kZVxuICAgICAgZWxzZSBwLnByb3BzIGxlc2hkYXNoLm1hcFZhbHVlcyBjaGlsZHJlbiwgKG5vZGUsIGlkKSAtPiBcbiAgICAgICAgaWYgdmlzaXRlZFtpZF0/IHRoZW4gcmV0dXJuIGVsc2Ugc2VhcmNoIG5vZGUsIHZpc2l0ZWRcbiAgXG4gIHNlYXJjaCBub2RlXG5cbmV4cG9ydCBtYXRjaFN0cmluZyA9IChtYXRjaGVyLCB0YXJnZXQpIC0tPlxuICBzd2l0Y2ggdHlwZW9mISBtYXRjaGVyXG4gICAgfCBcIlN0cmluZ1wiID0+IHRydWVcblxuICAgIHwgXCJBcnJheVwiID0+XG4gICAgICBsZXNoZGFzaC5maW5kIG1hdGNoZXIsIGxlc2hkYXNoLm1hdGNoU3RyaW5nXG5cbiAgICB8IFwiRnVuY3Rpb25cIiA9PlxuICAgICAgaWYgaWdub3JlKG5leHRMb2MpIHRoZW4gcmV0dXJuXG5cbiAgICB8IFwiUmVnRXhwXCIgPT5cbiAgICAgIGlmIG1hdGNoZXIudGVzdCBuZXh0TG9jIHRoZW4gcmV0dXJuXG5cbmV4cG9ydCBjYmMgPSAoY2IsZXJyLGRhdGEpIC0+IGlmIGNiIHRoZW4gY2IgZXJyLCBkYXRhXG5cbmV4cG9ydCByZW5hbWVLZXlzID0gKHRhcmdldCwgbWFwKSAtPlxuICBsZXNoZGFzaC5tYXBLZXlzIHRhcmdldCwgKHZhbCxrZXlOYW1lKSAtPiBpZiBuZXdOYW1lID0gbWFwW2tleU5hbWVdIHRoZW4gbmV3TmFtZSBlbHNlIGtleU5hbWVcblxuZXhwb3J0IG1hcE9iamVjdCA9ICh0YXJnZXQsIGNiKSAtPlxuICByZXQgPSB7fVxuICBcbiAgbGVzaGRhc2guZWFjaCB0YXJnZXQsICh2YWwsIGtleSkgLT5cbiAgICByZXMgPSBjYiB2YWwsIGtleVxuICAgIGlmIHJlcz9AQCBpc250IEFycmF5IHRoZW4gcmV0dXJuXG4gICAgWyBrZXksIHZhbCBdID0gcmVzXG4gICAgaWYga2V5IHRoZW4gcmV0W2tleV0gPSB2YWxcbiAgcmV0XG4gIFxuXG5leHBvcnQgcmFuZG9tSWQgPSAodGFyZ2V0TGVuPTIwLCBhbHBoYWJldCkgLT5cbiAgcmV0ID0gXCJcIlxuICBpZiBub3QgYWxwaGFiZXQgdGhlbiBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eidcbiAgd2hpbGUgcmV0Lmxlbmd0aCA8IHRhcmdldExlblxuICAgIHJldCArPSBhbHBoYWJldFtNYXRoLmZsb29yKE1hdGgucmFuZG9tISAqIGFscGhhYmV0Lmxlbmd0aCldXG4gIHJldCAgICBcblxuXG5leHBvcnQgdGltZSA9IGRvXG4gIHNlY29uZDogc2Vjb25kID0gMTAwMFxuICBtaW51dGU6IG1pbnV0ZSA9IHNlY29uZCAqIDYwXG4gIGhvdXI6IGhvdXIgPSBtaW51dGUgKiA2MFxuIl19
