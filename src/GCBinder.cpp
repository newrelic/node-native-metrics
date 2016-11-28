
#include "GCBinder.hpp"

namespace nr {

struct GCResults {
  GCResults(uint64_t d, v8::GCType t): duration(d), type(t) {}

  uint64_t duration;
  v8::GCType type;
};

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

void GCBinder::_doCallback(uv_work_t* handle, int) {
  GCResults* res = (GCResults*)handle->data;

  if (_instance) {
    // Send out the gc statistics to our callback.
    Nan::HandleScope scope;
    v8::Local<v8::Value> args[] = {
      Nan::New<v8::Number>((double)res->type),
      Nan::New<v8::Number>((double)res->duration)
    };
    Nan::MakeCallback(
      _instance->handle(),
      Nan::New("_onGCCallback").ToLocalChecked(),
      2, args
    );
  }

  delete res;
  delete handle;
}

void _noopWork(uv_work_t*){}

void GCBinder::_gcEnd(const v8::GCType type) {
  // Grab our time immediately.
  uint64_t gcEndTimeHR = uv_hrtime();

  // Schedule the callback on the event loop.
  // XXX uv_async_t causes process to hang. No idea why. uv_timer_t causes
  // segmentation faults. No idea why. uv_work_t works, so going with that.
  uv_work_t* handle = new uv_work_t;
  handle->data = new GCResults(gcEndTimeHR - _gcStartTimeHR, type);
  uv_queue_work(uv_default_loop(), handle, &_noopWork, &_doCallback);
}

}
