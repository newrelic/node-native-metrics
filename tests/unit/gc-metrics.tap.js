'use strict'

var tap = require('tap')

tap.test('GC Metrics', function(t) {
  var metricEmitter = require('../../')()
  t.plan(6)

  t.tearDown(function() {
    metricEmitter.unbind()
  })

  metricEmitter.on('gc', function(stats) {
    t.pass('should emit gc event')
    t.type(stats, Object, 'should provide stats object')
    t.type(stats.duration, 'number', 'should have a duration')
    t.type(stats.typeId, 'number', 'should have a type ID')
    t.type(stats.type, 'string', 'should have a type name')
    t.ok(stats.duration > 0, 'duration should be greater than zero')
  })

  global.gc()
})
