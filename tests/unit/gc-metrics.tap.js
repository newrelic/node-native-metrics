/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')

tap.test('GC Metrics', function (t) {
  t.plan(17)
  const metricEmitter = require('../../')()

  global.gc()

  const gcs = metricEmitter.getGCMetrics()
  const keys = Object.keys(gcs)
  if (!t.ok(keys.length > 0, 'should notice at least one GC')) {
    return t.end()
  }
  t.type(keys[0], 'string', 'should have strings as keys')

  t.comment('GC stats objects')
  const stats = gcs[keys[0]]
  t.type(stats, 'object', 'should have stats objects')
  t.type(stats.typeId, 'number', 'should have the type ID')
  t.type(stats.type, 'string', 'should have the type name')
  if (!t.type(stats.metrics, 'object', 'should have a metrics object')) {
    return t.end()
  }

  t.comment('GC stats metrics')
  const metrics = stats.metrics
  t.type(metrics.total, 'number', 'should have total field')
  t.type(metrics.min, 'number', 'should have min field')
  t.type(metrics.max, 'number', 'should have max field')
  t.type(metrics.sumOfSquares, 'number', 'should have sumOfSquares field')
  t.type(metrics.count, 'number', 'should have count field')

  t.ok(metrics.total > 0, 'should have reasonable values for total')
  t.ok(metrics.min > 0, 'should have reasonable values for min')
  t.ok(metrics.max > 0, 'should have reasonable values for max')
  t.ok(metrics.max >= metrics.min, 'should have a max larger than a min')
  t.ok(metrics.sumOfSquares > 0, 'should have reasonable values for sumOfSquares')
  t.ok(metrics.count > 0, 'should have reasonable values for count')
})
