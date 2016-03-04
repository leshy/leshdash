# autocompile

require! { lodash }

lib = {}

lib.jsonQuery = (path, object) -> 
  if path@@ is String then path = path.split('.')

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





module.exports = lodash.assign lib, lodash

