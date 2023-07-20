/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const sinon = require('sinon')
const cp = require('child_process')
const common = require('../../lib/common')
const gypUtils = require('../../lib/gyp-utils')
const EventEmitter = require('events')

tap.test('gyp-utils tests', (t) => {
  t.autoend()

  t.test('findNodeGyp', (t) => {
    t.autoend()

    t.test('should return gyp path from `process.env.npm_config_node_gyp`', (t) => {
      const expectedPath = `${process.cwd()}/index.js`
      process.env.npm_config_node_gyp = expectedPath
      t.teardown(() => {
        delete process.env.npm_config_node_gyp
      })

      const gypPath = gypUtils.findNodeGyp()
      t.equal(gypPath, expectedPath)
      t.end()
    })

    // TODO: figure out how to stub require.resolve
    /* t.test('should return node-gyp path', (t) => {
      require.cache['node-gyp'] = process.cwd()
      sinon.stub(fs, 'accessSync')
      fs.accessSync.returns(true)
      const gypPath = gypUtils.findNodeGyp()
      t.end()
    })*/
  })

  t.test('extractGypCmd', (t) => {
    t.autoend()
    let sandbox

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(gypUtils, 'findNodeGyp')
    })

    t.afterEach(() => {
      sandbox.restore()
    })

    t.test('should add gyp path to args and return cmd', (t) => {
      const gypPath = '/path/to/node-gyp'
      gypUtils.findNodeGyp.returns(gypPath)
      const args = ['-v']
      const cmd = gypUtils.extractGypCmd(args)
      t.equal(cmd, process.execPath)
      t.ok(args.length === 2, 'should add an arg')
      t.equal(args[0], gypPath, 'gypPath be prepended to args array')
      t.end()
    })

    t.test('should not add gyp path to args if it is not found', (t) => {
      const args = ['arg1']
      gypUtils.findNodeGyp.returns(false)
      const cmd = gypUtils.extractGypCmd(args)
      t.equal(cmd, common.IS_WIN ? 'node-gyp.cmd' : 'node-gyp')
      t.ok(args.length === 1, 'should not add an arg')
      t.end()
    })
  })

  t.test('gypVersion', (t) => {
    t.autoend()
    let sandbox

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(cp, 'spawnSync')
    })

    t.afterEach(() => {
      sandbox.restore()
    })

    t.test('should find gyp version', (t) => {
      const expectedVersion = '10.0.0'
      cp.spawnSync.returns({ stdout: `v${expectedVersion}` })
      const version = gypUtils.gypVersion()
      t.equal(version, expectedVersion)
      t.end()
    })

    t.test('should not return version if stdout does not match vx.x.x', (t) => {
      cp.spawnSync.returns({ stdout: 'random stuff' })
      const version = gypUtils.gypVersion()
      t.notOk(version)
      t.end()
    })
  })

  t.test('execGyp', (t) => {
    t.autoend()
    let sandbox

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(cp, 'spawn')
    })

    t.afterEach(() => {
      sandbox.restore()
    })

    t.test('should return if code is 0', (t) => {
      const emitter = new EventEmitter()
      cp.spawn.returns(emitter)
      gypUtils.execGyp([], {}, t.end)
      t.same(
        cp.spawn.args[0][2],
        { stdio: [0, 1, 2] },
        'spawn opts should include stdio if not quiet'
      )
      emitter.emit('close', 0)
    })

    t.test('should not set stdio on spawn if opts.quiet is true', (t) => {
      const opts = { quiet: true }
      const emitter = new EventEmitter()
      cp.spawn.returns(emitter)
      gypUtils.execGyp([], opts, t.end)
      t.same(cp.spawn.args[0][2], {}, 'spawn opts should include stdio if not quiet')
      emitter.emit('close', 0)
    })

    t.test('should return with error if spawn fails', (t) => {
      const emitter = new EventEmitter()
      cp.spawn.returns(emitter)
      const expectedErr = new Error('failed to spawn gyp cmd')
      gypUtils.execGyp([], {}, (err) => {
        t.same(err, expectedErr)
        t.end()
      })
      emitter.emit('error', expectedErr)
    })

    t.test('should return with error if code is not 0', (t) => {
      const emitter = new EventEmitter()
      cp.spawn.returns(emitter)
      gypUtils.execGyp([], {}, (err) => {
        t.equal(err.message, 'Command exited with non-zero code: 1')
        t.end()
      })
      emitter.emit('close', 1)
    })
  })
})
