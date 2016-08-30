// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// import "package:expect/expect.dart";
class Expect {
  int x = 0;

  static void isTrue(bool b) {
    if (!b) {
      print('Expected true, got $b');
      print('*'*80);
      print('(Ignore the NPE; it\'s just used to cause test failure)');
      Expect e = null;
      print(e.x);
    }
  }

  static void isFalse(bool b) {
    if (b) {
      print('Expected false, got $b');
      print('*'*80);
      print('(Ignore the NPE; it\'s just used to cause test failure)');
      Expect e = null;
      print(e.x);
    }
  }
}

class A {
}

class B extends A {
}

class C implements B {
}

int inscrutable(int x) => x == 0 ? 0 : x | inscrutable(x & (x - 1));

main() {
  var things = [new A(), new B(), new C()];

  var a = things[inscrutable(0)];
  Expect.isTrue(a is A);
  Expect.isFalse(a is B);
  Expect.isFalse(a is C);

  var b = things[inscrutable(1)];
  Expect.isTrue(b is A);
  Expect.isTrue(b is B);
  Expect.isFalse(b is C);

  var c = things[inscrutable(2)];
  Expect.isTrue(c is A);
  Expect.isTrue(c is B);
  Expect.isTrue(c is C);
}