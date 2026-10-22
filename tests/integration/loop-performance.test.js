/*
 * Copyright 2024 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')

// The purpose of this test is to measure how much tracking metrics impacts the
// processing overhead of the application loop.
//
// The previous implementation counted how many `setTimeout(fn, 1)` callbacks
// fired across a single 30s window without the hooks and a second 30s window
// with them, then compared the two counts. That was flaky on CI for two
// reasons:
//
//   1. It took a single A/B sample over two different time windows, so any
//      transient load on the runner during the second window was wrongly
//      attributed to the native hooks.
//   2. It measured `setTimeout` fire counts, which depend on the OS timer
//      resolution (notably coarse/variable on Windows) rather than on actual
//      loop overhead.
//
// The native overhead is incurred *per event loop tick* (a `uv_check` handle),
// so a meaningful measurement must actually cycle the loop. We drive a fixed
// number of ticks with `setImmediate` (which is tied to loop iteration, not the
// OS timer) and time how long that takes with vs. without the hooks attached.
// We run many short, interleaved rounds so slow drift in runner load cancels
// out, and compare the *median* per-round ratio so a single slow sample cannot
// fail the run.

const TICKS_PER_ROUND = 20_000

// Resolve once the event loop has cycled `TICKS_PER_ROUND` times, returning the
// elapsed nanoseconds measured with a monotonic clock.
function timeTicks() {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint()
    let remaining = TICKS_PER_ROUND
    function tick() {
      if (--remaining <= 0) {
        return resolve(Number(process.hrtime.bigint() - start))
      }
      setImmediate(tick)
    }
    setImmediate(tick)
  })
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

test('loop performance test', { timeout: 60_000 }, async (t) => {
  const ROUNDS = 15
  // With interleaved rounds and a median comparison the measurement is stable,
  // so a strict bound is appropriate: the median hooked round must not be more
  // than 10% slower than the median unhooked round.
  const MAX_OVERHEAD = 0.1

  const natives = require('../../')()
  t.after(function () {
    natives.unbind()
  })

  // Warm up so JIT compilation does not skew the first measured rounds.
  await timeTicks()

  const withoutTimes = []
  const withTimes = []

  for (let i = 0; i < ROUNDS; i++) {
    // Measure a round with the hooks detached.
    natives.unbind()
    withoutTimes.push(await timeTicks())

    // Measure a round with the hooks attached, exercising a metrics read as
    // the original test did to ensure the hooks are actually active.
    natives.bind()
    natives.getLoopMetrics()
    withTimes.push(await timeTicks())
  }

  const withoutMedian = median(withoutTimes)
  const withMedian = median(withTimes)
  const overhead = (withMedian - withoutMedian) / withoutMedian

  assert.ok(
    overhead <= MAX_OVERHEAD,
    `native metrics hooks should add no more than ${MAX_OVERHEAD * 100}% overhead; ` +
      `measured ${(overhead * 100).toFixed(2)}% ` +
      `(without=${withoutMedian}ns, with=${withMedian}ns)`
  )
})
