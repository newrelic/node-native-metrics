
#include <cstring>
#include <nan.h>
#include <uv.h>

#include "RUsageMeter.hpp"

namespace nr {

NAN_METHOD(RUsageMeter::Read) {
  Nan::HandleScope scope;

  // Update our stats.
  RUsageMeter* self = RUsageMeter::Unwrap<RUsageMeter>(info.This());
  self->_read();

  // Build the results object.
  v8::Local<v8::Object> results = Nan::New<v8::Object>();
  Nan::Set(
    results,
    Nan::New("diff").ToLocalChecked(),
    self->_usageToJSObj(self->_usageDiff)
  );
  Nan::Set(
    results,
    Nan::New("current").ToLocalChecked(),
    self->_usageToJSObj(self->_lastUsage)
  );

  // Return the results.
  info.GetReturnValue().Set(results);
}

void RUsageMeter::_read() {
  uv_rusage_t nextUsage;
  uv_getrusage(&nextUsage);

  _usageDiff.ru_utime.tv_sec  = nextUsage.ru_utime.tv_sec   - _lastUsage.ru_utime.tv_sec;
  _usageDiff.ru_utime.tv_usec = nextUsage.ru_utime.tv_usec  - _lastUsage.ru_utime.tv_usec;
  _usageDiff.ru_stime.tv_sec  = nextUsage.ru_stime.tv_sec   - _lastUsage.ru_stime.tv_sec;
  _usageDiff.ru_stime.tv_usec = nextUsage.ru_stime.tv_usec  - _lastUsage.ru_stime.tv_usec;
  _usageDiff.ru_maxrss    = nextUsage.ru_maxrss   - _lastUsage.ru_maxrss;
  _usageDiff.ru_ixrss     = nextUsage.ru_ixrss    - _lastUsage.ru_ixrss;
  _usageDiff.ru_idrss     = nextUsage.ru_idrss    - _lastUsage.ru_idrss;
  _usageDiff.ru_isrss     = nextUsage.ru_isrss    - _lastUsage.ru_isrss;
  _usageDiff.ru_minflt    = nextUsage.ru_minflt   - _lastUsage.ru_minflt;
  _usageDiff.ru_majflt    = nextUsage.ru_majflt   - _lastUsage.ru_majflt;
  _usageDiff.ru_nswap     = nextUsage.ru_nswap    - _lastUsage.ru_nswap;
  _usageDiff.ru_inblock   = nextUsage.ru_inblock  - _lastUsage.ru_inblock;
  _usageDiff.ru_oublock   = nextUsage.ru_oublock  - _lastUsage.ru_oublock;
  _usageDiff.ru_msgsnd    = nextUsage.ru_msgsnd   - _lastUsage.ru_msgsnd;
  _usageDiff.ru_msgrcv    = nextUsage.ru_msgrcv   - _lastUsage.ru_msgrcv;
  _usageDiff.ru_nsignals  = nextUsage.ru_nsignals - _lastUsage.ru_nsignals;
  _usageDiff.ru_nvcsw     = nextUsage.ru_nvcsw    - _lastUsage.ru_nvcsw;
  _usageDiff.ru_nivcsw    = nextUsage.ru_nivcsw   - _lastUsage.ru_nivcsw;

  std::memcpy(&_lastUsage, &nextUsage, sizeof(uv_rusage_t));
}

v8::Local<v8::Object> RUsageMeter::_usageToJSObj(const uv_rusage_t& usage) {
  // Convert the CPU times into millisecond floating point values.
  double utime = (
    (double)(usage.ru_utime.tv_sec * 1000.0) +
    (double)(usage.ru_utime.tv_usec / 1000.0)
  );
  double stime = (
    (double)(usage.ru_stime.tv_sec * 1000.0) +
    (double)(usage.ru_stime.tv_usec / 1000.0)
  );

  // Copy all the values to V8 objects.
  v8::Local<v8::Object> jsUsage = Nan::New<v8::Object>();
  #define SET(key, val) \
    Nan::Set(jsUsage, Nan::New(key).ToLocalChecked(), Nan::New<v8::Number>((double)val));
  SET("ru_utime",     utime);
  SET("ru_stime",     stime);
  SET("ru_maxrss",    usage.ru_maxrss);
  SET("ru_ixrss",     usage.ru_ixrss);
  SET("ru_idrss",     usage.ru_idrss);
  SET("ru_isrss",     usage.ru_isrss);
  SET("ru_minflt",    usage.ru_minflt);
  SET("ru_majflt",    usage.ru_majflt);
  SET("ru_nswap",     usage.ru_nswap);
  SET("ru_inblock",   usage.ru_inblock);
  SET("ru_oublock",   usage.ru_oublock);
  SET("ru_msgsnd",    usage.ru_msgsnd);
  SET("ru_msgrcv",    usage.ru_msgrcv);
  SET("ru_nsignals",  usage.ru_nsignals);
  SET("ru_nvcsw",     usage.ru_nvcsw);
  SET("ru_nivcsw",    usage.ru_nivcsw);
  #undef SET

  return jsUsage;
}

}
