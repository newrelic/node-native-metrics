'use strict'

var EventEmitter = require('events').EventEmitter
var GCBinder = require('./build/Release/native_metrics').GCBinder
var util = require('util')

function GCMetricEmitter() {
  EventEmitter.call(this)
  var self = this
  this._gcBinder = new GCBinder(function onGCCallback(duration) {
    self.emit('gc', {duration: duration})
  })
  this.bind()
}
util.inherits(GCMetricEmitter, EventEmitter)

GCMetricEmitter.prototype.bind = function bind() {
  this._gcBinder.bind()
}

GCMetricEmitter.prototype.unbind = function unbind() {
  this._gcBinder.unbind()
}

var emitter = null

module.exports = function getGCMetricEmitter() {
  if (!emitter) {
    emitter = new GCMetricEmitter()
  }
  return emitter
}
