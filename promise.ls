# autocompile

require! {
  './index':  { pwait, defaultsDeep, assign, flattenDeep }: leshdash
  bluebird: p
}

p.config cancellation: true

export p

export pwait = (t, f) ->
  if typeof! f is 'Function' then return setTimeout f, t
  else new p (resolve, reject, onCancel) ~>
    timeout = setTimeout (-> resolve f), t
    onCancel -> clearTimeout timeout

export maybeP = (thing) -> new p (resolve,reject) ~>
  if thing?then?@@ is Function then thing.then(resolve); thing.catch(reject)
  else if thing?@@ is Error then reject thing else resolve thing

export toPromise = (f, ...args) -> new p (resolve,reject) ~>
  ret = f.apply @, args.concat (err,data) -> if err then reject err else resolve data
    
  if ret?then@@ is Function
    ret.then resolve
    ret.catch reject

export toCallback = (f, ...args, cb) -> new p (resolve,reject) ~>
  
  ret = f.apply @, args.concat cb
  if ret?then@@ is Function
    ret.then -> cb void, it
    ret.catch -> cb it
