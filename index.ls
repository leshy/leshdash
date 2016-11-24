# autocompile
require! {
  lodash: { assign }:lodash
  bluebird: p
}

lib = assign do
  require './curried'
  require './promise'
  w: require './wrap'
  
lib.jsonQuery = (path, object, seperator="_") -> 
  if path@@ is String then path = path.split seperator
    
  if not path.length then return object
  else
    if not deeperObject = object[lodash.head path] then return void
    else lib.jsonQuery lodash.tail(path), deeperObject
      

lib.jsonError = (error) ->
    serializeError = (error) -> do
      stack: error.stack
      name: error.name
      message: error.message
    
    switch error.constructor
      | Error => serializeError error
      | otherwise => { name: error.constructor.name, message: String(error) }

lib.wait = (t, f) -> setTimeout f, t

lib.waitCancel = (t, f) ->
  id = lib.wait t, f
  -> clearTimeout id

lib.abstractPad = abstractPad = (operation, success, text) ->
    if not text? then text = ""
    if text.constructor isnt String then text = String text

    modifyText = (text) ->
        if success(text) then return text
        else modifyText operation text

    modifyText text

lib.pad = (text,length,chr=0) ->
    abstractPad(
        ((text) -> chr + text),
        ((text) -> text.length >= length),
        text)

lib.rpad = (text,length,chr=0) ->
    abstractPad(
        ((text) -> text + chr),
        ((text) -> text.length >= length),
        text)

lib.antipad = (text,chr="0") ->
    abstractPad(
        ((text) -> text.slice(0, text.length - 1)),
        ((text) -> text[text.length - 1] is chr),
        text)

# immutable push
lib.push = (array, ...stuff) -> array.concat stuff  

lib.pop = (object, key) ->
  ret = object[key]
  delete object.key
  ret

dChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split ''

lib.token = (targetLen=25, chars=dChars) ->
  ret = []
  while ret.length < targetLen
    ret.push lodash.sample chars
  ret.join ''

lib.identity = -> it

module.exports = lodash.assign lib, lodash
