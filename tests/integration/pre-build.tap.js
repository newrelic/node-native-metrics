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
const platform = os.platform()
const NO_PREBUILTS = ['darwin', 'win32']

function findBinary() {
  return fs.readdirSync('./build/Release').filter((file) => {
    return file.endsWith('.node')
  })
}

tap.test('pre-build commands', function(t) {
  t.beforeEach(() => {
    execSync('rm -rf ./build/Release/*')
  })

  CMDS.forEach((cmd) => {
    t.test(`${cmd} test`, function(t) {
      execSync(`node ./lib/pre-build ${cmd} native_metrics`)
      const binary = findBinary()
      t.match(
        binary,
        /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
        'should build binary')
      t.end()
    })
  })

  t.test('failed download', { skip: !NO_PREBUILTS.includes(platform) }, function(t) {
    t.throws(() => execSync('node ./lib/pre-build --no-build install native_metrics'),
      `should error when trying to download on ${platform}`)
    const binary = findBinary()
    t.same(binary, [], `should not download binary for ${platform}`)
    t.end()
  })

  t.test('download', { skip: NO_PREBUILTS.includes(platform) }, function(t) {
    execSync('node ./lib/pre-build --no-build install native_metrics')
    const binary = findBinary()
    t.match(
      binary,
      /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
      'should download binary')
    t.end()
  })

  t.test('invalid cmd(no-op)', function(t) {
    execSync('node ./lib/pre-build invalid-command native_metrics')
    const binary = findBinary()
    t.same(
      binary,
      [],
      'should not build with invalid command')
    t.end()
  })

  t.end()
})
