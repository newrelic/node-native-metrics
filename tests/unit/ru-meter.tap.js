'use strict'

var tap = require('tap')
var semver = require('semver')


var RU_AVAILABLE = semver.gte(process.version, '0.12.0')


tap.test('Resource Usage Meter', {skip: !RU_AVAILABLE}, function(t) {
  var CPU_EPSILON = 50 // Allowed fudge factor for CPU times in MS
  var SPIN_TIME = 2000
  var metricEmitter = require('../../')({timeout: 200})

  t.tearDown(function() {
    metricEmitter.unbind()
  })

  var firstUsage = null
  metricEmitter.on('usage', function(data) {
    t.comment('usage emitted')
    if (!t.type(data, Object, 'should have usage data object')) {
      return t.end()
    }
    t.type(data.diff, Object, 'should have usage diff data object')
    t.type(data.current, Object, 'should have usage current data object')
    if (!t.passing()) {
      return t.end()
    }

    if (!firstUsage) {
      firstUsage = data
      process.nextTick(spin)
    } else {
      checkValues(firstUsage, data)
    }
  })

  function spin() {
    var start = Date.now()
    while (Date.now() - start < SPIN_TIME) {} // Spin the CPU for 2 seconds.
    t.comment('cpu spin completed')
  }

  function checkValues(startUsage, usage) {
    var keys = [
      'ru_utime',
      'ru_stime',
      'ru_maxrss',
      'ru_ixrss',
      'ru_idrss',
      'ru_isrss',
      'ru_minflt',
      'ru_majflt',
      'ru_nswap',
      'ru_inblock',
      'ru_oublock',
      'ru_msgsnd',
      'ru_msgrcv',
      'ru_nsignals',
      'ru_nvcsw',
      'ru_nivcsw'
    ]
    keys.forEach(function(key) {
      t.comment(key)
      t.type(usage.diff[key], 'number', 'usage.diff should have key')
      t.type(usage.current[key], 'number', 'usage.current should have key')

      t.equal(
        cleanFloat(usage.diff[key]),
        cleanFloat(usage.current[key] - startUsage.current[key]),
        'usage.diff should be difference between last reading and this reading'
      )
    })

    // On Travis, CPU usage measurements are... weird. Disabling this assertion
    // for Travis builds for now.
    if (!process.env.TRAVIS) {
      t.comment('cpu usage')
      t.ok(
        usage.diff.ru_utime > SPIN_TIME - CPU_EPSILON,
        'should have expected CPU usage time (is ' + usage.diff.ru_utime + ')'
      )
    }
    t.end()
  }
})

function cleanFloat(num) {
  return Math.round(num * 1000) / 1000
}
