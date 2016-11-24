# autocompile
require! { bluebird: p }

export p

export pwait = (t, f) ->
  if typeof! f is 'Function' then return setTimeout f, t
  else new p (resolve,reject) ~> setTimeout (-> resolve f), t
