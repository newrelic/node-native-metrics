/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
const fs = require('fs')
const http = require('http')
const path = require('path')
const zlib = require('zlib')
const { execSync } = require('child_process')
const BINARY_TMP = '/var/tmp/'

function findBinary() {
  return fs.readdirSync(BINARY_TMP).filter((file) => {
    return file.endsWith('.node')
  })
}

// building module to serve in the server instead of grabbing from
// download.newrelic.com
execSync(`node ./lib/pre-build rebuild native_metrics`)
// moving module to avoid a passing test on download
// even though the file existing in the build/Release folder
execSync(`mv ./build/Release/*.node ${BINARY_TMP}`)
const [file] = findBinary()
const binaryPath = path.join(BINARY_TMP, file)
// remove build folder as it is recreated during install/download
execSync(`rm -rf ./build`)

const server = http.createServer(function (req, res) {
  const raw = fs.createReadStream(binaryPath)
  res.writeHead(200, { 'content-encoding': 'gzip' })
  raw.pipe(zlib.createGzip()).pipe(res)
})

server.listen(function () {
  const port = server.address().port
  // eslint-disable-next-line no-console
  console.log(`Started download server on port: ${port}`)
  process.send && process.send({ msg: 'STARTED', port })
})
