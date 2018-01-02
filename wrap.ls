# autocompile

require! {
  bluebird: p
  lodash: { head, tail }
  './index':  { pwait, defaultsDeep, assign, flattenDeep }: _
}

export do

  argsJoin: argsJoin = do
    replace: (prevArgs, args) -> args
    
    array: (prevArgs, args) ->
      (prevArgs or []).concat [ args ]
      
    multiArray: (prevArgs, args) ->
      if prevArgs then [ ...prevArgs, args ]
      else [ args ]
      
  retSplit: retSplit = do
    array: (promises, ret) ->
      _.each _.zip(promises, ret), ([ { resolve }, value ] ) -> resolve value
    
  lazy : (f) ->
    res = {}
    (...args) ->
      if res.promise then res.promise
      else res.promise = f.apply @, args

  list: (f) -> (...stuff) -> f.call @, flattenDeep stuff

  id: (f) -> (...args) -> f.apply @, args

  cancel: (f, data) ->
    cancel = void
    (...args) ->
      if cancel?@@ is Function then cancel!
      cancel := f.apply @, args

  typeCast: (Type, f) ->
    (...args) ->
      if (h = head(args)?) and h@@ isnt Type
        args = [ new Type(head args), ...(tail args) ]
      f.apply @, args

  delayAggregate: (opts, f) ->
    if opts?@@ is Function then f = opts; opts = {}

    dopts = do
      delay: 100
      cancel: true
      argsJoin: argsJoin.array
      retSplit: false

    opts = dopts <<< opts

    env = {}

    (...args) ->
      if opts.cancel then env.cancel?!
      
      env.args = opts.argsJoin env.args, args
      
      delay = _.pwait opts.delay
      .then ~> 

        resetEnv = ->
          ret = {} <<< env
          _.each env, (val, key) ->  delete env[key]
          ret
        
        f.apply @, env.args

        .then (val) ->
          env = resetEnv()
          
          if not opts.retSplit then env.ret.resolve val
          else opts.retSplit env.ret, val
          
        .catch (val) ->
          env = resetEnv()
            
          if not opts.retSplit then env.ret.reject val
          else _.each env.ret, (.reject val)

      env.cancel = ->
        delete env.cancel
        delay.cancel()

      if opts.retSplit
        if not env.ret then env.ret = []
          
        ret = {}
        env.ret.push ret
        
        ret.promise = new p (resolve,reject) ~>
          ret.resolve = resolve
          ret.reject = reject

      else

        if env.ret then return env.ret.promise
        else
          env.ret = {}
          env.ret.promise = new p (resolve,reject) ~>
            env.ret.resolve = resolve
            env.ret.reject = reject

