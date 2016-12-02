'use strict'

var tap = require('tap')

tap.test('GC Metrics', function(t) {
  var metricEmitter = require('../../')()
  t.plan(7)

  // Testing double bind. If this is not protected against tap will error due to
  // too many tests (the `gc` event is emitted twice).
  metricEmitter.bind()

  metricEmitter.on('gc', function(stats) {
    t.pass('should emit gc event')
    t.type(stats, Object, 'should provide stats object')
    t.type(stats.duration, 'number', 'should have a duration')
    t.type(stats.typeId, 'number', 'should have a type ID')
    t.type(stats.type, 'string', 'should have a type name')
    t.ok(stats.duration > 0, 'duration should be greater than zero')

    metricEmitter.unbind()
    t.doesNotThrow(function() {
      metricEmitter.unbind()
    }, 'should not throw when double unbound')
  })

  global.gc()
})
