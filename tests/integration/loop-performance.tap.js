/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

var tap = require('tap')

var TEST_DURATION = 30 * 1000

tap.test('loop performance test', {timeout: 2 * TEST_DURATION + 1000}, function(t) {
  var timeout = null
  var callCount = 0
  var natives = null

  t.tearDown(function() {
    if (natives) {
      natives.unbind()
    }
  })

  t.comment('measuring without loop counter')
  setTimeoutCount()
  setTimeout(function() {
    var noMetricsCount = callCount
    callCount = 0
    clearTimeout(timeout)

    natives = require('../../')()
    var readInterval = setInterval(function() {
      natives.getLoopMetrics() // To reset the metrics
    }, 1000)

    t.comment('measuring with loop counter')
    setTimeoutCount()
    setTimeout(function() {
      var withMetricsCount = callCount
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
    timeout = setTimeout(function() {
      ++callCount
      setTimeoutCount()
    }, 1)
  }
})
