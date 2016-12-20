require! {
  assert
  bluebird: p
  chai: { expect }
  '../index.ls': leshdash
}

{ jsonQuery, lazy, union, assign, omit, map, curry, times, keys, first } = leshdash


describe 'leshdash', ->
  specify 'jsonQuery', ->
    expect jsonQuery 'level1/level2/level3', { level1: { level2: { level3: 44 }, bla: 3}, lallaa: 1 }
    .to.be.equal 44

  specify 'lodash', ->
    expect leshdash.assign
    .to.be.instanceof Function

  specify 'wait' , -> new p (resolve,reject) ~> 
    leshdash.wait 50, -> resolve!

  specify 'token', -> new p (resolve,reject) ~>
    ret = leshdash.token!
    expect ret.length
    .to.be.equal 25
    resolve ret

  specify 'delayAggregate', -> new p (resolve,reject) ~> 

    testf = (...args) -> new p (resolve,reject) ~>
      console.log "CALLED WITH", args
      leshdash.wait 100, -> resolve args


    testw = leshdash.w.delayAggregate {argsJoin: leshdash.w.array}, testf

    promises = {}
    
    promises.first = testw('bla',1)
    promises.first.then -> 'resolved first'
    
    promises.second = testw('blu',2)
    promises.second.then -> 'resolved second'

    leshdash.wait 10, ->
      promises.third = testw('blx',4)
      promises.third.then -> 'resolved third'

      console.log promises.first is promises.second is promises.third

      p.props promises
      .then ->
        console.log "RESOLVED PROMISES", it
        resolve!
