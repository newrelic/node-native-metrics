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
  const CPU_EPSILON = SPIN_TIME * 0.05 // Allowed fudge factor for CPU times in MS
  const metricEmitter = require('../..')({ timeout: 10 })
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

  // Check that the values are reset after the first call.
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

  console.log('spinning cpu...')
  const start = Date.now()
  while (Date.now() - start < SPIN_TIME) {} // Spin the CPU for 2 seconds.

  // Wait another tick and then check the loop stats.
  await new Promise((resolve) => setTimeout(resolve, 100))

  metric = metricEmitter.getLoopMetrics()
  const testDuration = Date.now() - testStart + CPU_EPSILON
  const durationSquare = testDuration * testDuration
  const usage = metric.usage

  const meanTime = usage.total / usage.count
  if (process.arch === 'arm64') {
    console.log(
      `{ min: ${usage.min}, max: ${usage.max}, meanTime: ${meanTime}, count: ${usage.count}, total: ${usage.total} }`
    )
  }
  assert.ok(
    usage.total * MICRO_TO_MILLIS > SPIN_TIME - CPU_EPSILON,
    'should have total greater than spin time'
  )
  assert.ok(
    usage.total * MICRO_TO_MILLIS <= testDuration,
    'should have total less than wall-clock time'
  )
  assert.ok(usage.min <= meanTime, 'should have min less than the mean usage time')
  assert.ok(usage.max >= meanTime, 'should have max greater than the mean usage time')
  assert.ok(usage.max * MICRO_TO_MILLIS > SPIN_TIME - CPU_EPSILON, 'should have expected max')
  assert.ok(
    usage.sumOfSquares * MICRO_TO_MILLIS * MICRO_TO_MILLIS < durationSquare,
    'should have expected sumOfSquares'
  )
  assert.ok(usage.count >= 2, 'should have expected count')
})
