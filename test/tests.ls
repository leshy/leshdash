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
      assert.deepEqual args, [["bla",1],["blu",2],["blx",4]]
      leshdash.wait 20, -> resolve args

    testw = leshdash.w.delayAggregate {}, testf

    promises = {}
    
    promises.first = testw('bla',1)
    
    promises.second = testw('blu',2)

    leshdash.wait 10, ->
      promises.third = testw('blx',4)

      assert promises.first is promises.second is promises.third

      p.props promises
      .then ->
        assert.deepEqual it, do
          "first":[["bla",1],["blu",2],["blx",4]],
          "second":[["bla",1],["blu",2],["blx",4]],
          "third":[["bla",1],["blu",2],["blx",4]] 
        resolve!

  specify 'delayAggregateSolit', -> new p (resolve,reject) ~> 

    testf = (...args) -> new p (resolve,reject) ~>
      assert.deepEqual args, [["bla",1],["blu",2],["blx",4]]
      leshdash.wait 20, -> resolve args

    testw = leshdash.w.delayAggregate {retSplit: leshdash.w.retSplit.array}, testf

    promises = {}
    
    promises.first = testw('bla',1)
    
    promises.second = testw('blu',2)

    leshdash.wait 10, ->
      promises.third = testw('blx',4)

      assert promises.first isnt promises.second
      assert promises.second isnt promises.third

      p.props promises
      .then ->
        assert.deepEqual it, do
          first: [ 'bla', 1 ]
          second: [ 'blu', 2 ]
          third: [ 'blx', 4 ]

        
        resolve!
