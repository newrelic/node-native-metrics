'use strict'

var tap = require('tap')


tap.test('Loop Metrics', function(t) {
  var MICRO_TO_MILLIS = 1e-3
  var SPIN_TIME = 2000
  var CPU_EPSILON = SPIN_TIME * 0.05 // Allowed fudge factor for CPU times in MS
  var metricEmitter = require('../../')()
  var testStart = Date.now()

  t.tearDown(function() {
    metricEmitter.unbind()
  })

  // Check the structure of the metric object.
  var metric = metricEmitter.getLoopMetrics().usage
  t.type(metric, Object, 'should provide a metric object')
  t.type(metric.total,        'number', 'should have a total')
  t.type(metric.min,          'number', 'should have a min')
  t.type(metric.max,          'number', 'should have a max')
  t.type(metric.sumOfSquares, 'number', 'should have a sumOfSquares')
  t.type(metric.count,        'number', 'should have a count')

  // Short circuit if the structure isn't correct.
  if (!t.passing()) {
    return t.end()
  }

  // Check that the values are reset after the first call. Since this is
  // synchronous with the previous call, all results should be zero.
  metric = metricEmitter.getLoopMetrics().usage
  t.deepEqual(metric, {
    total:        0,
    min:          0,
    max:          0,
    sumOfSquares: 0,
    count:        0
  }, 'should reset all the values')

  // Queue up a loop with some CPU burn.
  // XXX  Keep this as a timeout. On Node v4 it causes an extra period of idle
  //      wait on IO due to a bug in timers. This time should not be counted in
  //      the actual loop time because the process isn't doing anything.
  setTimeout(function spinner() {
    t.comment('spinning cpu...')
    var start = Date.now()
    while (Date.now() - start < SPIN_TIME) {} // Spin the CPU for 2 seconds.

    // Finally, wait another tick and then check the loop stats.
    setTimeout(function() {
      metric = metricEmitter.getLoopMetrics()
      var testDuration = Date.now() - testStart + CPU_EPSILON
      var durationSquare = testDuration * testDuration
      var usage = metric.usage

      var meanTime = usage.total / usage.count
      t.ok(
        usage.total * MICRO_TO_MILLIS > SPIN_TIME - CPU_EPSILON,
        'should have total greater than spin time'
      )
      t.ok(
        usage.total * MICRO_TO_MILLIS <= testDuration,
        'should have total less than wall-clock time'
      )
      t.ok(usage.min < meanTime, 'should have min less than the mean usage time')
      t.ok(usage.max > meanTime, 'should have max greater than the mean usage time')
      t.ok(
        usage.max * MICRO_TO_MILLIS > SPIN_TIME - CPU_EPSILON,
        'should have expected max'
      )
      t.ok(
        usage.sumOfSquares * MICRO_TO_MILLIS * MICRO_TO_MILLIS < durationSquare,
        'should have expected sumOfSquares'
      )
      t.ok(usage.count >= 2, 'should have expected count')

      // Done!
      t.end()
    }, 5)
  }, 5)
})
