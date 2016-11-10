
#include <nan.h>

#include "GCBinder.hpp"

namespace nr {

NAN_MODULE_INIT(Init) {
  Nan::HandleScope scope;
  GCBinder::Init(target);
}

NODE_MODULE(native_metrics, Init)

}
