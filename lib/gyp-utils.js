/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
const utils = module.exports
const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const { IS_WIN } = require('./common')

/**
 * This code heavily borrows from node-pre-gyp.
 * https://github.com/mapbox/node-pre-gyp/blob/e0b3b6/lib/util/compile.js#L18-L55
 */
utils.findNodeGyp = function findNodeGyp() {
  // First, look for it in the NPM environment variable.
  let gypPath = null
  if (process.env.npm_config_node_gyp) {
    try {
      gypPath = process.env.npm_config_node_gyp
      fs.accessSync(gypPath)
      return gypPath
    } catch (err) {
      // This method failed, hopefully the next will succeed...
    }
  }

  // Next, see if the package is installed somewhere.
  try {
    // eslint-disable-next-line node/no-missing-require
    const gypPkgPath = require.resolve('node-gyp')
    gypPath = path.resolve(gypPkgPath, '../../bin/node-gyp.js')
    fs.accessSync(gypPath)
    return gypPath
  } catch (err) {
    // This method failed, hopefully the next will succeed...
  }

  // Then look for it in NPM's install location.
  try {
    // eslint-disable-next-line node/no-missing-require
    const npmPkgPath = require.resolve('npm')
    gypPath = path.resolve(npmPkgPath, '../../node_modules/node-gyp/bin/node-gyp.js')
    fs.accessSync(gypPath)
    return gypPath
  } catch (err) {
    // This method failed, hopefully the next will succeed...
  }

  // All of that failed, now look for it next to node itself.
  const nodeNpmPkgPath = path.resolve(process.execPath, '../../lib/node_modules/npm/')
  gypPath = path.join(nodeNpmPkgPath, 'node_modules/node-gyp/bin/node-gyp.js')
  try {
    fs.accessSync(gypPath)
    return gypPath
  } catch {
    return null
  }
}

utils.extractGypCmd = function extractGypCmd(args) {
  let cmd = null
  const gyp = utils.findNodeGyp()
  if (gyp) {
    args.unshift(gyp) // push_front
    cmd = process.execPath
  } else {
    cmd = IS_WIN ? 'node-gyp.cmd' : 'node-gyp'
  }

  return cmd
}

utils.gypVersion = function gypVersion() {
  const args = ['-v']
  const cmd = utils.extractGypCmd(args)
  const child = cp.spawnSync(cmd, args)
  const match = /v(\d+\.\d+\.\d+)/.exec(child.stdout)
  return match && match[1]
}

utils.execGyp = function execGyp(args, opts) {
  const cmd = utils.extractGypCmd(args)
  const spawnOpts = {}
  if (!opts.quiet) {
    spawnOpts.stdio = [0, 1, 2]
  }
  console.log('> ' + cmd + ' ' + args.join(' ')) // eslint-disable-line no-console

  const child = cp.spawnSync(cmd, args, spawnOpts)

  if (child.status !== 0) {
    throw new Error('Command exited with non-zero code: ' + child.status)
  }
}
