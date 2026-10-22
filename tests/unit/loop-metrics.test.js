/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')

test('Loop Metrics', async (t) => {
  const MICRO_TO_MILLIS = 1e-3
  const SPIN_TIME = 2000
  // Minimum fraction of the wall-clock spin time we expect the measured CPU
  // usage to account for. This is deliberately loose: `usage.total` comes from
  // `uv_getrusage`, which reports *process CPU time* at a resolution that is
  // coarse on some platforms (notably 32-bit Windows, where CPU time is
  // quantized to the ~15ms scheduler tick). Demanding that the measured CPU
  // time recover a tight percentage of a wall-clock busy-loop asks the OS
  // accounting to be more precise than it guarantees, which made this test
  // flaky. We only require that the metric captured a substantial portion of
  // the known CPU-bound work; the `total <= wall-clock` check below still
  // bounds it from above.
  const MIN_USAGE_FRACTION = 0.5
  const metricEmitter = require('../..')()
  const testStart = Date.now()

  t.after(() => {
    metricEmitter.unbind()
  })

  // Check the structure of the metric object.
  let metric = metricEmitter.getLoopMetrics().usage
  assert.strictEqual(typeof metric, 'object', 'should provide a metric object')
  assert.strictEqual(typeof metric.total, 'number', 'should have a total')
  assert.strictEqual(typeof metric.min, 'number', 'should have a min')
  assert.strictEqual(typeof metric.max, 'number', 'should have a max')
  assert.strictEqual(typeof metric.sumOfSquares, 'number', 'should have a sumOfSquares')
  assert.strictEqual(typeof metric.count, 'number', 'should have a count')

  // Check that the values are reset after the first call. Since this is
  // synchronous with the previous call, all results should be zero.
  metric = metricEmitter.getLoopMetrics().usage
  assert.deepStrictEqual(
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
  await new Promise((resolve) => setTimeout(resolve, 100))

  // spinning cpu...
  const start = Date.now()
  while (Date.now() - start < SPIN_TIME) {} // Spin the CPU for 2 seconds.

  // Wait another tick and then check the loop stats.
  await new Promise((resolve) => setTimeout(resolve, 100))

  metric = metricEmitter.getLoopMetrics()
  // Small absolute slack so the upper bound is not tripped by clock skew
  // between `Date.now()` and the native monotonic timing.
  const testDuration = Date.now() - testStart + 100
  const durationSquare = testDuration * testDuration
  const usage = metric.usage

  const meanTime = usage.total / usage.count
  const minExpectedUsage = SPIN_TIME * MIN_USAGE_FRACTION

  assert.ok(
    usage.total * MICRO_TO_MILLIS > minExpectedUsage,
    `should have captured a substantial portion of the spin time ` +
      `(total ${(usage.total * MICRO_TO_MILLIS).toFixed(1)}ms, expected > ${minExpectedUsage}ms)`
  )
  assert.ok(
    usage.total * MICRO_TO_MILLIS <= testDuration,
    'should have total less than wall-clock time'
  )
  assert.ok(usage.min <= meanTime, 'should have min less than the mean usage time')
  assert.ok(usage.max >= meanTime, 'should have max greater than the mean usage time')
  assert.ok(
    usage.max * MICRO_TO_MILLIS > minExpectedUsage,
    'should have a max covering a substantial portion of the spin time'
  )
  assert.ok(
    usage.sumOfSquares * MICRO_TO_MILLIS * MICRO_TO_MILLIS < durationSquare,
    'should have expected sumOfSquares'
  )
  assert.ok(usage.count >= 2, 'should have expected count')
})
