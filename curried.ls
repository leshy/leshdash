# autocompile
require! { lodash }

wrap = (targetF) ->

  figureArgs = ([x, y]) ->
    if x?@@ is Function then return fun: x, arg: y
    else if y?@@ is Function then return fun: y, arg: x
    else throw "got weird arguments"

  figureCurry = ({fun, arg}) -> 
    if not fun then (fun) -> targetF arg, fun
    if not arg then (arg) -> targetF arg, fun
    else if fun and arg then targetF arg, fun
    else throw "didn't get any arguments"

  (...args) -> args |> figureArgs |> figureCurry

toCurry = <[ map remove ]>

lodash.each toCurry, (name) ->
  exports["c#{name}"] = wrap lodash[name]



