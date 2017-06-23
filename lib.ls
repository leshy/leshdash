# autocompile

require! {
  bluebird: p
  './index':  { toPromise, mapValues, head, tail, pwait, assign, flattenDeep, defaultsDeep }: leshdash
}

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
export push = (array, ...stuff) -> [ ...array, ...stuff ]

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
  
export asyncDepthFirst = (node, opts) ->
  
  opts = leshdash.defaultsDeep opts, do
    getChildren: -> ...
    callback: -> ...
    
  search = (node, visited={}) ->
    leshdash.maybeP opts.callback node
#    .then (ret) ->
#      visited <<< { "#{ret}": true }
    .then -> opts.getChildren node
    .then (children) -> 
      if not children? then return node
      else p.props leshdash.mapValues children, (node, id) -> 
        if visited[id]? then return else search node, visited
  
  search node

export matchString = (matcher, target) -->
  switch typeof! matcher
    | "String" => true

    | "Array" =>
      leshdash.find matcher, leshdash.matchString

    | "Function" =>
      if ignore(nextLoc) then return

    | "RegExp" =>
      if matcher.test nextLoc then return

export cbc = (cb,err,data) -> if cb then cb err, data

export renameKeys = (target, map) ->
  leshdash.mapKeys target, (val,keyName) -> if newName = map[keyName] then newName else keyName

export randomId = (targetLen=20, alphabet) ->
  ret = ""
  if not alphabet then alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  while ret.length < targetLen
    ret += alphabet[Math.floor(Math.random! * alphabet.length)]
  ret    


export time = do
  second: second = 1000
  minute: minute = second * 60
  hour: hour = minute * 60
