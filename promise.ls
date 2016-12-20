require! {
  './index':  { pwait, defaultsDeep, assign, flattenDeep }: leshdash
  bluebird: p
}

export p

export pwait = (t, f) ->
  if typeof! f is 'Function' then return setTimeout f, t
  else new p (resolve,reject,onCancel) ~>
    timeout = setTimeout (-> resolve f), t
    onCancel = -> clearTimeout timeout
