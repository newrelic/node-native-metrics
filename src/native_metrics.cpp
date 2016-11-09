
#include <nan.h>

#include "GCBinder.hpp"
#include "RUsageMeter.hpp"

namespace nr {

NAN_MODULE_INIT(Init) {
  Nan::HandleScope scope;
  GCBinder::Init(target);
  RUsageMeter::Init(target);
}

NODE_MODULE(native_metrics, Init)

}
