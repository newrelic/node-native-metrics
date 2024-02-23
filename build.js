#!/usr/bin/env node
/*
 * Copyright 2024 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

// If we are going to support Windows, we need some way to cobble together
// the build command that is portable. In other words, we can't rely on a
// Bash subshell, `$(node...)`, to get the current Node version to provide
// to `--target`. So we'll use the scripting language at our disposal that is
// cross platform 😃

const fs = require('fs/promises')
const path = require('path')
const { spawn } = require('child_process')

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('build done')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
  })

async function main() {
  await fs.rm(path.join(__dirname, 'build'), { force: true, recursive: true })
  await fs.rm(path.join(__dirname, 'prebuilds'), { force: true, recursive: true })

  const bin = process.argv[0]
  const args = [
    path.join(__dirname, 'node_modules', 'prebuildify', 'bin.js'),
    '--strip',
    // We want to apply all tags since we are building across multiple
    // Node.js versions. If we don't we will stop on the binaries during
    // packaging.
    '--tag-uv',
    '--tag-armv',
    '--tag-libc',
    // We need to be explicit here so that the ABI tag gets applied.
    '--napi=false',
    '--target',
    `node@${process.versions.node}`
  ]

  return new Promise((res, rej) => {
    const proc = spawn(bin, args)
    proc.stderr.pipe(process.stderr)
    proc.stdout.pipe(process.stdout)

    proc.on('close', (code, signal) => {
      if (code !== 0) {
        return rej(Error(`failed with code ${code} and signal ${signal}`))
      }
      res()
    })
  })
}
