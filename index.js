'use strict'

var EventEmitter = require('events').EventEmitter
var npg = require('node-pre-gyp')
var path = require('path')
var util = require('util')

var binding_path = npg.find(path.resolve(__dirname, './package.json'))
var natives = require(binding_path)

var DEFAULT_TIMEOUT = 15 * 1000 // 15 seconds
var GC_TYPE_NAMES = {
  '1': 'Scavenge',
  '2': 'MarkSweepCompact',
  '4': 'IncrementalMarking',
  '8': 'ProcessWeakCallbacks',

  '3': 'All', // Node v4 and earlier only have Scavenge and MarkSweepCompact.
  '15': 'All'
}


function NativeMetricEmitter(opts) {
  opts = opts || {timeout: DEFAULT_TIMEOUT}
  EventEmitter.call(this)
  var self = this
  this.bound = false
  this._timeout = null

  this._rusageMeter = natives.RUsageMeter ? new natives.RUsageMeter() : null
  this.usageEnabled = !!this._rusageMeter

  this._gcBinder = new natives.GCBinder(function onGCCallback(type, duration) {
    self.emit('gc', {
      typeId: type,
      type: GC_TYPE_NAMES[String(type)],
      duration: duration
    })
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
