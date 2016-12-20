require! { './index':  { head, tail, pwait, defaultsDeep, assign, flattenDeep }: leshdash }

export dChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split ''

export jsonQuery = (path, object, seperator="/") ->
  if path@@ is String then path = path.split seperator
  if not path.length then return object
  else
    if not deeperObject = object[leshdash.head path] then return void
    else leshdash.jsonQuery leshdash.tail(path), deeperObject
      
export jsonError = (error) ->
  serializeError = (error) -> do
    stack: error.stack
    name: error.name
    message: error.message
    
    switch error.constructor
      | Error => serializeError error
      | otherwise => { name: error.constructor.name, message: String(error) }

export wait = (t, f) -> setTimeout f, t

export waitCancel = (t, f) ->
  id = leshdash.wait t, f
  -> clearTimeout id

export abstractPad = (operation, success, text) ->
  if not text? then text = ""
  if text.constructor isnt String then text = String text

  modifyText = (text) ->
    if success(text) then return text
    else modifyText operation text

  modifyText text

export pad = (text,length,chr=0) ->
  abstractPad(
    ((text) -> chr + text),
    ((text) -> text.length >= length),
    text)

export rpad = (text,length,chr=0) ->
  abstractPad(
    ((text) -> text + chr),
    ((text) -> text.length >= length),
    text)

export antipad = (text,chr="0") ->
  abstractPad(
    ((text) -> text.slice(0, text.length - 1)),
    ((text) -> text[text.length - 1] is chr),
    text)

# immutable push
export push = (array, ...stuff) -> array.concat stuff  

export pop = (object, key) ->
  ret = object[key]
  delete object.key
  ret


export token = (targetLen=25, chars=dChars) ->
  ret = []
  while ret.length < targetLen
    ret.push leshdash.sample chars
  ret.join ''

export identity = -> it

