'use strict'

var tap = require('tap')
var http = require('http')
var natives = require('../../')()
var segs = require('segfault-handler')

var RUN_TIME = 5 * 60 * 1000 // 5 minutes

segs.registerHandler('crash.log')

tap.test('server soak test', {timeout: RUN_TIME + 10000}, function(t) {
  t.comment('Running test server for ' + RUN_TIME + 'ms')
  var server = http.createServer(function(req, res) {
    res.write('ok')
    res.end()
  })

  server.on('close', function() {
    t.pass('server closed')
    natives.unbind()
  })
  server.listen(0, function() {
    t.pass('server started')
  })
  var port = server.address().port

  var keepSending = true
  setTimeout(sendRequest, 1000)
  setTimeout(function() {
    t.comment('stopping')
    keepSending = false
  }, RUN_TIME)

  setInterval(function() {
    if (!natives.getGCMetrics()) {
      t.fail('should have readable gc metrics')
    }
    if (!natives.getLoopMetrics()) {
      t.fail('should have readable loop metrics')
    }
  }, 5000).unref()

  function sendRequest() {
    http.get('http://localhost:' + port, function(res) {
      if (!res || res.statusCode !== 200) {
        t.ok(res, 'should have a response object')
        t.equal(res.statusCode, 200, 'should have a successful response')
      }

      if (keepSending) {
        setTimeout(sendRequest, 10)
      } else {
        server.close(function(err) {
          t.error(err, 'should not fail to close')
          t.end()
        })
      }
    })
  }
})
