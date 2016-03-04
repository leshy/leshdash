require! {
  assert
  chai: { expect }
  '../index.ls': { jsonQuery, lazy, union, assign, omit, map, curry, times, keys, first }
}

describe 'leshdash', ->
  specify 'jsonQuery', ->
    expect jsonQuery 'level1.level2.level3', { level1: { level2: { level3: 44 }, bla: 3}, lallaa: 1 }
    .to.be.equal 44
