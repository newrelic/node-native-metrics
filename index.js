'use strict'

var EventEmitter = require('events').EventEmitter
var natives = require('./build/Release/native_metrics')
var util = require('util')


var DEFAULT_TIMEOUT = 15 * 1000 // 15 seconds


function NativeMetricEmitter(opts) {
  opts = opts || {timeout: DEFAULT_TIMEOUT}
  EventEmitter.call(this)
  var self = this
  this.bound = false
  this._timeout = null

  this._rusageMeter = natives.RUsageMeter ? new natives.RUsageMeter() : null
  this.usageEnabled = !!this._rusageMeter

  this._gcBinder = new natives.GCBinder(function onGCCallback(duration) {
    self.emit('gc', {duration: duration})
  })
  this.gcEnabled = true

  this.bind(opts.timeout)
}
util.inherits(NativeMetricEmitter, EventEmitter)

NativeMetricEmitter.prototype.bind = function bind(timeout) {
  timeout = timeout || DEFAULT_TIMEOUT
  this._gcBinder.bind()

  this._timeout = setTimeout(nativeMetricTimeout.bind(this), timeout)
  function nativeMetricTimeout() {
    if (this._rusageMeter) {
      this.emit('usage', this._rusageMeter.read())
    }
    if (this.bound) {
      this._timeout = setTimeout(nativeMetricTimeout.bind(this), timeout)
    }
  }

  this.bound = true
}

NativeMetricEmitter.prototype.unbind = function unbind() {
  this._gcBinder.unbind()
  clearTimeout(this._timeout)
  this.bound = false
}

var emitter = null

module.exports = function getGCMetricEmitter(opts) {
  if (!emitter) {
    emitter = new NativeMetricEmitter(opts)
  }
  return emitter
}
