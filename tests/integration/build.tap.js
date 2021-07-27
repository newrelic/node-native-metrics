/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const CMDS = ['build', 'rebuild', 'install']

tap.test('pre-build commands', function(t) {
  t.beforeEach(() => {
    execSync('rm -rf ./build/Release/*')
  })

  CMDS.forEach((cmd) => {
    t.test(`${cmd} test`, function(t) {
      execSync(`node ./lib/pre-build ${cmd} native_metrics`)
      const binary = fs.readdirSync('./build/Release').filter((file) => file.endsWith('.node'))
      t.match(
        binary,
        /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
        'should build binary')
      t.end()
    });
  })

  t.test('failed download', { skip: os.platform() !== 'darwin'}, function(t) {
    t.throws(() => execSync('node ./lib/pre-build --no-build install native_metrics'),
      'should error when trying to download on mac')
    const binary = fs.readdirSync('./build/Release').filter((file) => file.endsWith('.node'))
    t.same(binary, [], 'should not download binary for mac')
    t.end()
  })

  t.test('download', { skip: os.platform() === 'darwin'}, function(t) {
    execSync('node ./lib/pre-build --no-build install native_metrics')
    const binary = fs.readdirSync('./build/Release').filter((file) => file.endsWith('.node'))
    t.match(
      binary,
      /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
      'should download binary')
    t.end()
  })

  t.test('invalid cmd(no-op)', function(t) {
    execSync('node ./lib/pre-build install native_metrics')
    const binary = fs.readdirSync('./build/Release').filter((file) => file.endsWith('.node'))
    t.match(
      binary,
      /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
      'should download binary')
    t.end()
  })

  t.end()
})
