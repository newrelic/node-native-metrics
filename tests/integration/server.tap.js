'use strict'

var http = require('http')
var natives = require('../../')()
var segs = require('segfault-handler')
var tap = require('tap')

var RUN_TIME = 5 * 60 * 1000 // 5 minutes

segs.registerHandler('crash.log')

tap.test('long running server', {timeout: RUN_TIME + 5000}, function(t) {
  t.tearDown(function() {
    server.close()
    natives.unbind()
  })

  natives.on('gc', function(data) {
    if (!t.ok(data.type, 'should have type name for ' + data.typeId)) {
      t.bail()
    }
  })

  t.comment('Running test server for ' + RUN_TIME + 'ms')
  var server = http.createServer(function(req, res) {
    t.pass('should receive requests')
    req.resume() // Consume the request (Node v0.10)
    res.statusCode = 200
    res.end('ok')
  })

  server.listen(0, sendRequest)
  var port = server.address().port

  var keepSending = true
  setTimeout(function() {
    t.comment('Stopping server.')
    keepSending = false
  }, RUN_TIME)

  function sendRequest() {
    http.get('http://localhost:' + port, function(res) {
      res.resume() // Consume the response (Node v0.10)

      t.equal(res.statusCode, 200, 'should have successfull response')

      if (keepSending) {
        setTimeout(sendRequest, 10)
      } else {
        t.end()
      }
    })
  }
})
