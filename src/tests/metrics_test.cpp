/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


#include "gtest/gtest.h"

#include "../Metric.hpp"

namespace nr {
namespace tests {

TEST(MetricTests, DefaultConstruction) {
  Metric<int> m;

  EXPECT_EQ(0, m.total());
  EXPECT_EQ(0, m.min());
  EXPECT_EQ(0, m.max()); // expect less
}

TEST(MetricTests, PositiveAddition) {
  Metric<int> m;

  m += 5;
  EXPECT_EQ(5, m.total());
  EXPECT_EQ(5, m.min());
  EXPECT_EQ(5, m.max());
  EXPECT_EQ(25, m.sumOfSquares());
  EXPECT_EQ(1, m.count());

  m += 10;
  EXPECT_EQ(15, m.total());
  EXPECT_EQ(5, m.min());
  EXPECT_EQ(10, m.max());
  EXPECT_EQ(125, m.sumOfSquares());
  EXPECT_EQ(2, m.count());

  m += 2;
  EXPECT_EQ(17, m.total());
  EXPECT_EQ(2, m.min());
  EXPECT_EQ(10, m.max());
  EXPECT_EQ(129, m.sumOfSquares());
  EXPECT_EQ(3, m.count());
}

TEST(MetricTests, NegativeAddition) {
  Metric<int> m;

  m += -5;
  EXPECT_EQ(-5, m.total());
  EXPECT_EQ(-5, m.min());
  EXPECT_EQ(-5, m.max());
  EXPECT_EQ(25, m.sumOfSquares());
  EXPECT_EQ(1, m.count());

  m += -10;
  EXPECT_EQ(-15, m.total());
  EXPECT_EQ(-10, m.min());
  EXPECT_EQ(-5, m.max());
  EXPECT_EQ(125, m.sumOfSquares());
  EXPECT_EQ(2, m.count());

  m += -2;
  EXPECT_EQ(-17, m.total());
  EXPECT_EQ(-10, m.min());
  EXPECT_EQ(-2, m.max());
  EXPECT_EQ(129, m.sumOfSquares());
  EXPECT_EQ(3, m.count());
}

TEST(MetricTests, Reset) {
  Metric<int> m;

  m += 5;
  m.reset();
  EXPECT_EQ(0, m.total());
  EXPECT_EQ(0, m.min());
  EXPECT_EQ(0, m.max());
  EXPECT_EQ(0, m.sumOfSquares());
  EXPECT_EQ(0, m.count());
}

TEST(MetricTests, JSObject) {
  Nan::HandleScope scope;
  Metric<int> m;

  m += 5;
  m += 10;

  v8::Local<v8::Object> j = m.asJSObject();
  #define GET(key)                                                  \
    Nan::To<double>(                                                \
      Nan::Get(j, Nan::New(key).ToLocalChecked()).ToLocalChecked()  \
    ).FromMaybe(0.0)

  EXPECT_EQ(15.0, GET("total"));
  EXPECT_EQ(5.0, GET("min"));
  EXPECT_EQ(10.0, GET("max"));
  EXPECT_EQ(125.0, GET("sumOfSquares"));
  EXPECT_EQ(2.0, GET("count"));
}

}
}
