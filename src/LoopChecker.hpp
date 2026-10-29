/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

#pragma once

#include <nan.h>

#include "Metric.hpp"

namespace nr {

// Forward declaration so the lifecycle unit test fixture (defined in
// nr::tests) can be named as a friend below.
namespace tests { class LoopCheckerLifecycleTest; }

class LoopChecker : public Nan::ObjectWrap {
public:
  static NAN_MODULE_INIT(Init) {
    v8::Local<v8::FunctionTemplate> clas = Nan::New<v8::FunctionTemplate>(New);
    clas->SetClassName(Nan::New("LoopChecker").ToLocalChecked());
    clas->InstanceTemplate()->SetInternalFieldCount(1);

    SetPrototypeMethod(clas, "bind", Bind);
    SetPrototypeMethod(clas, "unbind", Unbind);
    SetPrototypeMethod(clas, "read", Read);

    constructor().Reset(Nan::GetFunction(clas).ToLocalChecked());
    Nan::Set(
      target,
      Nan::New("LoopChecker").ToLocalChecked(),
      Nan::GetFunction(clas).ToLocalChecked()
    );
  }

  static NAN_METHOD(New) {
    LoopChecker* obj = new LoopChecker();
    obj->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  }

  static NAN_METHOD(Bind) {
    LoopChecker* self = LoopChecker::Unwrap<LoopChecker>(info.This());
    uv_check_start(&self->_checkHandle, &LoopChecker::_checkCB);
  }

  static NAN_METHOD(Unbind) {
    LoopChecker* self = LoopChecker::Unwrap<LoopChecker>(info.This());
    uv_check_stop(&self->_checkHandle);
  }

  static NAN_METHOD(Read);

  ~LoopChecker();

private:
  // Grants the lifecycle unit tests access to the private constructor and the
  // `_checkHandle` so they can verify the destructor closes it.
  friend class tests::LoopCheckerLifecycleTest;

  LoopChecker();

  static inline Nan::Persistent<v8::Function> & constructor() {
    static Nan::Persistent<v8::Function> _constructor;
    return _constructor;
  }

  static void _checkCB(uv_check_t* handle);

  // libuv requires handles to be closed via `uv_close` before their memory is
  // released. `_checkHandle` is an inline member, so the close callback must
  // not touch the handle (the owning LoopChecker may already be gone); it is a
  // no-op whose only purpose is to let libuv finish releasing the handle from
  // the loop.
  static void _closeCB(uv_handle_t* handle);

  uv_check_t _checkHandle;
  uint64_t _checkUsage;
  Metric<uint64_t> _tickUsageMetric;
};

}
