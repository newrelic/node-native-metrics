
#include <nan.h>

namespace nr {

class GCBinder : public Nan::ObjectWrap {
public:
  static NAN_MODULE_INIT(Init) {
    v8::Local<v8::FunctionTemplate> clas = Nan::New<v8::FunctionTemplate>(New);
    clas->SetClassName(Nan::New("GCBinder").ToLocalChecked());
    clas->InstanceTemplate()->SetInternalFieldCount(1);

    SetPrototypeMethod(clas, "bind", Bind);
    SetPrototypeMethod(clas, "unbind", Unbind);

    constructor().Reset(Nan::GetFunction(clas).ToLocalChecked());
    Nan::Set(
      target,
      Nan::New("GCBinder").ToLocalChecked(),
      Nan::GetFunction(clas).ToLocalChecked()
    );
  }

  static NAN_METHOD(New) {
    if (info.Length() != 1 || !info[0]->IsFunction()) {
      return Nan::ThrowError("GC callback function is required.");
    }

    v8::Local<v8::Function> onGCCallback = info[0].As<v8::Function>();
    GCBinder* obj = new GCBinder(onGCCallback);
    obj->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  }

  /**
   * Binds into the GC event hooks.
   */
  static NAN_METHOD(Bind) {
    _bind();
  }

  /**
   * Removes hooks into the GC events.
   */
  static NAN_METHOD(Unbind) {
    _unbind();
  }

  GCBinder(const v8::Local<v8::Function>& onGCCallback):
    _gcStartTimeHR(uv_hrtime()),
    _onGCCallback(onGCCallback)
  {
    _instance = this;
  }

  ~GCBinder() {
    _unbind();
    _instance = NULL;
  }

private:
  static GCBinder* _instance;

  static NAN_GC_CALLBACK(_gcPrologue) {
    if (GCBinder::_instance) {
      GCBinder::_instance->_gcStart();
    }
  }

  static NAN_GC_CALLBACK(_gcEpilogue) {
    if (GCBinder::_instance) {
      GCBinder::_instance->_gcEnd();
    }
  }

  static void _bind() {
    Nan::AddGCPrologueCallback(_gcPrologue);
    Nan::AddGCEpilogueCallback(_gcEpilogue);
  }

  static void _unbind() {
    Nan::RemoveGCPrologueCallback(_gcPrologue);
    Nan::RemoveGCEpilogueCallback(_gcEpilogue);
  }

  static inline Nan::Persistent<v8::Function> & constructor() {
    // ???
    static Nan::Persistent<v8::Function> _constructor;
    return _constructor;
  }

  void _gcStart() {
    _gcStartTimeHR = uv_hrtime();
  }

  void _gcEnd() {
    // Grab our time immediately.
    uint64_t gcEndTimeHR = uv_hrtime();

    // Send out the gc statistics to our callback.
    Nan::HandleScope scope;
    double duration = (double)(gcEndTimeHR - _gcStartTimeHR);
    v8::Local<v8::Value> args[] = {Nan::New<v8::Number>(duration)};
    _onGCCallback.Call(1, args);
  }

  uint64_t _gcStartTimeHR;
  Nan::Callback _onGCCallback;
};

}
