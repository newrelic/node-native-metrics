
#include "gtest/gtest.h"

#include "../Metric.hpp"

namespace nr {
namespace tests {

TEST(MetricTests, DefaultConstruction) {
  Metric<int> m;

  EXPECT_EQ(0, m.total());
  EXPECT_EQ(0, m.min());
  EXPECT_EQ(0, m.max());
  EXPECT_EQ(0, m.sumOfSquares());
  EXPECT_EQ(0, m.count());
}

}
}
