# autocompile
require! {
  bluebird: p
  './index':  { pwait, defaultsDeep, assign, flattenDeep }: _
}

export do

  argsJoin: argsJoin = do
    replace: (prevArgs, args) -> args
    array: (prevArgs, args) -> [ ...prevArgs, args ]
    
  lazy : (f) ->
    res = {}
    (...args) ->
      if res.promise then res.promise
      else res.promise = f.apply @, args

  list: (f) -> (...stuff) -> f.call @, flattenDeep stuff

  id: (f) -> (...args) -> f.apply @, args

  cancel: (f,data) ->
    cancel = void
    (...args) ->
      if cancel?@@ is Function then cancel!
      cancel := f.apply @, args

  delayAggregate: (opts, f) ->
    if opts?@@ is Function then f = opts; opts = {}

    opts = _.defaultsDeep do
      delay: 100
      cancel: true
      argsJoin: argsJoin.replace
      opts

    env = {}

    (...args) ->
      if opts.cancel then env.cancel?!

      env.args = if env.args? then env.argsJoin(env.args, args) else args

      delay = _.pwait 100
      .then ->
        f.apply @, env.args
        .then env.res.resolve

      env.cancel = ->
        delete env.cancel
        delay.cancel()
    
      return if env.res? then env.res else env.res = new p!
    
  
    

