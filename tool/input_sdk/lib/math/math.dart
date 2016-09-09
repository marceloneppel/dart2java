// Copyright 2016, the Dart project authors.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Mathematical constants and functions, plus a random number generator.
 * 
 * To use this library in your code:
 * 
 *     import 'dart:math';
 */
library dart.math;

// part "jenkins_smi_hash.dart";
// part "point.dart";
part "random.dart";
// part "rectangle.dart";

/**
 * Base of the natural logarithms.
 *
 * Typically written as "e".
 */
const double E = 2.718281828459045;

/**
 * Natural logarithm of 10.
 */
const double LN10 =  2.302585092994046;

/**
 * Natural logarithm of 2.
 */
const double LN2 =  0.6931471805599453;

/**
 * Base-2 logarithm of [E].
 */
const double LOG2E = 1.4426950408889634;

/**
 * Base-10 logarithm of [E].
 */
const double LOG10E = 0.4342944819032518;

/**
 * The PI constant.
 */
const double PI = 3.1415926535897932;

/**
 * Square root of 1/2.
 */
const double SQRT1_2 = 0.7071067811865476;

/**
 * Square root of 2.
 */
const double SQRT2 = 1.4142135623730951;

// TODO(springerm): min, max
external double min(num a, num b);
external double max(num a, num b);

/**
 * A variant of [atan].
 *
 * Converts both arguments to doubles.
 *
 * Returns the angle between the positive x-axis and the vector ([b],[a]).
 * The result, in radians, is in the range -PI..PI.
 *
 * If [b] is positive, this is the same as `atan(b/a)`.
 *
 * The result is negative when [a] is negative (including when [a] is the
 * double -0.0).
 *
 * If [a] is equal to zero, the vector ([b],[a]) is considered parallel to
 * the x-axis, even if [b] is also equal to zero. The sign of [b] determines
 * the direction of the vector along the x-axis.
 *
 * Returns NaN if either argument is NaN.
 */
external double atan2(num a, num b);

/**
 * Returns [x] to the power of [exponent].
 *
 * If [x] is an [int] and [exponent] is a non-negative [int], the result is
 * an [int], otherwise both arguments are converted to doubles first, and the
 * result is a [double].
 *
 * For integers, the power is always equal to the mathematical result of `x` to
 * the power `exponent`, only limited by the available memory.
 *
 * For doubles, `pow(x, y)` handles edge cases as follows:
 *
 * - if `y` is zero (0.0 or -0.0), the result is always 1.0.
 * - if `x` is 1.0, the result is always 1.0.
 * - otherwise, if either `x` or `y` is NaN then the result is NaN.
 * - if `x` is negative (but not -0.0) and `y` is a finite non-integer, the
 *   result is NaN.
 * - if `x` is Infinity and `y` is negative, the result is 0.0.
 * - if `x` is Infinity and `y` is positive, the result is Infinity.
 * - if `x` is 0.0 and `y` is negative, the result is Infinity.
 * - if `x` is 0.0 and `y` is positive, the result is 0.0.
 * - if `x` is -Infinity or -0.0 and `y` is an odd integer, then the result is
 *   `-pow(-x ,y)`.
 * - if `x` is -Infinity or -0.0 and `y` is not an odd integer, then the result
 *   is the same as `pow(-x , y)`.
 * - if `y` is Infinity and the absolute value of `x` is less than 1, the
 *   result is 0.0.
 * - if `y` is Infinity and `x` is -1, the result is 1.0.
 * - if `y` is Infinity and the absolute value of `x` is greater than 1,
 *   the result is Infinity.
 * - if `y` is -Infinity, the result is `1/pow(x, Infinity)`.
 *
 * This corresponds to the `pow` function defined in the IEEE Standard 754-2008.
 *
 * Notice that an [int] result cannot overflow, but a [double] result might
 * be [double.INFINITY].
 */
external num pow(num x, num exponent);

/**
 * Converts [x] to a double and returns the sine of the value.
 *
 * If [x] is not a finite number, the result is NaN.
 */
external double sin(num x);

/**
 * Converts [x] to a double and returns the cosine of the value.
 *
 * If [x] is not a finite number, the result is NaN.
 */
external double cos(num x);

/**
 * Converts [x] to a double and returns the tangent of the value.
 *
 * The tangent function is equivalent to `sin(x)/cos(x)` and may be
 * infinite (positive or negative) when `cos(x)` is equal to zero.
 * If [x] is not a finite number, the result is NaN.
 */
external double tan(num x);

/**
 * Converts [x] to a double and returns the arc cosine of the value.
 *
 * Returns a value in the range 0..PI, or NaN if [x] is outside
 * the range -1..1.
 */
external double acos(num x);

/**
 * Converts [x] to a double and returns the arc sine of the value.
 *
 * Returns a value in the range -PI/2..PI/2, or NaN if [x] is outside
 * the range -1..1.
 */
external double asin(num x);

/**
 * Converts [x] to a double and returns the arc tangent of the value.
 *
 * Returns a value in the range -PI/2..PI/2, or NaN if [x] is NaN.
 */
external double atan(num x);

/**
 * Converts [x] to a double and returns the positive square root of the value.
 *
 * Returns -0.0 if [x] is -0.0, and NaN if [x] is otherwise negative or NaN.
 */
external double sqrt(num x);

/**
 * Converts [x] to a double and returns the natural exponent, [E],
 * to the power [x].
 *
 * Returns NaN if [x] is NaN.
 */
external double exp(num x);

/**
 * Converts [x] to a double and returns the natural logarithm of the value.
 *
 * Returns negative infinity if [x] is equal to zero.
 * Returns NaN if [x] is NaN or less than zero.
 */
external double log(num x);
