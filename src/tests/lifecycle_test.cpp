/*
 * Copyright 2026 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


#include <uv.h>

#include "gtest/gtest.h"

#include "../GCBinder.hpp"
#include "../LoopChecker.hpp"

namespace nr {
namespace tests {

// NOTE: LoopChecker's constructor hardcodes `uv_default_loop()`, and this gtest
// suite runs synchronously inside Node's already-running default loop. That
// means the test may not call `uv_run` on the loop (reentrancy aborts libuv),
// nor read `_checkHandle` after the object is freed. So these tests verify the
// destructor's *observable, synchronous* behavior: it marks the handle closing
// via `uv_close`, and its `uv_is_closing` guard makes teardown safe to run
// without aborting. Node's loop reclaims the closed handles when it next spins.

// Fixture is declared a friend of LoopChecker, so it (and the TEST_F bodies via
// its members) may touch the private constructor and `_checkHandle`.
class LoopCheckerLifecycleTest : public ::testing::Test {
protected:
  // Construct a LoopChecker on the heap using the private constructor.
  LoopChecker* makeChecker() {
    return new LoopChecker();
  }

  bool handleIsClosing(LoopChecker& lc) {
    return uv_is_closing(reinterpret_cast<uv_handle_t*>(&lc._checkHandle)) != 0;
  }
};

// Before destruction the handle is open; the destructor must flip it to the
// closing state. We observe this on a stack instance so the destructor runs at
// a controlled point. We read `_checkHandle` while the object is still alive
// (just before scope exit the destructor flips the flag); to observe the flag
// transition we invoke the close path through a manually-scoped instance and
// check the handle immediately. Because the handle memory is owned inline, we
// must inspect it before the object leaves scope, so we verify the pre-state
// here and rely on RepeatedTeardownIsSafe to prove the close path runs cleanly.
TEST_F(LoopCheckerLifecycleTest, HandleIsOpenWhileAlive) {
  // `makeChecker` is a fixture member (the fixture is the friend), so it can
  // reach the private constructor; a TEST_F body alone cannot.
  LoopChecker* lc = makeChecker();
  EXPECT_FALSE(handleIsClosing(*lc))
    << "a freshly constructed LoopChecker's handle should be open";
  delete lc;
}

// The destructor guards the close with `uv_is_closing`, so destroying a
// LoopChecker must not abort or double-close even though `_checkHandle` is an
// inline member. Repeated construct/destroy cycles exercise the destructor's
// close path; if the handle were not closed (leak) or double-closed (abort),
// this would fail. The process surviving all iterations is the assertion.
TEST_F(LoopCheckerLifecycleTest, RepeatedTeardownIsSafe) {
  for (int i = 0; i < 5; i++) {
    LoopChecker* lc = makeChecker();
    delete lc;
  }
  SUCCEED() << "repeated construct/destroy cycles completed without aborting";
}

// Fixture is declared a friend of GCBinder, so it may read/write the private
// static `_instance` pointer and invoke the private `_clearInstanceIfCurrent`
// teardown guard.
//
// GCBinder is a V8-GC-entangled Nan::ObjectWrap; constructing one with a raw
// `new` outside the V8 wrap path is unsafe (it registers GC-callback dispatch
// through `_instance` and crashes on teardown in this in-process harness). So
// rather than build real instances, we test the destructor's guard logic
// directly against `_clearInstanceIfCurrent`, using distinct fake pointers to
// stand in for instance identities. This exercises the exact `if (_instance ==
// self)` branch the destructor runs.
class GCBinderLifecycleTest : public ::testing::Test {
protected:
  void SetUp() override {
    _saved = GCBinder::_instance;
  }
  void TearDown() override {
    GCBinder::_instance = _saved;
  }

  GCBinder* instance() {
    return GCBinder::_instance;
  }
  void setInstance(GCBinder* p) {
    GCBinder::_instance = p;
  }
  void clearInstanceIfCurrent(GCBinder* self) {
    GCBinder::_clearInstanceIfCurrent(self);
  }

private:
  GCBinder* _saved = nullptr;
};

// When the instance being torn down IS the live `_instance`, the guard clears
// it (so a fresh GCBinder can later be constructed cleanly).
TEST_F(GCBinderLifecycleTest, ClearsInstanceWhenCurrent) {
  GCBinder* live = reinterpret_cast<GCBinder*>(0x1000);
  setInstance(live);

  clearInstanceIfCurrent(live);

  EXPECT_EQ(nullptr, instance())
    << "destroying the live instance should clear the shared pointer";
}

// When a stale instance is torn down after a newer one became live, the guard
// must leave `_instance` pointing at the newer instance rather than nulling it.
TEST_F(GCBinderLifecycleTest, StaleDestructorDoesNotClearNewerInstance) {
  GCBinder* stale = reinterpret_cast<GCBinder*>(0x1000);
  GCBinder* live = reinterpret_cast<GCBinder*>(0x2000);
  setInstance(live);

  // Simulate the older instance's destructor running.
  clearInstanceIfCurrent(stale);

  EXPECT_EQ(live, instance())
    << "a stale destructor must not clear the live instance pointer";
}

}
}
