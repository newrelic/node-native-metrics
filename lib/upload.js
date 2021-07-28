/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
const {
  getBinFileName,
  parseArgs,
  getPackageFileName,
  logStart,
  logFinish,
  BUILD_PATH,
  REMOTE_PATH
} = require('./common')
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

// XXX This is the one external dep allowed by this module. The aws-sdk must
// XXX be a dev-dep of the module and uploading should only be done after
// XXX installing.
// XXX AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in the environment.
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
var S3_BUCKET = 'nr-downloads-main'
const CMD = 'upload'

if (require.main === module) {
  const [ , , target ] = parseArgs(process.argv, {})
  logStart(CMD)
  upload(target, logFinish.bind(this, CMD, target))
}

function upload(target, cb) {
  const zip = zlib.createGzip()
  const binPath = path.join(BUILD_PATH, getBinFileName(target))
  fs.createReadStream(binPath).pipe(zip)

  const key = path.join(REMOTE_PATH, getPackageFileName(target))

  s3.upload({
    Bucket: S3_BUCKET,
    Key: key,
    Body: zip
  }, function s3UploadCb(err) {
    if (err) {
      cb(new Error('Failed to upload file: ' + err.message))
    } else {
      cb()
    }
  })
}

// exporting upload function to mock outgoing calls
module.exports = upload
