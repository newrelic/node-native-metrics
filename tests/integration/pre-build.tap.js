/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const { execSync, fork } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const CMDS = ['build', 'rebuild', 'install']
const platform = os.platform()
const NO_PREBUILTS = ['darwin', 'win32']
const { IS_WIN } = require('../../lib/common')

/**
 * Locates the pre-built native metrics binary in `./build/Release` folder.
 */
function findBinary() {
  return fs.readdirSync('./build/Release').filter((file) => {
    return file.endsWith('.node')
  })
}

/**
 *  Helper to wait for a child process to send an expected message.
 *
 *  @param {EventEmitter} child forked process
 *  @param {string} msg expected messeage from child process
 */
function waitFor(child, msg) {
  return new Promise((resolve) => {
    child.on('message', handler)

    function handler(message) {
      if (message.msg === msg) {
        child.removeListener('message', handler)
        resolve(message.port)
      }
    }
  })
}

tap.test('pre-build commands', function (t) {
  t.beforeEach(() => {
    execSync('rm -rf ./build/Release/*')
  })

  CMDS.forEach((cmd) => {
    t.test(`${cmd} test`, function (t) {
      execSync(`node ./lib/pre-build ${cmd} native_metrics`)
      const binary = findBinary()
      t.match(
        binary,
        /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
        'should build binary'
      )
      t.end()
    })
  })

  t.test('failed download', { skip: !NO_PREBUILTS.includes(platform) }, function (t) {
    t.throws(
      () => execSync('node ./lib/pre-build --no-build install native_metrics'),
      `should error when trying to download on ${platform}`
    )
    const binary = findBinary()
    t.same(binary, [], `should not download binary for ${platform}`)
    t.end()
  })

  // no reason to test downloading on windows. only reason we test on mac is so
  // you can run these tests locally
  t.test('download', { skip: IS_WIN }, async function (t) {
    const downloadServer = fork(path.join(__dirname, './download-server.js'))
    const port = await waitFor(downloadServer, 'STARTED')
    process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST = `http://localhost:${port}/`
    execSync('node ./lib/pre-build --no-build install native_metrics')
    const binary = findBinary()
    t.match(
      binary,
      /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
      'should download binary'
    )
    downloadServer.kill()
  })

  // no reason to test downloading on windows. only reason we test on mac is so
  // you can run these tests locally
  t.test('download with proxy', { skip: IS_WIN }, async function (t) {
    const proxyServer = fork(path.join(__dirname, './proxy-server.js'))
    const downloadServer = fork(path.join(__dirname, './download-server.js'))
    const proxyPromise = waitFor(proxyServer, 'STARTED')
    const downloadPromise = waitFor(downloadServer, 'STARTED')
    const [proxyPort, downloadPort] = await Promise.all([proxyPromise, downloadPromise])

    process.env.NR_NATIVE_METRICS_PROXY_HOST = `http://localhost:${proxyPort}`
    process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST = `http://localhost:${downloadPort}/`
    execSync(`node ./lib/pre-build --no-build install native_metrics`)
    const binary = findBinary()
    t.match(
      binary,
      /_newrelic_native_metrics-\d{1,3}_\d{1,3}_\d{1,3}-native_metrics.*\.node/,
      'should download binary'
    )
    proxyServer.kill()
    downloadServer.kill()
  })

  t.test('invalid cmd(no-op)', function (t) {
    execSync('node ./lib/pre-build invalid-command native_metrics')
    const binary = findBinary()
    t.same(binary, [], 'should not build with invalid command')
    t.end()
  })

  t.end()
})
