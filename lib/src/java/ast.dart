// Copyright (c) 2016, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

/// A simple AST designed for generating a single Java source file. It is
/// assumed that errors are caught before generating this AST, so there are no
/// designated "error" or "invalid" nodes.

import 'visitor.dart';

/// Java access specifier
class Access {
  static const Access Public = const Access("public");
  static const Access Protected = const Access("protected");
  static const Access Private = const Access("private");

  /// Package-private or default access. In Java code, this is written by
  /// omitting a specifier (e.g. `static void foo() {}` instead of
  /// `public static void foo() {}`).
  static const Access Package = const Access("");

  final String modifier;

  const Access(this.modifier);

  @override
  String toString() {
    return modifier;
  }
}

/// The root class for nodes in the Java AST.
abstract class Node {
  Node parent;

  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v);

  /// TODO(springerm) Do we need this?
  // Iterable/*<R>*/ visitChildren/*<R>*/(Visitor/*<R>*/ v);

  /// [toString] is only meant for debugging purposes. For Java code generation,
  /// use an AST visitor.
  String toString() => '[$runtimeType]';
}

/// A Java class.
///
/// Each AST should be rooted at a Java class (since we produce exactly one
/// class per source file).  Of course, Java also allows for nested and local
/// classes, so this node may appear deeper within the tree as well.
class ClassDecl extends Node {
  /// Java package. May not be null, and must contain at least one identifier.
  String package;

  /// Class name; may be null for anonymous classes.
  String name;

  Access access;

  List<MethodDef> methods;

  List<FieldDecl> fields;

  ClassDecl(this.package, this.name, 
    [this.access, this.fields = const [], this.methods = const []]);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitClassDecl(this);

  String toString() => '${access} class $name';
}

/// A Java method.
class MethodDef extends Node {
  /// Method name
  String name;

  /// Represent the list of statements, i.e., the method body.
  Block body;

  /// Define the parameter names and types.
  List<VariableDecl> parameters;

  /// Define the return type of the method.
  String returnType;

  bool isStatic;

  bool isFinal;

  Access access;

  MethodDef(this.name, this.body, this.parameters, {
    this.returnType: "void",
    this.isStatic: false,
    this.isFinal: false,
    this.access: Access.Public});

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitMethodDef(this);
}

/// A instance variable declaration for fields.
class FieldDecl extends Node {
  String name;
  String type;
  Access access;
  bool isStatic;
  bool isFinal;
  Expression initializer;   // may be null

  FieldDecl(this.name, this.type, {
    this.initializer,
    this.access: Access.Private, 
    this.isStatic: false,
    this.isFinal: false});

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitFieldDecl(this);
}

/// A variable declaration for parameters and local variables.
class VariableDecl extends Node {
  String name;
  String type;
  bool isFinal;

  VariableDecl(this.name, this.type, {this.isFinal: false});

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitVariableDecl(this);
}

/// Abstract class for statements.
abstract class Statement extends Node {}

/// A list of statements enclosed in a block.
class Block extends Statement {
  List<Statement> statements;

  Block([this.statements = const []]);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitBlock(this);
}

/// An if statement. The else (false) part is optional.
class IfStmt extends Statement {
  Expression condition;

  // Allow only blocks to avoid ambiguous else part in nested if statements
  Block thenBody;

  Block elseBody;

  /// TODO(springerm) Add support for "else if"

  IfStmt(this.condition, this.thenBody, [this.elseBody]);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitIfStmt(this);
}

/// A local variable definition with an optional initialization value.
class VariableDeclStmt extends Statement {
  VariableDecl variable;

  Expression value;

  VariableDeclStmt(VariableDecl variable, [Expression value = null]) {
    this.variable = variable;

    if (value == null) {
      this.value = new NullLiteral();
    } else {
      this.value = value;
    }
  }

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitVariableDeclStmt(this);
}

/// A method return statement.
class ReturnStmt extends Statement {
  Expression value;

  ReturnStmt([this.value]);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitReturnStmt(this);
}

/// An expression that acts as a statement.
class ExpressionStmt extends Statement {
  Expression expression;

  ExpressionStmt(this.expression);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitExpressionStmt(this);
}

/// Abstract class for expressions.
abstract class Expression extends Node {}

/// A method invocation.
class MethodInvocation extends Expression {
  Expression receiver;

  String methodName;

  List<Expression> arguments;

  MethodInvocation(this.receiver, this.methodName, 
    [this.arguments = const []]);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitMethodInvocation(this);
}

/// A binary expression (e.g., arithmetic operators).
class BinaryExpr extends Expression {
  Expression leftOperand;

  Expression rightOperand;

  String operatorSymbol;

  BinaryExpr(this.leftOperand, this.rightOperand, this.operatorSymbol);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitBinaryExpr(this);
}

/// A unary expression (e.g., negation of numbers).
class UnaryExpr extends Expression {
  Expression operand;

  String operatorSymbol;

  UnaryExpr(this.operand, this.operatorSymbol);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitUnaryExpr(this);
}

/// References an identifier such as a local variable.
class IdentifierExpr extends Expression {
  String identifier;

  IdentifierExpr(this.identifier);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitIdentifierExpr(this);
}

/// An expression that writes to a local variable.
class AssignmentExpr extends Expression {
  IdentifierExpr identifier;

  Expression value;

  AssignmentExpr(this.identifier, this.value);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitAssignmentExpr(this);
}

/// A class reference. This node can be used as receiver expression when
/// calling static methods.
class ClassRefExpr extends Expression {
  String className;

  ClassRefExpr(this.className);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitClassRefExpr(this);
}

/// Abstract class for literals.
abstract class Literal extends Expression {}

/// An integer literal.
class IntLiteral extends Literal {
  int value;

  IntLiteral(this.value);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitIntLiteral(this);
}

/// A double literal.
class DoubleLiteral extends Literal {
  double value;

  DoubleLiteral(this.value);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitDoubleLiteral(this);
}

/// A string literal.
class StringLiteral extends Literal {
  String value;

  StringLiteral(this.value);

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitStringLiteral(this);
}

class NullLiteral extends Literal {
  static final instance = new NullLiteral._();
  NullLiteral._();

  @override
  /*=R*/ accept/*<R>*/(Visitor/*<R>*/ v) => v.visitNullLiteral(this);

  factory NullLiteral() {
    return instance;
  }
}