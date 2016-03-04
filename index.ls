# autocompile

require! { lodash: _ }

exports.jsonQuery = (path, object) -> 
  if path@@ is String then path = path.split('.')

  if not path.length then return object
  else exports.jsonQuery _.tail(path), object[_.head path]
      

exports.lazy = (f) ->
      res = {}
      (...args) ->
        if res.promise then res.promise
        else res.promise = f.apply @, args



exports.jsonError = (error) ->
    serializeError = (error) -> do
      stack: error.stack
      name: error.name
      message: error.message
    
    switch error.constructor
      | Error => serializeError error
      | otherwise => { name: error.constructor.name, message: String(error) }


_.assign exports, _
