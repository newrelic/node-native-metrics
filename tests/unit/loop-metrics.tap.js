/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')

tap.test('Loop Metrics', function (t) {
  const MICRO_TO_MILLIS = 1e-3
  const SPIN_TIME = 2000
  const CPU_EPSILON = SPIN_TIME * 0.05 // Allowed fudge factor for CPU times in MS
  const metricEmitter = require('../../')({ timeout: 10 })
  const testStart = Date.now()

  t.teardown(function () {
    metricEmitter.unbind()
  })

  // Check the structure of the metric object.
  let metric = metricEmitter.getLoopMetrics().usage
  t.type(metric, Object, 'should provide a metric object')
  t.type(metric.total, 'number', 'should have a total')
  t.type(metric.min, 'number', 'should have a min')
  t.type(metric.max, 'number', 'should have a max')
  t.type(metric.sumOfSquares, 'number', 'should have a sumOfSquares')
  t.type(metric.count, 'number', 'should have a count')

  // Short circuit if the structure isn't correct.
  if (!t.passing()) {
    return t.end()
  }

  // Check that the values are reset after the first call. Since this is
  // synchronous with the previous call, all results should be zero.
  metric = metricEmitter.getLoopMetrics().usage
  t.same(
    metric,
    {
      total: 0,
      min: 0,
      max: 0,
      sumOfSquares: 0,
      count: 0
    },
    'should reset all the values'
  )

  // Queue up a loop with some CPU burn.
  // XXX  Keep this as a timeout. On Node v4 it causes an extra period of idle
  //      wait on IO due to a bug in timers. This time should not be counted in
  //      the actual loop time because the process isn't doing anything.
  setTimeout(spinner, 100)

  function spinner() {
    t.comment('spinning cpu...')
    const start = Date.now()
    while (Date.now() - start < SPIN_TIME) {} // Spin the CPU for 2 seconds.

    // Finally, wait another tick and then check the loop stats.
    setTimeout(afterSpin, 100)
  }

  function afterSpin() {
    metric = metricEmitter.getLoopMetrics()
    const testDuration = Date.now() - testStart + CPU_EPSILON
    const durationSquare = testDuration * testDuration
    const usage = metric.usage

    const meanTime = usage.total / usage.count
    if (process.arch === 'arm64') {
      t.comment(
        `{ min: ${usage.min}, max: ${usage.max}, meanTime: ${meanTime}, count: ${usage.count}, total: ${usage.total} }`
      )
    }
    t.ok(
      usage.total * MICRO_TO_MILLIS > SPIN_TIME - CPU_EPSILON,
      'should have total greater than spin time'
    )
    t.ok(
      usage.total * MICRO_TO_MILLIS <= testDuration,
      'should have total less than wall-clock time'
    )
    t.ok(usage.min <= meanTime, 'should have min less than the mean usage time')
    t.ok(usage.max >= meanTime, 'should have max greater than the mean usage time')
    t.ok(usage.max * MICRO_TO_MILLIS > SPIN_TIME - CPU_EPSILON, 'should have expected max')
    t.ok(
      usage.sumOfSquares * MICRO_TO_MILLIS * MICRO_TO_MILLIS < durationSquare,
      'should have expected sumOfSquares'
    )
    t.ok(usage.count >= 2, 'should have expected count')

    // Done!
    t.end()
  }
})
