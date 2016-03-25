# autocompile

require! { lodash }

lib = {}

lib.jsonQuery = (path, object, seperator="_") -> 
  if path@@ is String then path = path.split seperator

  if not path.length then return object
  else lib.jsonQuery lodash.tail(path), object[lodash.head path]
      

lib.jsonError = (error) ->
    serializeError = (error) -> do
      stack: error.stack
      name: error.name
      message: error.message
    
    switch error.constructor
      | Error => serializeError error
      | otherwise => { name: error.constructor.name, message: String(error) }

lib.wait = (t, f) -> setTimeout f, t

lib.lazy = (f) ->
      res = {}
      (...args) ->
        if res.promise then res.promise
        else res.promise = f.apply @, args

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


module.exports = lodash.assign lib, lodash
