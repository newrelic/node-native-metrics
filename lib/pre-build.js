/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

// This file is largely based upon the work done for node-pre-gyp. We are not
// using that module directly due to issues we've run into with the intricacies
// of various node and npm versions that we must support.
// https://www.npmjs.com/package/node-pre-gyp

// XXX This file must not have any deps. This file will run during the install
// XXX step of the module and we are _not_ guaranteed that the dependencies have
// XXX already installed. Core modules are okay.
const fs = require('fs/promises')
const http = require('http')
const https = require('https')
const os = require('os')
const path = require('path')
const semver = require('semver')
const zlib = require('zlib')
const ProxyAgent = require('https-proxy-agent')

const {
  getBinFileName,
  getPackageFileName,
  parseArgs,
  logStart,
  logFinish,
  PACKAGE_ROOT,
  BUILD_PATH,
  REMOTE_PATH,
  IS_WIN
} = require('./common')
const { execGyp, gypVersion } = require('./gyp-utils')

const CPU_COUNT = os.cpus().length
const DOWNLOAD_HOST =
  process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST || 'https://download.newrelic.com/'

const opts = {}
const preBuild = module.exports

preBuild.load = function load(target) {
  return require(path.join(BUILD_PATH, getBinFileName(target)))
}

preBuild.makePath = async function makePath(pathToMake) {
  const accessRights = fs.constants.R_OK | fs.constants.W_OK

  // We only want to make the parts after the package directory.
  pathToMake = path.join(PACKAGE_ROOT, pathToMake)

  try {
    await fs.access(pathToMake, accessRights)
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      // It exists but we don't have read+write access! This is a problem.
      throw new Error(`Do not have access to '${pathToMake}': ${err}`)
    }

    await fs.mkdir(pathToMake, { recursive: true })
  }
}

preBuild.build = function build(target, rebuild) {
  const HAS_OLD_NODE_GYP_ARGS_FOR_WINDOWS = semver.lt(gypVersion() || '0.0.0', '3.7.0')

  if (IS_WIN && HAS_OLD_NODE_GYP_ARGS_FOR_WINDOWS) {
    target = '/t:' + target
  }

  const cmds = rebuild ? ['clean', 'configure'] : ['configure']

  execGyp(cmds, opts)

  const jobs = Math.round(CPU_COUNT / 2)
  execGyp(['build', '-j', jobs, target], opts)
}

preBuild.moveBuild = async function moveBuild(target) {
  const filePath = path.join(BUILD_PATH, target + '.node')
  const destination = path.join(BUILD_PATH, getBinFileName(target))
  await fs.rename(filePath, destination)
}

function setupRequest(url, fileName) {
  let client = null
  let options = {}
  const proxyHost = process.env.NR_NATIVE_METRICS_PROXY_HOST

  if (proxyHost) {
    const parsedUrl = new URL(DOWNLOAD_HOST)
    options = parsedUrl
    options.path = REMOTE_PATH + fileName
    options.agent = new ProxyAgent(proxyHost)
    client = /^https:/.test(proxyHost) ? https : http
  } else {
    options = url
    if (DOWNLOAD_HOST.startsWith('https:')) {
      client = https
    } else {
      // eslint-disable-next-line no-console
      console.log(`Falling back to http, please consider enabling SSL on ${DOWNLOAD_HOST}`)
      client = http
    }
  }

  return { client, options }
}

preBuild.download = async function download(target) {
  const fileName = getPackageFileName(target)
  const url = DOWNLOAD_HOST + REMOTE_PATH + fileName
  const { client, options } = setupRequest(url, fileName)

  return new Promise((resolve, reject) => {
    client.get(options, function handleResponse(res) {
      if (res.statusCode === 404) {
        reject(new Error('No pre-built artifacts for your OS/architecture.'))
      } else if (res.statusCode !== 200) {
        reject(new Error('Failed to download ' + url + ': code ' + res.statusCode))
      }

      const unzip = zlib.createGunzip()
      const buffers = []
      let size = 0

      res.on('error', function httpError(err) {
        reject(new Error('Failed to download ' + url + ': ' + err.message))
      })

      unzip.on('error', function unzipError(err) {
        reject(new Error('Failed to unzip ' + url + ': ' + err.message))
      })

      res.pipe(unzip).on('data', function onResData(data) {
        buffers.push(data)
        size += data.length
      })

      unzip.on('end', function onResEnd() {
        resolve(Buffer.concat(buffers, size))
      })

      res.resume()
    })
  })
}

preBuild.saveDownload = async function saveDownload(target, data) {
  await preBuild.makePath(BUILD_PATH)

  const filePath = path.join(BUILD_PATH, getBinFileName(target))
  await fs.writeFile(filePath, data)
}

preBuild.install = async function install(target) {
  const noBuild = opts['no-build'] || process.env.NR_NATIVE_METRICS_NO_BUILD
  const noDownload = opts['no-download'] || process.env.NR_NATIVE_METRICS_NO_DOWNLOAD

  if (noDownload && !noBuild) {
    // If NR_NATIVE_METRICS_NO_DOWNLOAD env var is specified, jump straight to building
    preBuild.build(target, true)
    return await preBuild.moveBuild(target)
  }

  // Try the download path first, if that fails try building if config allows
  try {
    const data = await preBuild.download(target)
    await preBuild.saveDownload(target, data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Download error: ${err.message}, falling back to build`)

    if (noBuild) {
      throw new Error('Building is disabled by configuration')
    }

    preBuild.build(target, true)
    await preBuild.moveBuild(target)
  }
}

preBuild.executeCli = async function executeCli(cmd, target) {
  logStart(cmd)
  if (cmd === 'build' || cmd === 'rebuild') {
    try {
      preBuild.build(target, cmd === 'rebuild')
      await preBuild.moveBuild(target)
      logFinish(cmd, target)
    } catch (err) {
      logFinish(cmd, target, err)
    }
  } else if (cmd === 'install') {
    try {
      await preBuild.install(target)
      logFinish(cmd, target)
    } catch (err) {
      logFinish(cmd, target, err)
    }
  }
}

if (require.main === module) {
  const [, , cmd, target] = parseArgs(process.argv, opts)
  preBuild.executeCli(cmd, target)
}
