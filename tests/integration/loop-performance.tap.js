/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')

const TEST_DURATION = 30 * 1000
let performanceThreshold = 0.98
if (process.platform === 'darwin') {
  // The GitHub macOS runners are slow and vary widely in their slowness
  // from run to run.
  performanceThreshold = 0.9
} else if (process.platform === 'win32') {
  performanceThreshold = 0.97
}

tap.test('loop performance test', { timeout: 2 * TEST_DURATION + 1000 }, function (t) {
  // The purpose of this test is to measure how much tracking metrics
  // impacts the processing overhead of the application loop. To do so, we:
  //
  // 1. Count how many times the loop fires without the native metrics
  // hooks attached over a predetermined interval (TEST_DURATION).
  // 2. Count how many times the loop fires with the native metrics hooks
  // attached, and exercise the metrics by resetting them every 1 second
  // over the test duration, again over the same predetermined interval.
  // 3. Calculate the percentage overhead and assert it meets requirements.

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
        noMetricsCount * performanceThreshold < withMetricsCount,
        `should not impact performance by more than ${1 - performanceThreshold}%`
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
