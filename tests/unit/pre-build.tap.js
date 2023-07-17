/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const preBuild = require('../../lib/pre-build')
const { IS_WIN } = require('../../lib/common')
const { rm, mkdir, chmod } = require('fs/promises')
const fs = require('fs')
const nock = require('nock')
const zlib = require('zlib')

tap.test('pre-build tests', (t) => {
  t.autoend()

  t.test('makePath', (t) => {
    t.autoend()
    const fakePath = 'tests/unit/fake-path'

    t.afterEach(async () => {
      try {
        await rm(`${process.cwd()}/${fakePath}`, { recursive: true })
      } catch {
        // swallow removing folder
      }
    })

    t.test('should make a nested folder path accordingly if it does not exist', (t) => {
      preBuild.makePath(fakePath, (err) => {
        t.error(err)
        t.ok(fs.statSync(fakePath), 'path should be made')
        t.end()
      })
    })

    t.test('should return error if it cannot write nested path', async (t) => {
      await mkdir(`${process.cwd()}/${fakePath}`, { recursive: true })
      t.ok(fs.statSync(fakePath), 'path exists')
      return new Promise((resolve) => {
        preBuild.makePath(fakePath, (err) => {
          t.error(err)
          t.ok(fs.statSync(fakePath), 'path should still exist')
          resolve()
        })
      })
    })

    t.test('should not make nested path if it already exists', { skip: IS_WIN }, async (t) => {
      const fullPath = `${process.cwd()}/${fakePath}`
      await mkdir(fullPath, { recursive: true })
      t.ok(fs.statSync(fakePath), 'path exists')
      // chmod does not work on windows, will skip
      await chmod(fullPath, '00400')
      return new Promise((resolve) => {
        preBuild.makePath(fakePath, (err) => {
          t.ok(
            err.message.startsWith(`Do not have access to '${fullPath}'`),
            'should error with EACCESS'
          )
          resolve()
        })
      })
    })

    t.test('should return error if it fails to make nested path', (t) => {
      const expectedErr = new Error('Failed to create dir')
      sinon.stub(fs, 'mkdir')
      fs.mkdir.yields(expectedErr)
      preBuild.makePath(fakePath, (err) => {
        t.same(err, expectedErr, 'should error when it cannot mkdir')
        t.end()
      })
    })
  })

  t.test('build', (t) => {
    t.autoend()
    const gypStub = {}
    let sandbox
    let build

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      gypStub.execGyp = sandbox.stub()
      ;({ build } = proxyquire('../../lib/pre-build', {
        './gyp-utils': gypStub
      }))
    })

    t.afterEach(() => {
      sandbox.restore()
    })

    t.test('should run clean configure if rebuild is true', (t) => {
      gypStub.execGyp.yields(null)
      build('target', true, (err) => {
        t.error(err)
        t.ok(gypStub.execGyp.callCount, 2, 'should call execGyp twice')
        t.same(gypStub.execGyp.args[0][0], ['clean', 'configure'])
        t.equal(gypStub.execGyp.args[1][0][3], 'target')
        t.end()
      })
    })

    t.test('should run configure and build if rebuild is false', (t) => {
      gypStub.execGyp.yields(null)
      build('target', false, (err) => {
        t.error(err)
        t.ok(gypStub.execGyp.callCount, 2, 'should call execGyp twice')
        t.same(gypStub.execGyp.args[0][0], ['configure'])
        t.end()
      })
    })

    t.test('should return error if configure fails', (t) => {
      const expectedErr = new Error('failed to execute cmd')
      gypStub.execGyp.yields(expectedErr)
      build('target', false, (err) => {
        t.same(err, expectedErr)
        t.end()
      })
    })

    t.test('should return error if build fails', (t) => {
      const expectedErr = new Error('failed to execute cmd')
      gypStub.execGyp.onCall(0).yields(null)
      gypStub.execGyp.onCall(1).yields(expectedErr)
      build('target', false, (err) => {
        t.same(err, expectedErr)
        t.end()
      })
    })
  })

  t.test('should move build accordingly', (t) => {
    sinon.stub(fs, 'rename')
    t.teardown(() => {
      fs.rename.restore()
    })

    preBuild.moveBuild('target', (err) => {
      t.error(err)
      t.equal(fs.rename.callCount, 1)
      t.end()
    })

    // call cb manually to end test
    fs.rename.args[0][2]()
  })

  t.test('download', (t) => {
    t.autoend()
    let sandbox

    t.before(() => {
      nock.disableNetConnect()
    })

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    t.afterEach(() => {
      sandbox.restore()
      delete process.env.NR_NATIVE_METRICS_PROXY_HOST
      delete process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST
    })

    t.test('should download and unzip file accordingly', (t) => {
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('https://download.newrelic.com/').get(/.*/).reply(200, file)

      preBuild.download('test', (err, data) => {
        t.error(err)
        t.same(data, expectedData)
        t.end()
      })
    })

    t.test('should return error if 404 occurs', (t) => {
      nock('https://download.newrelic.com/').get(/.*/).reply(404)

      preBuild.download('test', (err) => {
        t.equal(err.message, 'No pre-built artifacts for your OS/architecture.')
        t.end()
      })
    })

    t.test('should return failed to download error if response is not 200 nor 404', (t) => {
      nock('https://download.newrelic.com/').get(/.*/).reply(500)

      preBuild.download('test', (err) => {
        t.match(err.message, /Failed to download.*code 500/)
        t.end()
      })
    })

    t.test('should fail if it cannot unzip', (t) => {
      const expectedData = Buffer.from('testing', 'utf-8')
      nock('https://download.newrelic.com/').get(/.*/).reply(200, expectedData)

      preBuild.download('test', (err) => {
        t.match(err.message, /Failed to unzip.*/)
        t.end()
      })
    })

    /* TODO: not sure how to test when res is a stream
     * saving this for later
    t.test('should fail if the res errors', (t) => {
      const readStream = fs.createReadStream('foo-bar')
      nock('https://download.newrelic.com/')
        .get(//)
        .reply(200, )

      preBuild.download('test', (err) => {
        t.match(err.message, /Failed to download/)
        t.end()
      })

      const err = new Error('failed to finish')
      readStream.emit('error', err)
    })
    */

    t.test('should use https proxy host', (t) => {
      process.env.NR_NATIVE_METRICS_PROXY_HOST = 'https://proxy-stuff.com'
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('https://download.newrelic.com/').get(/.*/).reply(200, file)

      preBuild.download('test', (err, data) => {
        t.error(err)
        t.same(data, expectedData)
        t.end()
      })
    })

    t.test('should use http proxy host', (t) => {
      process.env.NR_NATIVE_METRICS_PROXY_HOST = 'http://proxy-stuff.com'
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('http://download.newrelic.com/').get(/.*/).reply(200, file)

      preBuild.download('test', (err, data) => {
        t.error(err)
        t.same(data, expectedData)
        t.end()
      })
    })

    t.test('should use http download host', (t) => {
      process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST = 'http://fake-stuff.com/'
      // busting cache to re-load the env var so it uses a diff host
      delete require.cache[require.resolve('../../lib/pre-build')]
      const localPreBuild = require('../../lib/pre-build')
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('http://fake-stuff.com/').get(/.*/).reply(200, file)

      localPreBuild.download('test', (err, data) => {
        t.error(err)
        t.same(data, expectedData)
        t.end()
      })
    })
  })

  t.test('saveDownload', (t) => {
    t.autoend()
    let sandbox

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(preBuild, 'makePath')
      sandbox.stub(fs, 'writeFile')
    })

    t.afterEach(() => {
      sandbox.restore()
    })

    t.test('should write download to appropriate path', (t) => {
      preBuild.makePath.yields()
      preBuild.saveDownload('target', 'data', t.end)
      t.equal(fs.writeFile.callCount, 1, 'should save download')
      // call the callback manually to end test
      fs.writeFile.args[0][2]()
    })

    t.test('should return error if creating directory fails', (t) => {
      const expectedErr = new Error('failed to write')
      preBuild.makePath.yields(expectedErr)
      preBuild.saveDownload('target', 'data', (err) => {
        t.same(err, expectedErr)
        t.end()
      })
    })
  })

  t.test('install', (t) => {
    t.autoend()
    let sandbox

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(preBuild, 'build')
      sandbox.stub(preBuild, 'download')
      sandbox.stub(preBuild, 'saveDownload')
      sandbox.stub(preBuild, 'moveBuild')
    })

    t.afterEach(() => {
      sandbox.restore()
      delete process.env.NR_NATIVE_METRICS_NO_BUILD
      delete process.env.NR_NATIVE_METRICS_NO_DOWNLOAD
    })

    t.test('should download without building when no-build is specified', (t) => {
      const data = 'foo'
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      preBuild.download.yields(null, data)
      preBuild.saveDownload.yields(null)
      preBuild.install('target', (err) => {
        t.error(err)
        t.equal(preBuild.build.callCount, 0, 'should not build')
        t.equal(preBuild.download.callCount, 1, 'should download only')
        t.equal(preBuild.saveDownload.callCount, 1, 'should download only')
        t.equal(preBuild.saveDownload.args[0][0], 'target')
        t.equal(preBuild.saveDownload.args[0][1], data)
        t.end()
      })
    })

    t.test('should build and move', (t) => {
      preBuild.build.yields(null)
      preBuild.moveBuild.yields(null)
      preBuild.install('target', (err) => {
        t.error(err)
        t.equal(preBuild.build.callCount, 1, 'should build')
        t.equal(preBuild.moveBuild.callCount, 1, 'should move build')
        t.equal(preBuild.download.callCount, 0, 'should not download')
        t.end()
      })
    })

    t.test('should download if build fails', (t) => {
      const err = new Error('build failed, downloading')
      preBuild.build.yields(err)
      const data = 'foo'
      preBuild.download.yields(null, data)
      preBuild.saveDownload.yields(null)
      preBuild.install('target', (err) => {
        t.error(err)
        t.equal(preBuild.build.callCount, 1, 'should build')
        t.equal(preBuild.download.callCount, 1, 'should not download')
        t.equal(preBuild.saveDownload.callCount, 1, 'should not download')
        t.equal(preBuild.moveBuild.callCount, 0, 'should not move build')
        t.end()
      })
    })

    t.test('should download if moving build fails', (t) => {
      const err = new Error('move failed, downloading')
      preBuild.build.yields(null)
      preBuild.moveBuild.yields(err)
      const data = 'foo'
      preBuild.download.yields(null, data)
      preBuild.saveDownload.yields(null)
      preBuild.install('target', (err) => {
        t.error(err)
        t.equal(preBuild.build.callCount, 1, 'should build')
        t.equal(preBuild.moveBuild.callCount, 1, 'should move build')
        t.equal(preBuild.download.callCount, 1, 'should not download')
        t.equal(preBuild.saveDownload.callCount, 1, 'should not download')
        t.end()
      })
    })

    t.test('should fail if move build fails and download are true', (t) => {
      process.env.NR_NATIVE_METRICS_NO_DOWNLOAD = true
      preBuild.build.yields(null)
      const err = new Error('move failed, downloading')
      preBuild.build.yields(null)
      preBuild.moveBuild.yields(err)
      preBuild.install('target', (err) => {
        t.equal(err.message, 'Downloading is disabled.')
        t.equal(preBuild.download.callCount, 0, 'should not download')
        t.end()
      })
    })

    t.test('should fail if download fails', (t) => {
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      const expectedErr = new Error('download failed')
      preBuild.download.yields(expectedErr)
      preBuild.install('target', (err) => {
        t.same(err, expectedErr)
        t.equal(preBuild.build.callCount, 0, 'should not build')
        t.equal(preBuild.download.callCount, 1, 'should download only')
        t.equal(preBuild.saveDownload.callCount, 0, 'should not save download')
        t.end()
      })
    })

    t.test('should fail if save download fails', (t) => {
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      const data = 'foo'
      preBuild.download.yields(null, data)
      const expectedErr = new Error('saving download failed')
      preBuild.saveDownload.yields(expectedErr)
      preBuild.install('target', (err) => {
        t.same(err, expectedErr)
        t.equal(preBuild.build.callCount, 0, 'should not build')
        t.equal(preBuild.download.callCount, 1, 'should download only')
        t.equal(preBuild.saveDownload.callCount, 1, 'should not save download')
        t.end()
      })
    })
  })

  t.test('executeCli', (t) => {
    t.autoend()
    let sandbox
    let localPreBuild
    let commonStub

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      commonStub = {
        logStart: sandbox.stub(),
        logFinish: sandbox.stub()
      }
      localPreBuild = proxyquire('../../lib/pre-build', {
        './common': commonStub
      })
      sandbox.stub(localPreBuild, 'build')
      sandbox.stub(localPreBuild, 'moveBuild')
      sandbox.stub(localPreBuild, 'install')
    })

    t.afterEach(() => {
      sandbox.restore()
    })
    ;['build', 'rebuild'].forEach((cmd) => {
      t.test(`should build and move when cmd is '${cmd}'`, (t) => {
        localPreBuild.build.yields(null)
        localPreBuild.moveBuild.yields(null)
        localPreBuild.executeCli(cmd, 'target')
        t.equal(localPreBuild.build.callCount, 1, 'should build')
        t.equal(localPreBuild.moveBuild.callCount, 1, 'should move build')
        t.equal(commonStub.logFinish.callCount, 1, 'should log finish')
        t.end()
      })
    })

    t.test('sho8uld call install if cmd is install', (t) => {
      localPreBuild.executeCli('install', 'target')
      t.equal(localPreBuild.install.callCount, 1, 'should call install')
      t.end()
    })

    t.test('should log finish and not move build if build fails', (t) => {
      const err = new Error('build failed')
      localPreBuild.build.yields(err)
      localPreBuild.executeCli('build', 'target')
      t.equal(localPreBuild.build.callCount, 1, 'should build')
      t.equal(localPreBuild.moveBuild.callCount, 0, 'should not move build')
      t.equal(commonStub.logFinish.callCount, 1, 'should log finish')
      t.end()
    })
  })
})
