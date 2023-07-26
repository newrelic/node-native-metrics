/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const nock = require('nock')
const zlib = require('zlib')

tap.test('pre-build tests', (t) => {
  t.autoend()

  t.test('makePath', (t) => {
    t.autoend()

    const fakePath = 'tests/unit/fake-path'

    let mockFsPromiseApi
    let preBuild

    t.beforeEach(() => {
      mockFsPromiseApi = {
        constants: {
          R_OK: 4,
          W_OK: 2
        },
        access: sinon.stub().resolves(),
        mkdir: sinon.stub().resolves()
      }
      preBuild = proxyquire('../../lib/pre-build', {
        'fs/promises': mockFsPromiseApi
      })
    })

    t.test('should make a nested folder path accordingly if it does not exist', async (t) => {
      mockFsPromiseApi.access.rejects({ code: 'ENOENT' })
      await preBuild.makePath(fakePath)

      t.ok(
        mockFsPromiseApi.mkdir.calledOnceWith(`${process.cwd()}/${fakePath}`, { recursive: true }),
        'should have called mkdir'
      )
    })

    t.test('should throw if permissions to path are incorrect', (t) => {
      const fullPath = `${process.cwd()}/${fakePath}`
      mockFsPromiseApi.access.rejects({ code: 'EACCESS' })
      t.equal(mockFsPromiseApi.mkdir.callCount, 0, 'should not have called mkdir')
      t.rejects(preBuild.makePath(fakePath), 'should error with EACCESS')

      preBuild.makePath(fakePath).catch((err) => {
        t.ok(err.message.startsWith(`Do not have access to '${fullPath}'`))
        t.end()
      })
    })

    t.test('should throw if creating the nested folder path fails', async (t) => {
      mockFsPromiseApi.access.rejects({ code: 'ENOENT' })
      const expectedError = new Error('whoops')
      mockFsPromiseApi.mkdir.rejects(expectedError)

      t.rejects(
        preBuild.makePath(fakePath),
        expectedError,
        'should have rejected with expectedError'
      )
    })

    t.test('should not create the nested folder path if it exists and is accessible', async (t) => {
      await preBuild.makePath(fakePath)
      t.equal(mockFsPromiseApi.mkdir.callCount, 0, 'should not have called mkdir')
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
      gypStub.execGyp.returns(null)
      build('target', true)

      t.ok(gypStub.execGyp.callCount, 2, 'should call execGyp twice')
      t.same(gypStub.execGyp.args[0][0], ['clean', 'configure'])
      t.equal(gypStub.execGyp.args[1][0][3], 'target')
      t.end()
    })

    t.test('should run configure and build if rebuild is false', (t) => {
      gypStub.execGyp.returns(null)
      build('target', false)

      t.ok(gypStub.execGyp.callCount, 2, 'should call execGyp twice')
      t.same(gypStub.execGyp.args[0][0], ['configure'])
      t.end()
    })

    t.test('should return error if configure fails', (t) => {
      const expectedErr = new Error('failed to execute cmd')
      gypStub.execGyp.throws(expectedErr)
      t.throws(() => build('target', false), expectedErr)
      t.end()
    })

    t.test('should return error if build fails', (t) => {
      const expectedErr = new Error('failed to execute cmd')
      gypStub.execGyp.onCall(0).returns(null)
      gypStub.execGyp.onCall(1).throws(expectedErr)
      t.throws(() => build('target', false), expectedErr)
      t.end()
    })
  })

  t.test('moveBuild', (t) => {
    t.autoend()

    let mockFsPromiseApi
    let preBuild

    t.beforeEach(() => {
      mockFsPromiseApi = {
        rename: sinon.stub().resolves()
      }
      preBuild = proxyquire('../../lib/pre-build', {
        'fs/promises': mockFsPromiseApi
      })
    })

    t.test('should move build accordingly', async (t) => {
      await preBuild.moveBuild('target')
      t.equal(mockFsPromiseApi.rename.callCount, 1)
    })
  })

  t.test('download', (t) => {
    t.autoend()
    let sandbox
    let preBuild

    t.before(() => {
      nock.disableNetConnect()
    })

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()
      preBuild = proxyquire('../../lib/pre-build', {
        'fs/promises': {}
      })
    })

    t.afterEach(() => {
      sandbox.restore()
      delete process.env.NR_NATIVE_METRICS_PROXY_HOST
      delete process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST
    })

    t.test('should download and unzip file accordingly', async (t) => {
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('https://download.newrelic.com/').get(/.*/).reply(200, file)

      const data = await preBuild.download('test')
      t.same(data, expectedData)
    })

    t.test('should return error if 404 occurs', async (t) => {
      nock('https://download.newrelic.com/').get(/.*/).reply(404)

      t.rejects(
        preBuild.download('test'),
        new Error('No pre-built artifacts for your OS/architecture.'),
        'should reject with expected error'
      )
    })

    t.test('should return failed to download error if response is not 200 nor 404', async (t) => {
      nock('https://download.newrelic.com/').get(/.*/).reply(500)

      t.rejects(
        preBuild.download('test'),
        new Error('Failed to download'),
        'should reject with expected error'
      )
    })

    t.test('should fail if it cannot unzip', async (t) => {
      const expectedData = Buffer.from('testing', 'utf-8')
      nock('https://download.newrelic.com/').get(/.*/).reply(200, expectedData)

      t.rejects(
        preBuild.download('test'),
        new Error('Failed to unzip'),
        'should reject with expected error'
      )
    })

    t.test('should use https proxy host', async (t) => {
      process.env.NR_NATIVE_METRICS_PROXY_HOST = 'https://proxy-stuff.com'
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('https://download.newrelic.com/').get(/.*/).reply(200, file)

      const data = await preBuild.download('test')
      t.same(data, expectedData)
    })

    t.test('should use http proxy host', async (t) => {
      process.env.NR_NATIVE_METRICS_PROXY_HOST = 'http://proxy-stuff.com'
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('http://download.newrelic.com/').get(/.*/).reply(200, file)

      const data = await preBuild.download('test')
      t.same(data, expectedData)
    })

    t.test('should use http download host', async (t) => {
      process.env.NR_NATIVE_METRICS_DOWNLOAD_HOST = 'http://fake-stuff.com/'
      // busting cache to re-load the env var so it uses a diff host
      delete require.cache[require.resolve('../../lib/pre-build')]
      const localPreBuild = require('../../lib/pre-build')
      const expectedData = Buffer.from('testing', 'utf-8')
      const file = zlib.gzipSync(expectedData)
      nock('http://fake-stuff.com/').get(/.*/).reply(200, file)

      const data = await localPreBuild.download('test')
      t.same(data, expectedData)
    })
  })

  t.test('saveDownload', (t) => {
    t.autoend()
    let sandbox
    let preBuild
    let mockFsPromiseApi

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()

      mockFsPromiseApi = {
        writeFile: sinon.stub().resolves()
      }

      preBuild = proxyquire('../../lib/pre-build', {
        'fs/promises': mockFsPromiseApi
      })

      sandbox.stub(preBuild, 'makePath')
    })

    t.afterEach(() => {
      sandbox.restore()
    })

    t.test('should write download to appropriate path', async (t) => {
      preBuild.makePath.resolves()
      await preBuild.saveDownload('target', 'data')
      t.equal(mockFsPromiseApi.writeFile.callCount, 1, 'should save download')
    })

    t.test('should return error if creating directory fails', async (t) => {
      const expectedErr = new Error('failed to write')
      preBuild.makePath.rejects(expectedErr)

      t.rejects(
        preBuild.saveDownload('target', 'data'),
        expectedErr,
        'should reject with expected error'
      )
    })
  })

  t.test('install', (t) => {
    t.autoend()
    let sandbox
    let mockFsPromiseApi
    let preBuild

    t.beforeEach(() => {
      sandbox = sinon.createSandbox()

      mockFsPromiseApi = {
        rename: sinon.stub().resolves()
      }
      preBuild = proxyquire('../../lib/pre-build', {
        'fs/promises': mockFsPromiseApi
      })
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

    t.test('should download without building when no-build is specified', async (t) => {
      const data = 'foo'
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      preBuild.download.resolves(data)
      preBuild.saveDownload.resolves()
      await preBuild.install('target')
      t.equal(preBuild.build.callCount, 0, 'should not build')
      t.equal(preBuild.download.callCount, 1, 'should download only')
      t.equal(preBuild.saveDownload.callCount, 1, 'should download only')
      t.equal(preBuild.saveDownload.args[0][0], 'target')
      t.equal(preBuild.saveDownload.args[0][1], data)
    })

    t.test('should build without downloading when no-download is specified', async (t) => {
      process.env.NR_NATIVE_METRICS_NO_DOWNLOAD = true
      preBuild.build.resolves(null)
      preBuild.moveBuild.resolves(null)
      await preBuild.install('target')
      t.equal(preBuild.build.callCount, 1, 'should build')
      t.equal(preBuild.moveBuild.callCount, 1, 'should move build')
      t.equal(preBuild.download.callCount, 0, 'should not download')
    })

    t.test('should only download if both env vars are set', async (t) => {
      process.env.NR_NATIVE_METRICS_NO_DOWNLOAD = true
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      const data = 'foo'
      preBuild.download.resolves(data)
      preBuild.saveDownload.resolves()
      preBuild.build.resolves(null)
      preBuild.moveBuild.resolves(null)

      await preBuild.install('target')

      t.equal(preBuild.build.callCount, 0, 'should not build')
      t.equal(preBuild.moveBuild.callCount, 0, 'should not move build')
      t.equal(preBuild.download.callCount, 1, 'should download')
      t.equal(preBuild.saveDownload.callCount, 1, 'should save download')
    })

    t.test('should try download then build by default', async (t) => {
      const data = 'foo'
      preBuild.download.resolves(data)
      preBuild.saveDownload.rejects(new Error('whoops'))
      preBuild.build.resolves(null)
      preBuild.moveBuild.resolves(null)

      await preBuild.install('target')

      t.equal(preBuild.build.callCount, 1, 'should build')
      t.equal(preBuild.moveBuild.callCount, 1, 'should move build')
      t.equal(preBuild.download.callCount, 1, 'should download')
      t.equal(preBuild.saveDownload.callCount, 1, 'should save download')
    })

    t.test('should throw when download fails and noBuild is set', async (t) => {
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      const data = 'foo'
      preBuild.download.resolves(data)
      preBuild.saveDownload.rejects(new Error('whoops'))
      preBuild.build.resolves(null)
      preBuild.moveBuild.resolves(null)

      t.rejects(preBuild.install('target'), new Error('Building is disabled by configuration'))
    })

    t.test('should fail if save download fails and building is disabled', async (t) => {
      process.env.NR_NATIVE_METRICS_NO_BUILD = true
      const data = 'foo'
      preBuild.download.resolves(data)
      preBuild.saveDownload.throws(new Error('saving download failed'))

      t.rejects(preBuild.install('target'), new Error('Building is disabled by configuration'))

      t.equal(preBuild.build.callCount, 0, 'should not build')
      t.equal(preBuild.download.callCount, 1, 'should download only')
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
      t.test(`should build and move when cmd is '${cmd}'`, async (t) => {
        localPreBuild.build.resolves()
        localPreBuild.moveBuild.resolves()
        await localPreBuild.executeCli(cmd, 'target')
        t.equal(localPreBuild.build.callCount, 1, 'should build')
        t.equal(localPreBuild.moveBuild.callCount, 1, 'should move build')
        t.equal(commonStub.logFinish.callCount, 1, 'should log finish')
      })
    })

    t.test('should call install if cmd is install', async (t) => {
      await localPreBuild.executeCli('install', 'target')
      t.equal(localPreBuild.install.callCount, 1, 'should call install')
    })

    t.test('should log finish if install fails', async (t) => {
      const err = new Error('install failed')
      localPreBuild.install.rejects(err)
      await localPreBuild.executeCli('install', 'target')
      t.equal(localPreBuild.install.callCount, 1, 'should call install')
      t.equal(commonStub.logFinish.callCount, 1, 'should log finish')
    })

    t.test('should log finish and not move build if build fails', async (t) => {
      const err = new Error('build failed')
      localPreBuild.build.throws(err)
      localPreBuild.executeCli('build', 'target')
      t.equal(localPreBuild.build.callCount, 1, 'should build')
      t.equal(localPreBuild.moveBuild.callCount, 0, 'should not move build')
      t.equal(commonStub.logFinish.callCount, 1, 'should log finish')
    })
  })
})
