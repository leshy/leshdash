# autocompile
require! {
  bluebird: p
  './index':  { pwait, defaultsDeep, assign, flattenDeep }: _
}

export do

  argsJoin: argsJoin = do
    replace: (prevArgs, args) -> args
    array: (prevArgs, args) ->
      (prevArgs or []).concat [ args ]
    
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
      argsJoin: argsJoin.array
      retSplit: false
      opts

    env = {}

    (...args) ->
      if opts.cancel then env.cancel?!

      env.args = opts.argsJoin env.args, args

      delay = _.pwait opts.delay
      .then ->
        f.apply @, env.args
        .then (val) ->
          env.res.resolve val

      env.cancel = ->
        delete env.cancel
        delay.cancel()

      if env.res then return env.res.promise
      else
        env.res = {}
        env.res.promise = new p (resolve,reject) ~>
          env.res.resolve = resolve
          env.res.reject = reject

