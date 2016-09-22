(function(){
  var lodash, assign, p, lib, abstractPad, dChars, slice$ = [].slice;
  lodash = require('lodash'), assign = lodash.assign;
  p = require('bluebird');
  lib = assign(require('./curried'), require('./promise'), {
    w: require('./wrap')
  });
  lib.jsonQuery = function(path, object, seperator){
    seperator == null && (seperator = "_");
    if (path.constructor === String) {
      path = path.split(seperator);
    }
    if (!path.length) {
      return object;
    } else {
      return lib.jsonQuery(lodash.tail(path), object[lodash.head(path)]);
    }
  };
  lib.jsonError = function(error){
    var serializeError;
    serializeError = function(error){
      return {
        stack: error.stack,
        name: error.name,
        message: error.message
      };
    };
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
  lib.wait = function(t, f){
    return setTimeout(f, t);
  };
  lib.waitCancel = function(t, f){
    var id;
    id = lib.wait(t, f);
    return function(){
      return clearTimeout(id);
    };
  };
  lib.abstractPad = abstractPad = function(operation, success, text){
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
  lib.pad = function(text, length, chr){
    chr == null && (chr = 0);
    return abstractPad(function(text){
      return chr + text;
    }, function(text){
      return text.length >= length;
    }, text);
  };
  lib.rpad = function(text, length, chr){
    chr == null && (chr = 0);
    return abstractPad(function(text){
      return text + chr;
    }, function(text){
      return text.length >= length;
    }, text);
  };
  lib.antipad = function(text, chr){
    chr == null && (chr = "0");
    return abstractPad(function(text){
      return text.slice(0, text.length - 1);
    }, function(text){
      return text[text.length - 1] === chr;
    }, text);
  };
  lib.push = function(array){
    var stuff;
    stuff = slice$.call(arguments, 1);
    return array.concat(stuff);
  };
  lib.pop = function(object, key){
    var ret;
    ret = object[key];
    delete object.key;
    return ret;
  };
  dChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  lib.token = function(targetLen, chars){
    var ret;
    targetLen == null && (targetLen = 25);
    chars == null && (chars = dChars);
    ret = [];
    while (ret.length < targetLen) {
      ret.push(lodash.sample(chars));
    }
    return ret.join('');
  };
  module.exports = lodash.assign(lib, lodash);
}).call(this);
