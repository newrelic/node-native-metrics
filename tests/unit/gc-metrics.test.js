/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')

test('GC Metrics', async (t) => {
  const metricEmitter = require('../..')()

  global.gc()

  const gcs = metricEmitter.getGCMetrics()
  const keys = Object.keys(gcs)
  assert.ok(keys.length > 0, 'should notice at least one GC')
  assert.equal(typeof keys[0], 'string', 'should have strings as keys')

  await t.test('GC stats objects', () => {
    const stats = gcs[keys[0]]
    assert.equal(typeof stats, 'object', 'should have stats objects')
    assert.equal(typeof stats.typeId, 'number', 'should have the type ID')
    assert.equal(typeof stats.type, 'string', 'should have the type name')
    assert.equal(typeof stats.metrics, 'object', 'should have a metrics object')
  })

  await t.test('GC stats metrics', () => {
    const metrics = gcs[keys[0]].metrics
    assert.equal(typeof metrics.total, 'number', 'should have total field')
    assert.equal(typeof metrics.min, 'number', 'should have min field')
    assert.equal(typeof metrics.max, 'number', 'should have max field')
    assert.equal(typeof metrics.sumOfSquares, 'number', 'should have sumOfSquares field')
    assert.equal(typeof metrics.count, 'number', 'should have count field')

    assert.ok(metrics.total > 0, 'should have reasonable values for total')
    assert.ok(metrics.min > 0, 'should have reasonable values for min')
    assert.ok(metrics.max > 0, 'should have reasonable values for max')
    assert.ok(metrics.max >= metrics.min, 'should have a max larger than a min')
    assert.ok(metrics.sumOfSquares > 0, 'should have reasonable values for sumOfSquares')
    assert.ok(metrics.count > 0, 'should have reasonable values for count')
  })
})
