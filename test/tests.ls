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
