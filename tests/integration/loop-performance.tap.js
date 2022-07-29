/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')

const TEST_DURATION = 30 * 1000

tap.test('loop performance test', { timeout: 2 * TEST_DURATION + 1000 }, function (t) {
  let timeout = null
  let callCount = 0
  let natives = null

  t.teardown(function () {
    if (natives) {
      natives.unbind()
    }
  })

  t.comment('measuring without loop counter')
  setTimeoutCount()
  setTimeout(function () {
    const noMetricsCount = callCount
    callCount = 0
    clearTimeout(timeout)

    natives = require('../../')()
    const readInterval = setInterval(function () {
      natives.getLoopMetrics() // To reset the metrics
    }, 1000)

    t.comment('measuring with loop counter')
    setTimeoutCount()
    setTimeout(function () {
      const withMetricsCount = callCount
      callCount = 0
      clearTimeout(timeout)
      clearInterval(readInterval)

      t.comment(noMetricsCount + ' vs ' + withMetricsCount)
      t.ok(
        noMetricsCount * 0.98 < withMetricsCount,
        'should not impact performance by more than 2%'
      )
      t.end()
    }, TEST_DURATION)
  }, TEST_DURATION)

  function setTimeoutCount() {
    timeout = setTimeout(function () {
      ++callCount
      setTimeoutCount()
    }, 1)
  }
})
