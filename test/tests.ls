require! {
  assert
  fs
  path
  bluebird: p
  chai: { expect }
  '../index.ls': leshdash
}

{ jsonQuery, lazy, union, assign, omit, map, curry, times, keys, first, mapValues, mapKeys, fromPairs, w } = leshdash


describe 'leshdash', ->
  specify 'lodash', ->
    expect leshdash.assign
    .to.be.instanceof Function

  specify 'mapFilter', -> new p (resolve,reject) ~>
    assert.deepEqual do
      leshdash.mapFilter [ 2, 5, 1, 20, 11, 41 ], -> if it > 5 then it else void
      [ 20, 11, 41 ]
    
    resolve()  
      
  specify 'renameKeys', ->
    expect leshdash.renameKeys { bla: 3, id: 124 }, { id: 'remoteId' }
    .to.deep.equal { bla: 3, remoteId: 124 }

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
    
    promises.first = testw 'bla', 1
    promises.second = testw 'blu', 2

    leshdash.wait 10, ->
      promises.third = testw 'blx', 4

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
    
    promises.first = testw 'bla', 1
    promises.second = testw 'blu', 2

    leshdash.wait 10, ->
      promises.third = testw 'blx', 4

      assert promises.first isnt promises.second
      assert promises.second isnt promises.third

      p.props promises
      .then ->
        assert.deepEqual it, do
          first: [ 'bla', 1 ]
          second: [ 'blu', 2 ]
          third: [ 'blx', 4 ]

        resolve!

  specify 'typeCast', -> new p (resolve,reject) ~>
    class TestType
      (data) -> @ <<< data
      
    target = w.typeCast TestType, (bla, blu) ->
      assert bla@@ is TestType
      assert blu is 66
      assert bla.bla is 3

    target({bla: 3}, 66)
    target(new TestType(bla: 3), 66)
    resolve!

  specify 'maybeP', -> new p (resolve,reject) ~>
    cb1 = (x,y) -> x + y
    cb2 = (x,y) -> new p (resolve,reject) ~> resolve x + y
    
    leshdash.maybeP cb1(1,2)
    .then ->
      assert it is 3
      leshdash.maybeP cb2(2,2)
      .then ->
        assert it is 4
        resolve!

  specify 'depthFirst' , -> new p (resolve,reject) ~> 
    leshdash.asyncDepthFirst path.join(path.dirname(require.main.filename) + '/../../'), do
      callback: ->
        return "GUZICA " + it
        
      getChildren: (node) -> new p (resolve,reject) ~>
        
        stats = fs.lstatSync node
        if not stats.isDirectory() then return resolve void
        else resolve fromPairs map fs.readdirSync(node), -> ret = (path.join node, it); [ it , ret]

    .then -> resolve()
        
        
  specify 'randomid', -> new p (resolve,reject) ~>
    assert leshdash.randomId(20).length is 20
    resolve()

