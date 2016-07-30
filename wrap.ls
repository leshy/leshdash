# autocompile
require! {
  lodash: { assign, flattenDeep }
}

module.exports = do

  lazy : (f) ->
    res = {}
    (...args) ->
      if res.promise then res.promise
      else res.promise = f.apply @, args

  list: (f) -> (...stuff) -> f.call @, flattenDeep stuff

  id: (f) -> (...args) -> f.apply @, args

  cancel: (f,data) ->
    console.log 'cancelF defined'
    cancel = void
    (...args) ->
      if cancel?@@ is Function then cancel!
      cancel := f.apply @, args

  delayCancel: (f) -> true
      
