/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const { execSync } = require('child_process')
const upload = require('../../lib/upload')
const nock = require('nock')

tap.test('upload', function(t) {
  t.before(() => {
    nock.disableNetConnect()
  })

  t.teardown(() => {
    nock.enableNetConnect()
  })

  t.test('success', (t) => {
    nock('https://nr-downloads-main.s3.amazonaws.com:443')
      .put(/nodejs_agent/)
      .reply(200)
    execSync('rm -rf ./build/Release/*')
    execSync(`node ./lib/pre-build build native_metrics`)
    upload('native_metrics', t.end)
  })

  t.test('failure', (t) => {
    nock('https://nr-downloads-main.s3.amazonaws.com:443')
      .put(/nodejs_agent/)
      .reply(404)
    execSync('rm -rf ./build/Release/*')
    execSync(`node ./lib/pre-build build native_metrics`)
    upload('native_metrics', (err) => {
      t.ok(err, 'should error when not returning 200')
      t.end()
    })
  })

  t.end()
})

