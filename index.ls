# autocompile

require! { lodash }


module.exports = lodash.assign {}, lodash, do
  lazy: (f) ->
      res = {}
      (...args) ->
        if res.promise then res.promise
        else res.promise = f.apply @, args



  jsonError: (error) ->
    serializeError = (error) -> do
      stack: error.stack
      name: error.name
      message: error.message
    
    switch error.constructor
      | Error => serializeError error
      | otherwise => { name: error.constructor.name, message: String(error) }

  jsonQuery: (string, object) ->
    
