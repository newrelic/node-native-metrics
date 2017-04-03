
#include <nan.h>

#include "gtest/gtest.h"

namespace nr {
namespace tests {

NAN_METHOD(Test) {
  Nan::HandleScope scope;

  // Initialize gtest
  int argc = 1;
  char* argv[] = {"tests"};
  testing::InitGoogleTest(&argc, argv);

  // Return the status code.
  const int res = RUN_ALL_TESTS();
  v8::Local<v8::Number> result = Nan::New<v8::Number>((double)res);
  info.GetReturnValue().Set(result);
}

NAN_MODULE_INIT(Init) {
  Nan::HandleScope scope;
  v8::Local<v8::FunctionTemplate> test = Nan::New<v8::FunctionTemplate>(Test);
  Nan::Set(
    target,
    Nan::New("test").ToLocalChecked(),
    Nan::GetFunction(test).ToLocalChecked()
  );
}

NODE_MODULE(tests, Init)

}
}
