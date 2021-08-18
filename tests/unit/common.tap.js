/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const sinon = require('sinon')
const common = require('../../lib/common')

tap.test('common tests', (t) => {
  t.before(() => {
    sinon.stub(console, 'log')
    sinon.stub(console, 'error')
  })

  tap.test('parseArgs', (t) => {
    const argv = ['arg1', 'arg2', '--opt1', '--opt2']
    const opts = {}
    t.test('set args with -- as opts', (t) => {
      common.parseArgs(argv, opts)
      t.same(opts, { opt1: true, opt2: true }, 'should set opts properly')
      t.end()
    })

    t.test('set all args without -- as args', (t) => {
      const args = common.parseArgs(argv, opts)
      t.same(args, ['arg1', 'arg2'], 'should set args properly')
      t.end()
    })
    t.end()
  })

  tap.test('logStart', (t) => {
    common.logStart('install')
    // eslint-disable-next-line no-console
    const [[msg]] = console.log.args
    t.match(msg, /Attempting install in native-metrics/, 'should log msg with proper command')
    t.end()
  })

  tap.test('logFinish', (t) => {
    t.test('log error', (t) => {
      const err = new Error('unit test error')
      sinon.stub(process, 'exit')
      common.logFinish('build', 'target', err)
      // eslint-disable-next-line no-console
      const [[msg]] = console.error.args
      t.equal(
        msg,
        `Failed to execute native-metrics build: ${err.message}`,
        'should log console.error message'
      )
      t.equal(process.exit.args[0][0], 1, 'should exit with code 1')
      process.exit.restore()
      t.end()
    })

    t.test('log success', (t) => {
      common.logFinish('build', 'target')
      // eslint-disable-next-line no-console
      const [, [msg]] = console.log.args
      t.match(msg, /build successful: _newrelic_native_metrics/, 'should log finish message')
      t.end()
    })

    t.end()
  })

  tap.test('getFileName', (t) => {
    t.test('missing target', (t) => {
      t.throws(
        () => common.getFileName(),
        'Missing information for naming compiled binary.',
        'should throw error when missing target'
      )
      t.end()
    })

    t.test('electron naming', (t) => {
      process.env.npm_config_runtime = 'electron'
      const name = common.getFileName('target')
      // eslint-disable-next-line max-len
      const regex = new RegExp(
        `_newrelic_native_metrics-\\d{1,3}_\\d{1,3}_\\d{1,3}-target-${process.platform}-${process.arch}`
      )
      t.match(name, regex, 'should match electron convention')
      t.end()
    })

    t.test('standard naming', (t) => {
      process.env.npm_config_runtime = ''
      const name = common.getFileName('target')
      // eslint-disable-next-line max-len
      const regex = new RegExp(
        `_newrelic_native_metrics-\\d{1,3}_\\d{1,3}_\\d{1,3}-target-${process.versions.modules}-${process.platform}-${process.arch}`
      )
      t.match(name, regex, 'should match electron convention')
      t.end()
    })
    t.end()
  })

  tap.test('getPackageFileName', (t) => {
    const name = common.getPackageFileName('target')
    t.ok(name.endsWith('.gz'), 'should end with .gz')
    t.end()
  })

  tap.test('getBinFileName', (t) => {
    const name = common.getBinFileName('target')
    t.ok(name.endsWith('.node'), 'should end with .node')
    t.end()
  })

  t.end()
})
