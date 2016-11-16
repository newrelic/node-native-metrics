
#include "GCBinder.hpp"

namespace nr {

GCBinder* GCBinder::_instance = NULL; // TODO: nullptr once we drop Node <4.

NAN_METHOD(GCBinder::New) {
  if (info.Length() != 1 || !info[0]->IsFunction()) {
    return Nan::ThrowError("GC callback function is required.");
  }
  if (_instance != NULL) {
    return Nan::ThrowError("GCBinder instance already created.");
  }

  // Store the callback on the JS object so its lifetime is properly tied to
  // the lifetime of this object.
  v8::Local<v8::Function> onGCCallback = info[0].As<v8::Function>();
  Nan::Set(
    info.This(),
    Nan::New("_onGCCallback").ToLocalChecked(),
    onGCCallback
  );

  GCBinder* obj = new GCBinder();
  obj->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

void GCBinder::_gcEnd(const v8::GCType type) {
  // Grab our time immediately.
  uint64_t gcEndTimeHR = uv_hrtime();

  // Send out the gc statistics to our callback.
  Nan::HandleScope scope;
  double duration = (double)(gcEndTimeHR - _gcStartTimeHR);
  v8::Local<v8::Value> args[] = {
    Nan::New<v8::Number>((double)type),
    Nan::New<v8::Number>(duration)
  };
  Nan::MakeCallback(
    this->handle(),
    Nan::New("_onGCCallback").ToLocalChecked(),
    2, args
  );
}

}
