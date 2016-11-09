
#include <nan.h>

#include "GCBinder.hpp"
#include "RUsageMeter.hpp"

namespace nr {

NAN_MODULE_INIT(Init) {
  Nan::HandleScope scope;
  GCBinder::Init(target);

  #ifndef NR_DISABLE_RUSAGE
    RUsageMeter::Init(target);
  #endif
}

NODE_MODULE(native_metrics, Init)

}
