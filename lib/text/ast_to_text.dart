// Copyright (c) 2016, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
library kernel.ast_to_text;

import '../ast.dart';
import '../import_table.dart';

class Namer<T> {
  int index = 0;
  final String prefix;
  final Map<T, String> map = <T, String>{};

  Namer(this.prefix);

  String getName(T key) => map.putIfAbsent(key, () => '$prefix${++index}');
}

class Disambiguator<T> {
  final Map<T, String> names = <T, String>{};
  final Set<String> usedNames = new Set<String>();

  String disambiguate(T key, String proposeName()) {
    return names.putIfAbsent(key, () {
      var proposedName = proposeName();
      if (usedNames.add(proposedName)) return proposedName;
      int i = 2;
      while (!usedNames.add('$proposedName$i')) {
        ++i;
      }
      return '$proposedName$i';
    });
  }
}

NameSystem globalDebuggingNames = new NameSystem();

String debugLibraryName(Library node) {
  return node.name ?? globalDebuggingNames.nameLibrary(node);
}

String debugClassName(Class node) {
  return node.name ?? globalDebuggingNames.nameClass(node);
}

String debugQualifiedClassName(Class node) {
  return debugLibraryName(node.enclosingLibrary) + '::' + debugClassName(node);
}

String debugMemberName(Member node) {
  return node.name?.name ?? globalDebuggingNames.nameMember(node);
}

String debugQualifiedMemberName(Member node) {
  if (node.enclosingClass != null) {
    return debugQualifiedClassName(node.enclosingClass) +
        '::' +
        debugMemberName(node);
  } else {
    return debugLibraryName(node.enclosingLibrary) +
        '::' +
        debugMemberName(node);
  }
}

String debugTypeParameterName(TypeParameter node) {
  return node.name ?? globalDebuggingNames.nameTypeParameter(node);
}

String debugQualifiedTypeParameterName(TypeParameter node) {
  if (node.parent is Class) {
    return debugQualifiedClassName(node.parent) +
        '::' +
        debugTypeParameterName(node);
  }
  if (node.parent is Member) {
    return debugQualifiedMemberName(node.parent) +
        '::' +
        debugTypeParameterName(node);
  }
  return debugTypeParameterName(node);
}

String debugVariableDeclarationName(VariableDeclaration node) {
  return node.name ?? globalDebuggingNames.nameVariable(node);
}

String debugNodeToString(Node node) {
  StringBuffer buffer = new StringBuffer();
  new Printer(buffer, syntheticNames: globalDebuggingNames).writeNode(node);
  return '$buffer';
}

class NameSystem {
  final Namer<VariableDeclaration> variables =
      new Namer<VariableDeclaration>('#t');
  final Namer<Member> members = new Namer<Member>('#m');
  final Namer<Class> classes = new Namer<Class>('#class');
  final Namer<Library> libraries = new Namer<Library>('#lib');
  final Namer<TypeParameter> typeParameters = new Namer<TypeParameter>('#T');
  final Disambiguator<Library> prefixes = new Disambiguator<Library>();

  nameVariable(VariableDeclaration node) => variables.getName(node);
  nameMember(Member node) => members.getName(node);
  nameClass(Class node) => classes.getName(node);
  nameLibrary(Library node) => libraries.getName(node);
  nameTypeParameter(TypeParameter node) => typeParameters.getName(node);

  nameLibraryPrefix(Library node, {String proposedName}) {
    return prefixes.disambiguate(node, () {
      if (proposedName != null) return proposedName;
      if (node.name != null) return abbreviateName(node.name);
      if (node.importUri != null) {
        var path = node.importUri.hasEmptyPath
            ? '${node.importUri}'
            : node.importUri.pathSegments.last;
        if (path.endsWith('.dart')) {
          path = path.substring(0, path.length - '.dart'.length);
        }
        return abbreviateName(path);
      }
      return 'L';
    });
  }

  final RegExp punctuation = new RegExp('[.:]');

  String abbreviateName(String name) {
    int dot = name.lastIndexOf(punctuation);
    if (dot != -1) {
      name = name.substring(dot + 1);
    }
    if (name.length > 4) {
      return name.substring(0, 3);
    }
    return name;
  }
}

/// A quick and dirty ambiguous text printer.
class Printer extends Visitor<Null> {
  final NameSystem syntheticNames;
  final StringSink sink;
  ImportTable importTable;
  int indentation = 0;

  static int SPACE = 0;
  static int WORD = 1;
  static int SYMBOL = 2;
  int state = SPACE;

  Printer(this.sink, {NameSystem syntheticNames, this.importTable})
      : this.syntheticNames = syntheticNames ?? new NameSystem();

  void writeLibraryFile(Library library) {
    writeWord('library');
    if (library.name != null) {
      writeWord(library.name);
    }
    endLine(';');
    var imports = new LibraryImportTable(library);
    for (var library in imports.importedLibraries) {
      var importPath = imports.getImportPath(library);
      if (importPath == "") {
        var prefix =
            syntheticNames.nameLibraryPrefix(library, proposedName: 'self');
        endLine('import self as $prefix;');
      } else {
        var prefix = syntheticNames.nameLibraryPrefix(library);
        endLine('import "$importPath" as $prefix;');
      }
    }
    endLine();
    var inner =
        new Printer(sink, importTable: imports, syntheticNames: syntheticNames);
    library.classes.forEach(inner.writeNode);
    library.fields.forEach(inner.writeNode);
    library.procedures.forEach(inner.writeNode);
  }

  void writeProgramFile(Program program) {
    ImportTable imports = new ProgramImportTable(program);
    var inner =
        new Printer(sink, importTable: imports, syntheticNames: syntheticNames);
    endLine('program;');
    writeWord('main');
    writeSpaced('=');
    inner.writeMemberReference(program.mainMethod);
    endLine(';');
    for (var library in program.libraries) {
      writeWord('library');
      if (library.name != null) {
        writeWord(library.name);
      }
      if (library.importUri != null) {
        writeSpaced('from');
        writeWord('"${library.importUri}"');
      }
      var prefix = syntheticNames.nameLibraryPrefix(library);
      writeSpaced('as');
      writeWord(prefix);
      endLine(' {');
      if (!library.isLoaded) {
        inner.endLine('<library is not loaded>');
      }
      ++inner.indentation;
      library.classes.forEach(inner.writeNode);
      library.fields.forEach(inner.writeNode);
      library.procedures.forEach(inner.writeNode);
      --inner.indentation;
      endLine('}');
    }
  }

  int getPrecedence(TreeNode node) {
    return Precedence.of(node);
  }

  void write(String string) {
    sink.write(string);
  }

  void writeSpace([String string = ' ']) {
    write(string);
    state = SPACE;
  }

  void ensureSpace() {
    if (state != SPACE) writeSpace();
  }

  void writeSymbol(String string) {
    write(string);
    state = SYMBOL;
  }

  void writeSpaced(String string) {
    ensureSpace();
    write(string);
    writeSpace();
  }

  void writeComma([String string = ',']) {
    write(string);
    writeSpace();
  }

  void writeWord(String string) {
    if (string.isEmpty) return;
    ensureWordBoundary();
    write(string);
    state = WORD;
  }

  void ensureWordBoundary() {
    if (state == WORD) {
      writeSpace();
    }
  }

  void writeIndentation() {
    writeSpace('  ' * indentation);
  }

  void writeNode(Node node) {
    node.accept(this);
  }

  void writeOptionalNode(Node node) {
    if (node != null) {
      node.accept(this);
    }
  }

  void writeType(DartType type) {
    type.accept(this);
  }

  void writeOptionalType(DartType type) {
    if (type != null) {
      type.accept(this);
    }
  }

  void writeModifier(bool isThere, String name) {
    if (isThere) {
      writeWord(name);
    }
  }

  void writeName(Name name) {
    if (name?.name == '') {
      writeWord(emptyNameString);
    } else {
      writeWord(name?.name ?? '<anon>'); // TODO: write library name
    }
  }

  void endLine([String string]) {
    if (string != null) {
      write(string);
    }
    write('\n');
    state = SPACE;
  }

  void writeFunction(FunctionNode function,
      {name, List<Initializer> initializers, bool terminateLine: true}) {
    if (name is String) {
      writeWord(name);
    } else if (name is Name) {
      writeName(name);
    } else {
      assert(name == null);
    }
    writeTypeParameterList(function.typeParameters);
    writeParameterList(function.positionalParameters, function.namedParameters,
        function.requiredParameterCount);
    writeReturnType(function.returnType);
    if (initializers != null && initializers.isNotEmpty) {
      endLine();
      ++indentation;
      writeIndentation();
      writeComma(':');
      writeList(initializers, writeNode);
      --indentation;
    }
    if (function.asyncMarker != AsyncMarker.Sync) {
      writeSpaced(getAsyncMarkerKeyword(function.asyncMarker));
    }
    if (function.body != null) {
      writeFunctionBody(function.body, terminateLine: terminateLine);
    } else if (terminateLine) {
      endLine(';');
    }
  }

  String getAsyncMarkerKeyword(AsyncMarker marker) {
    switch (marker) {
      case AsyncMarker.Sync:
        return 'sync';
      case AsyncMarker.SyncStar:
        return 'sync*';
      case AsyncMarker.Async:
        return 'async';
      case AsyncMarker.AsyncStar:
        return 'async*';
      default:
        return '<Invalid async marker: $marker>';
    }
  }

  void writeFunctionBody(Statement body, {bool terminateLine: true}) {
    if (body is Block && body.statements.isEmpty) {
      ensureSpace();
      writeSymbol('{}');
      state = WORD;
      if (terminateLine) {
        endLine();
      }
    } else if (body is Block) {
      ensureSpace();
      endLine('{');
      ++indentation;
      body.statements.forEach(writeNode);
      --indentation;
      writeIndentation();
      writeSymbol('}');
      state = WORD;
      if (terminateLine) {
        endLine();
      }
    } else if (body is ReturnStatement && !terminateLine) {
      writeSpaced('=>');
      writeExpression(body.expression);
    } else {
      writeBody(body);
    }
  }

  void writeBody(Statement body) {
    if (body is Block) {
      endLine(' {');
      ++indentation;
      body.statements.forEach(writeNode);
      --indentation;
      writeIndentation();
      endLine('}');
    } else {
      endLine();
      ++indentation;
      writeNode(body);
      --indentation;
    }
  }

  void writeReturnType(DartType type) {
    if (type == null) return;
    writeSpaced('→');
    writeType(type);
  }

  void writeTypeParameterList(List<TypeParameter> typeParameters) {
    if (typeParameters.isEmpty) return;
    writeSymbol('<');
    writeList(typeParameters, writeNode);
    writeSymbol('>');
    state = WORD; // Ensure space if not followed by another symbol.
  }

  void writeParameterList(List<VariableDeclaration> positional,
      List<VariableDeclaration> named, int requiredParameterCount) {
    writeSymbol('(');
    writeList(
        positional.take(requiredParameterCount), writeVariableDeclaration);
    if (requiredParameterCount < positional.length) {
      if (requiredParameterCount > 0) {
        writeComma();
      }
      writeSymbol('[');
      writeList(
          positional.skip(requiredParameterCount), writeVariableDeclaration);
      writeSymbol(']');
    }
    if (named.isNotEmpty) {
      if (positional.isNotEmpty) {
        writeComma();
      }
      writeSymbol('{');
      writeList(named, writeVariableDeclaration);
      writeSymbol('}');
    }
    writeSymbol(')');
  }

  void writeList(Iterable nodes, callback(x), {String separator: ','}) {
    bool first = true;
    for (var node in nodes) {
      if (first) {
        first = false;
      } else {
        writeComma(separator);
      }
      callback(node);
    }
  }

  void writeMemberReference(Member member) {
    if (member == null) {
      writeWord('<No Member>');
    } else {
      if (member.enclosingClass != null) {
        writeClassReference(member.enclosingClass);
      } else {
        writeLibraryReference(member.enclosingLibrary);
      }
      writeSymbol('::');
      var name = getMemberName(member);
      writeWord(name.name);
    }
  }

  void writeClassReference(Class classNode) {
    if (classNode == null) {
      writeWord('<No Class>');
    } else {
      if (classNode.enclosingLibrary != null) {
        writeLibraryReference(classNode.enclosingLibrary);
      }
      writeSymbol('::');
      writeWord(classNode.name ?? syntheticNames.nameClass(classNode));
    }
  }

  void writeLibraryReference(Library library) {
    if (library == null) {
      writeWord('<No Library>');
    } else if (importTable != null &&
        importTable.getImportIndex(library) != -1) {
      writeWord(syntheticNames.nameLibraryPrefix(library));
    } else {
      writeWord(library.name ?? syntheticNames.nameLibrary(library));
    }
  }

  void writeVariableReference(VariableDeclaration variable) {
    if (variable == null) {
      writeWord('<No Var>');
    } else {
      writeWord(variable.name ?? syntheticNames.nameVariable(variable));
    }
  }

  String getTypeParameterName(TypeParameter node) {
    return node.name ?? syntheticNames.nameTypeParameter(node);
  }

  void writeTypeParameterReference(TypeParameter node) {
    if (node == null) {
      writeWord('<No TypeVar>');
      return;
    }
    var parent = node.parent;
    if (parent is Class) {
      writeClassReference(parent);
      writeSymbol('::');
      writeWord(getTypeParameterName(node));
    } else if (parent is FunctionNode && parent.parent is Member) {
      writeMemberReference(parent.parent);
      writeSymbol('::');
      writeWord(getTypeParameterName(node));
    } else {
      writeWord(getTypeParameterName(node));
    }
  }

  void writeExpression(Expression node, [int minimumPrecedence]) {
    bool needsParenteses = false;
    if (minimumPrecedence != null && getPrecedence(node) < minimumPrecedence) {
      needsParenteses = true;
      writeSymbol('(');
    }
    writeNode(node);
    if (needsParenteses) {
      writeSymbol(')');
    }
  }

  visitLibrary(Library node) {}

  static final String emptyNameString = '•';
  static final Name emptyName = new Name(emptyNameString);

  Name getMemberName(Member node) {
    if (node.name?.name == '') return emptyName;
    if (node.name != null) return node.name;
    return new Name(syntheticNames.nameMember(node));
  }

  String getClassName(Class node) {
    if (node.name != null) return node.name;
    return syntheticNames.nameClass(node);
  }

  visitField(Field node) {
    writeIndentation();
    writeModifier(node.isStatic, 'static');
    writeModifier(node.isFinal, 'final');
    writeModifier(node.isConst, 'const');
    writeWord('field');
    writeOptionalType(node.type);
    writeName(getMemberName(node));
    if (node.initializer != null) {
      writeSpaced('=');
      writeExpression(node.initializer);
    }
    endLine(';');
  }

  visitProcedure(Procedure node) {
    writeIndentation();
    writeModifier(node.isExternal, 'external');
    writeModifier(node.isStatic, 'static');
    writeModifier(node.isAbstract, 'abstract');
    writeWord(procedureKindToString(node.kind));
    writeFunction(node.function, name: getMemberName(node));
  }

  visitConstructor(Constructor node) {
    writeIndentation();
    writeModifier(node.isExternal, 'external');
    writeModifier(node.isConst, 'const');
    writeWord('constructor');
    writeFunction(node.function,
        name: node.name, initializers: node.initializers);
  }

  visitNormalClass(NormalClass node) {
    writeIndentation();
    writeModifier(node.isAbstract, 'abstract');
    writeWord('class');
    writeWord(getClassName(node));
    writeTypeParameterList(node.typeParameters);
    if (node.supertype != null) {
      writeWord('extends');
      writeType(node.supertype);
    }
    if (node.implementedTypes.isNotEmpty) {
      writeWord('implements');
      writeList(node.implementedTypes, writeType);
    }
    endLine(' {');
    ++indentation;
    node.fields.forEach(writeNode);
    node.constructors.forEach(writeNode);
    node.procedures.forEach(writeNode);
    --indentation;
    writeIndentation();
    endLine('}');
  }

  visitMixinClass(MixinClass node) {
    writeIndentation();
    writeModifier(node.isAbstract, 'abstract');
    writeWord('mixin');
    writeWord(getClassName(node));
    writeTypeParameterList(node.typeParameters);
    writeSpaced('=');
    writeType(node.supertype);
    writeSpaced('with');
    writeType(node.mixedInType);
    if (node.implementedTypes.isNotEmpty) {
      writeWord('implements');
      writeList(node.implementedTypes, writeType);
    }
    if (node.constructors.isEmpty) {
      endLine(';');
    } else {
      endLine(' {');
      ++indentation;
      node.constructors.forEach(writeNode);
      --indentation;
      endLine('}');
    }
  }

  visitInvalidExpression(InvalidExpression node) {
    writeWord('invalid-expression');
  }

  visitMethodInvocation(MethodInvocation node) {
    writeExpression(node.receiver, Precedence.PRIMARY);
    writeSymbol('.');
    writeName(node.name);
    writeNode(node.arguments);
  }

  visitSuperMethodInvocation(SuperMethodInvocation node) {
    writeWord('super');
    writeSymbol('.');
    writeMemberReference(node.target);
    writeNode(node.arguments);
  }

  visitStaticInvocation(StaticInvocation node) {
    writeModifier(node.isConst, 'const');
    writeMemberReference(node.target);
    writeNode(node.arguments);
  }

  visitConstructorInvocation(ConstructorInvocation node) {
    writeWord(node.isConst ? 'const' : 'new');
    writeMemberReference(node.target);
    writeNode(node.arguments);
  }

  visitNot(Not node) {
    writeSymbol('!');
    writeExpression(node.operand, Precedence.PREFIX);
  }

  visitLogicalExpression(LogicalExpression node) {
    int precedence = Precedence.binaryPrecedence[node.operator];
    writeExpression(node.left, precedence);
    writeSpaced(node.operator);
    writeExpression(node.right, precedence + 1);
  }

  visitConditionalExpression(ConditionalExpression node) {
    writeExpression(node.condition, Precedence.LOGICAL_OR);
    writeSpaced('?');
    writeExpression(node.then);
    writeSpaced(':');
    writeExpression(node.otherwise);
  }

  String getEscapedCharacter(int codeUnit) {
    switch (codeUnit) {
      case 9:
        return r'\t';
      case 10:
        return r'\n';
      case 11:
        return r'\v';
      case 12:
        return r'\f';
      case 13:
        return r'\r';
      case 34:
        return r'\"';
      case 36:
        return r'\$';
      case 92:
        return r'\\';
      default:
        if (codeUnit < 32 || codeUnit > 126) {
          return r'\u' + '$codeUnit'.padLeft(4, '0');
        } else {
          return null;
        }
    }
  }

  String escapeString(String string) {
    StringBuffer buffer;
    for (int i = 0; i < string.length; ++i) {
      String character = getEscapedCharacter(string.codeUnitAt(i));
      if (character != null) {
        buffer ??= new StringBuffer(string.substring(0, i));
        buffer.write(character);
      }
    }
    return buffer == null ? string : buffer.toString();
  }

  visitStringConcatenation(StringConcatenation node) {
    if (state == WORD) {
      writeSpace();
    }
    write('"');
    for (var part in node.expressions) {
      if (part is StringLiteral) {
        writeSymbol(escapeString(part.value));
      } else {
        writeSymbol(r'${');
        writeExpression(part);
        writeSymbol('}');
      }
    }
    write('"');
    state = WORD;
  }

  visitIsExpression(IsExpression node) {
    writeExpression(node.operand, Precedence.BITWISE_OR);
    writeSpaced('is');
    writeType(node.type);
  }

  visitAsExpression(AsExpression node) {
    writeExpression(node.operand, Precedence.BITWISE_OR);
    writeSpaced('as');
    writeType(node.type);
  }

  visitSymbolLiteral(SymbolLiteral node) {
    writeSymbol('#');
    writeWord(node.value);
  }

  visitTypeLiteral(TypeLiteral node) {
    writeType(node.type);
  }

  visitThisExpression(ThisExpression node) {
    writeWord('this');
  }

  visitRethrow(Rethrow node) {
    writeWord('rethrow');
  }

  visitThrow(Throw node) {
    writeWord('throw');
    writeExpression(node.expression);
  }

  visitListLiteral(ListLiteral node) {
    if (node.isConst) {
      writeWord('const');
      writeSpace();
    }
    if (node.typeArgument != null) {
      writeSymbol('<');
      writeType(node.typeArgument);
      writeSymbol('>');
    }
    writeSymbol('[');
    writeList(node.expressions, writeNode);
    writeSymbol(']');
  }

  visitMapLiteral(MapLiteral node) {
    if (node.isConst) {
      writeWord('const');
      writeSpace();
    }
    if (node.keyType != null) {
      writeSymbol('<');
      writeList([node.keyType, node.valueType], writeType);
      writeSymbol('>');
    }
    writeSymbol('{');
    writeList(node.entries, writeNode);
    writeSymbol('}');
  }

  visitMapEntry(MapEntry node) {
    writeExpression(node.key);
    writeComma(':');
    writeExpression(node.value);
  }

  visitAwaitExpression(AwaitExpression node) {
    writeWord('await');
    writeExpression(node.operand);
  }

  visitFunctionExpression(FunctionExpression node) {
    writeFunction(node.function, terminateLine: false);
  }

  visitStringLiteral(StringLiteral node) {
    writeWord('"${escapeString(node.value)}"');
  }

  visitIntLiteral(IntLiteral node) {
    writeWord('${node.value}');
  }

  visitDoubleLiteral(DoubleLiteral node) {
    writeWord('${node.value}');
  }

  visitBoolLiteral(BoolLiteral node) {
    writeWord('${node.value}');
  }

  visitNullLiteral(NullLiteral node) {
    writeWord('null');
  }

  visitLet(Let node) {
    writeWord('let');
    writeVariableDeclaration(node.variable);
    writeSpaced('in');
    writeExpression(node.body);
  }

  defaultExpression(Expression node) {
    writeWord('${node.runtimeType}');
  }

  visitVariableGet(VariableGet node) {
    writeVariableReference(node.variable);
  }

  visitVariableSet(VariableSet node) {
    writeVariableReference(node.variable);
    writeSpaced('=');
    writeExpression(node.value);
  }

  visitPropertyGet(PropertyGet node) {
    writeExpression(node.receiver, Precedence.PRIMARY);
    writeSymbol('.');
    writeName(node.name);
  }

  visitPropertySet(PropertySet node) {
    writeExpression(node.receiver, Precedence.PRIMARY);
    writeSymbol('.');
    writeName(node.name);
    writeSpaced('=');
    writeExpression(node.value);
  }

  visitSuperPropertyGet(SuperPropertyGet node) {
    writeWord('super');
    writeSymbol('.');
    writeMemberReference(node.target);
  }

  visitSuperPropertySet(SuperPropertySet node) {
    writeWord('super');
    writeSymbol('.');
    writeMemberReference(node.target);
    writeSpaced('=');
    writeExpression(node.value);
  }

  visitStaticGet(StaticGet node) {
    writeMemberReference(node.target);
  }

  visitStaticSet(StaticSet node) {
    writeMemberReference(node.target);
    writeSpaced('=');
    writeExpression(node.value);
  }

  visitInvalidStatement(InvalidStatement node) {
    writeIndentation();
    endLine('invalid-statement;');
  }

  visitExpressionStatement(ExpressionStatement node) {
    writeIndentation();
    writeExpression(node.expression);
    endLine(';');
  }

  visitBlock(Block node) {
    writeIndentation();
    if (node.statements.isEmpty) {
      endLine('{}');
      return null;
    }
    endLine('{');
    ++indentation;
    node.statements.forEach(writeNode);
    --indentation;
    writeIndentation();
    endLine('}');
  }

  visitEmptyStatement(EmptyStatement node) {
    writeIndentation();
    endLine(';');
  }

  visitAssertStatement(AssertStatement node) {
    writeIndentation();
    writeWord('assert');
    writeSymbol('(');
    writeExpression(node.condition);
    if (node.message != null) {
      writeComma();
      writeExpression(node.message);
    }
    endLine(');');
  }

  visitLabeledStatement(LabeledStatement node) {
    writeNode(node.body); // TODO
  }

  visitBreakStatement(BreakStatement node) {
    writeIndentation();
    writeWord('break'); // TODO
    endLine(';');
  }

  visitWhileStatement(WhileStatement node) {
    writeIndentation();
    writeSpaced('while');
    writeSymbol('(');
    writeExpression(node.condition);
    writeSymbol(')');
    writeBody(node.body);
  }

  visitDoStatement(DoStatement node) {
    writeIndentation();
    writeWord('do');
    writeBody(node.body);
    writeIndentation();
    writeSpaced('while');
    writeSymbol('(');
    writeExpression(node.condition);
    endLine(')');
  }

  visitForStatement(ForStatement node) {
    writeIndentation();
    writeWord('for');
    writeSymbol('(');
    writeList(node.variables, writeVariableDeclaration);
    writeComma(';');
    if (node.condition != null) {
      writeExpression(node.condition);
    }
    writeComma(';');
    writeList(node.updates, writeExpression);
    writeSymbol(')');
    writeBody(node.body);
  }

  visitForInStatement(ForInStatement node) {
    writeIndentation();
    writeWord('for');
    writeSymbol('(');
    writeVariableDeclaration(node.variable, useVarKeyword: true);
    writeSpaced('in');
    writeExpression(node.iterable);
    writeSymbol(')');
    writeBody(node.body);
  }

  visitSwitchStatement(SwitchStatement node) {
    writeIndentation();
    writeWord('switch');
    writeSymbol('(');
    writeExpression(node.expression);
    endLine(') {');
    ++indentation;
    node.cases.forEach(writeNode);
    --indentation;
    writeIndentation();
    endLine('}');
  }

  visitSwitchCase(SwitchCase node) {
    for (var expression in node.expressions) {
      writeIndentation();
      writeWord('case');
      writeExpression(expression);
      endLine(':');
    }
    if (node.isDefault) {
      writeIndentation();
      writeWord('default');
      endLine(':');
    }
    ++indentation;
    writeNode(node.body);
    --indentation;
  }

  visitContinueSwitchStatement(ContinueSwitchStatement node) {
    writeIndentation();
    writeWord('continue to switch case'); // TODO
    endLine(';');
  }

  visitIfStatement(IfStatement node) {
    writeIndentation();
    writeWord('if');
    writeSymbol('(');
    writeExpression(node.condition);
    writeSymbol(')');
    writeBody(node.then);
    if (node.otherwise != null) {
      writeIndentation();
      writeWord('else');
      writeBody(node.otherwise);
    }
  }

  visitReturnStatement(ReturnStatement node) {
    writeIndentation();
    writeWord('return');
    if (node.expression != null) {
      writeExpression(node.expression);
    }
    endLine(';');
  }

  visitTryCatch(TryCatch node) {
    writeIndentation();
    writeWord('try');
    writeBody(node.body);
    node.catches.forEach(writeNode);
  }

  visitCatch(Catch node) {
    writeIndentation();
    if (node.guard != null) {
      writeWord('on');
      writeType(node.guard);
      writeSpace();
    }
    writeWord('catch');
    writeSymbol('(');
    if (node.exception != null) {
      writeVariableDeclaration(node.exception);
    } else {
      writeWord('no-exception-var');
    }
    if (node.stackTrace != null) {
      writeComma();
      writeVariableDeclaration(node.stackTrace);
    }
    writeSymbol(')');
    writeBody(node.body);
  }

  visitTryFinally(TryFinally node) {
    writeIndentation();
    writeWord('try');
    writeBody(node.body);
    writeIndentation();
    writeWord('finally');
    writeBody(node.finalizer);
  }

  visitYieldStatement(YieldStatement node) {
    writeIndentation();
    writeWord('yield');
    writeExpression(node.expression);
    endLine(';');
  }

  visitVariableDeclaration(VariableDeclaration node) {
    writeIndentation();
    writeVariableDeclaration(node, useVarKeyword: true);
    endLine(';');
  }

  String getVariableName(VariableDeclaration node) {
    if (node.name != null) return node.name;
    return syntheticNames.nameVariable(node);
  }

  visitFunctionDeclaration(FunctionDeclaration node) {
    writeIndentation();
    writeWord('function');
    writeFunction(node.function, name: getVariableName(node.variable));
  }

  void writeVariableDeclaration(VariableDeclaration node,
      {bool useVarKeyword: false}) {
    writeModifier(node.isFinal, 'final');
    writeModifier(node.isConst, 'const');
    if (node.type != null) {
      writeType(node.type);
    }
    if (useVarKeyword && !node.isFinal && !node.isConst && node.type == null) {
      writeWord('var');
    }
    writeWord(getVariableName(node));
    if (node.initializer != null) {
      writeSpaced('=');
      writeExpression(node.initializer);
    }
  }

  visitArguments(Arguments node) {
    if (node.types.isNotEmpty) {
      writeSymbol('<');
      writeList(node.types, writeType);
      writeSymbol('>');
    }
    writeSymbol('(');
    var allArgs = [node.positional, node.named].expand((x) => x);
    writeList(allArgs, writeNode);
    writeSymbol(')');
  }

  visitNamedExpression(NamedExpression node) {
    writeWord(node.name);
    writeComma(':');
    writeExpression(node.value);
  }

  defaultStatement(Statement node) {
    writeIndentation();
    endLine('${node.runtimeType}');
  }

  visitInvalidInitializer(InvalidInitializer node) {
    writeWord('invalid-initializer');
  }

  visitFieldInitializer(FieldInitializer node) {
    writeMemberReference(node.field);
    writeSpaced('=');
    writeExpression(node.value);
  }

  visitSuperInitializer(SuperInitializer node) {
    writeWord('super');
    writeMemberReference(node.target);
    writeNode(node.arguments);
  }

  visitRedirectingInitializer(RedirectingInitializer node) {
    writeWord('this');
    writeMemberReference(node.target);
    writeNode(node.arguments);
  }

  defaultInitializer(Initializer node) {
    writeIndentation();
    endLine(': ${node.runtimeType}');
  }

  visitInvalidType(InvalidType node) {
    writeWord('invalid-type');
  }

  visitDynamicType(DynamicType node) {
    writeWord('dynamic');
  }

  visitVoidType(VoidType node) {
    writeWord('void');
  }

  visitInterfaceType(InterfaceType node) {
    writeClassReference(node.classNode);
    if (node.typeArguments.isNotEmpty) {
      writeSymbol('<');
      writeList(node.typeArguments, writeType);
      writeSymbol('>');
      state = WORD; // Disallow a word immediately after the '>'.
    }
  }

  visitFunctionType(FunctionType node) {
    writeTypeParameterList(node.typeParameters);
    writeSymbol('(');
    var positional = node.positionalParameters;
    writeList(positional.take(node.requiredParameterCount), writeType);
    if (node.requiredParameterCount < positional.length) {
      if (node.requiredParameterCount > 0) {
        writeComma();
      }
      writeSymbol('[');
      writeList(positional.skip(node.requiredParameterCount), writeType);
      writeSymbol(']');
    }
    if (node.namedParameters.isNotEmpty) {
      if (node.positionalParameters.isNotEmpty) {
        writeComma();
      }
      writeSymbol('{');
      writeList(node.namedParameters.keys, (name) {
        writeType(node.namedParameters[name]);
        writeWord(name);
      });
      writeSymbol('}');
    }
    writeSymbol(')');
    writeSpaced('→');
    writeType(node.returnType);
  }

  visitTypeParameterType(TypeParameterType node) {
    writeTypeParameterReference(node.parameter);
  }

  visitTypeParameter(TypeParameter node) {
    writeWord(getTypeParameterName(node));
    if (node.bound is! DynamicType) {
      writeSpaced(' extends ');
      writeType(node.bound);
    }
  }

  defaultNode(Node node) {
    write('<${node.runtimeType}>');
  }
}

class Precedence extends ExpressionVisitor<int> {
  static final Precedence instance = new Precedence();

  static int of(Expression node) => node.accept(instance);

  static const int EXPRESSION = 1;
  static const int CONDITIONAL = 2;
  static const int LOGICAL_NULL_AWARE = 3;
  static const int LOGICAL_OR = 4;
  static const int LOGICAL_AND = 5;
  static const int EQUALITY = 6;
  static const int RELATIONAL = 7;
  static const int BITWISE_OR = 8;
  static const int BITWISE_XOR = 9;
  static const int BITWISE_AND = 10;
  static const int SHIFT = 11;
  static const int ADDITIVE = 12;
  static const int MULTIPLICATIVE = 13;
  static const int PREFIX = 14;
  static const int POSTFIX = 15;
  static const int TYPE_LITERAL = 19;
  static const int PRIMARY = 20;
  static const int CALLEE = 21;

  static const Map<String, int> binaryPrecedence = const {
    '&&': LOGICAL_AND,
    '||': LOGICAL_OR,
    '??': LOGICAL_NULL_AWARE,
    '==': EQUALITY,
    '!=': EQUALITY,
    '>': RELATIONAL,
    '>=': RELATIONAL,
    '<': RELATIONAL,
    '<=': RELATIONAL,
    '|': BITWISE_OR,
    '^': BITWISE_XOR,
    '&': BITWISE_AND,
    '>>': SHIFT,
    '<<': SHIFT,
    '+': ADDITIVE,
    '-': ADDITIVE,
    '*': MULTIPLICATIVE,
    '%': MULTIPLICATIVE,
    '/': MULTIPLICATIVE,
    '~/': MULTIPLICATIVE,
    null: EXPRESSION,
  };

  static bool isAssociativeBinaryOperator(int precedence) {
    return precedence != EQUALITY && precedence != RELATIONAL;
  }

  int visitInvalidExpression(InvalidExpression node) => CALLEE;
  int visitMethodInvocation(MethodInvocation node) => CALLEE;
  int visitSuperMethodInvocation(SuperMethodInvocation node) => CALLEE;
  int visitStaticInvocation(StaticInvocation node) => CALLEE;
  int visitConstructorInvocation(ConstructorInvocation node) => CALLEE;
  int visitNot(Not node) => PREFIX;
  int visitLogicalExpression(LogicalExpression node) =>
      binaryPrecedence[node.operator];
  int visitConditionalExpression(ConditionalExpression node) => CONDITIONAL;
  int visitStringConcatenation(StringConcatenation node) => PRIMARY;
  int visitIsExpression(IsExpression node) => RELATIONAL;
  int visitAsExpression(AsExpression node) => RELATIONAL;
  int visitSymbolLiteral(SymbolLiteral node) => PRIMARY;
  int visitTypeLiteral(TypeLiteral node) => PRIMARY;
  int visitThisExpression(ThisExpression node) => CALLEE;
  int visitRethrow(Rethrow node) => PRIMARY;
  int visitThrow(Throw node) => EXPRESSION;
  int visitListLiteral(ListLiteral node) => PRIMARY;
  int visitMapLiteral(MapLiteral node) => PRIMARY;
  int visitAwaitExpression(AwaitExpression node) => PREFIX;
  int visitFunctionExpression(FunctionExpression node) => PRIMARY;
  int visitStringLiteral(StringLiteral node) => CALLEE;
  int visitIntLiteral(IntLiteral node) => CALLEE;
  int visitDoubleLiteral(DoubleLiteral node) => CALLEE;
  int visitBoolLiteral(BoolLiteral node) => CALLEE;
  int visitNullLiteral(NullLiteral node) => CALLEE;
  int visitVariableGet(VariableGet node) => PRIMARY;
  int visitVariableSet(VariableSet node) => EXPRESSION;
  int visitPropertyGet(PropertyGet node) => PRIMARY;
  int visitPropertySet(PropertySet node) => EXPRESSION;
  int visitSuperPropertyGet(SuperPropertyGet node) => PRIMARY;
  int visitSuperPropertySet(SuperPropertySet node) => EXPRESSION;
  int visitStaticGet(StaticGet node) => PRIMARY;
  int visitStaticSet(StaticSet node) => EXPRESSION;
  int visitLet(Let node) => EXPRESSION;
}

String procedureKindToString(ProcedureKind kind) {
  switch (kind) {
    case ProcedureKind.Method:
      return 'method';
    case ProcedureKind.Getter:
      return 'get';
    case ProcedureKind.Setter:
      return 'set';
    case ProcedureKind.Operator:
      return 'operator';
    case ProcedureKind.Factory:
      return 'factory';
  }
}

class ExpressionPrinter {
  final Printer writeer;
  final int minimumPrecedence;

  ExpressionPrinter(this.writeer, this.minimumPrecedence);
}