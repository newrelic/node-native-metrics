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
// The native overhead is incurred *per event loop tick* (a `uv_check` handle
// that calls `uv_getrusage`), so a meaningful measurement must actually cycle
// the loop. We drive a fixed number of ticks with `setImmediate` (which is tied
// to loop iteration, not the OS timer) and time how long that takes with vs.
// without the hooks attached. We run many short, interleaved rounds so slow
// drift in runner load cancels out, and take the *median* so a single slow
// sample cannot fail the run.
//
// We assert on the ABSOLUTE added time per tick rather than a ratio. A ratio is
// hostage to how much other work each tick does: with near-empty `setImmediate`
// ticks the hook's small fixed cost becomes a large *fraction* of the tick, and
// that fraction swings wildly with how expensive `uv_getrusage` is on a given
// runner (observed ~3% locally vs. ~33% on CI). The absolute per-tick cost is
// the physical thing the hook actually adds and does not depend on the tick's
// own workload. Measured at ~0.5us/tick on bare metal; the 5us ceiling leaves
// ~10x headroom for slower/virtualized CI runners while still catching a gross
// regression (e.g. the hook doing something an order of magnitude costlier).

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
  // Maximum additional nanoseconds the hooks may add per event loop tick. See
  // the file header for how this ceiling was chosen.
  const MAX_ADDED_NS_PER_TICK = 5_000

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
  const addedPerTick = (withMedian - withoutMedian) / TICKS_PER_ROUND

  assert.ok(
    addedPerTick <= MAX_ADDED_NS_PER_TICK,
    `native metrics hooks should add no more than ${MAX_ADDED_NS_PER_TICK}ns per tick; ` +
      `measured ${addedPerTick.toFixed(1)}ns ` +
      `(without=${withoutMedian}ns, with=${withMedian}ns over ${TICKS_PER_ROUND} ticks)`
  )
})
