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
  nock('https://nr-downloads-main.s3.amazonaws.com:443')
    .put(/nodejs_agent/)
    .reply(200)
  execSync('rm -rf ./build/Release/*')
  execSync(`node ./lib/pre-build build native_metrics`)
  upload('native_metrics', t.end)
})

tap.test('upload failure', function(t) {
  nock('https://nr-downloads-main.s3.amazonaws.com:443')
    .put(/nodejs_agent/)
    .reply(404)
  execSync('rm -rf ./build/Release/*')
  execSync(`node ./lib/pre-build build native_metrics`)
  upload('native_metrics', (err) => {
    t.equal(err.message, 'Failed to upload file: null', 'should fail upload')
    t.end()
  })
})
