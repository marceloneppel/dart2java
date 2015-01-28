var dart.async;
(function (dart.async) {
  'use strict';
  // Function _invokeErrorHandler: (Function, Object, StackTrace) → dynamic
  function _invokeErrorHandler(errorHandler, error, stackTrace) {
    if (/* Unimplemented IsExpression: errorHandler is ZoneBinaryCallback */) {
      return /* Unimplemented MethodInvocation: errorHandler(error, stackTrace) */;
    }
     else {
      return /* Unimplemented MethodInvocation: errorHandler(error) */;
    }
  }

  // Function _registerErrorHandler: (Function, Zone) → Function
  function _registerErrorHandler(errorHandler, zone) {
    if (/* Unimplemented IsExpression: errorHandler is ZoneBinaryCallback */) {
      return zone.registerBinaryCallback(/* Unimplemented: DownCast: Function to (dynamic, dynamic) → dynamic */ errorHandler);
    }
     else {
      return zone.registerUnaryCallback(/* Unimplemented: DownCast: Function to (dynamic) → dynamic */ errorHandler);
    }
  }

  class _UncaughtAsyncError extends AsyncError {
    constructor(error, stackTrace) {
      super(error, _getBestStackTrace(error, stackTrace));
    }
    static _getBestStackTrace(error, stackTrace) {
      if (stackTrace !== null) return stackTrace;
      if (/* Unimplemented IsExpression: error is Error */) {
        return /* Unimplemented: DownCast: dynamic to StackTrace */ dart.dload(error, "stackTrace");
      }
      return null;
    }
    toString() {
      let result = "Uncaught Error: " + (error) + "";
      if (stackTrace !== null) {
        result = "
        Stack Trace:
        " + (stackTrace) + "";
      }
      return result;
    }
  }

  class _BroadcastStream extends _ControllerStream {
    constructor(controller) {
      super(/* Unimplemented: DownCastDynamic: _StreamControllerLifecycle<dynamic> to _StreamControllerLifecycle<T> */ controller);
    }
    get isBroadcast() { return true; }
  }

  class _BroadcastSubscriptionLink {
    constructor() {
      this._next = null;
      this._previous = null;
      super();
    }
  }

  class _BroadcastSubscription extends _ControllerSubscription {
    constructor(controller, /* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      this._STATE_EVENT_ID = 1;
      this._STATE_FIRING = 2;
      this._STATE_REMOVE_AFTER_FIRING = 4;
      this._eventState = null;
      this._next = null;
      this._previous = null;
      super(/* Unimplemented: DownCastDynamic: _StreamControllerLifecycle<dynamic> to _StreamControllerLifecycle<T> */ controller, onData, onError, onDone, cancelOnError);
      this._next = this._previous = this;
    }
    get _controller() { return /* Unimplemented: DownCast: _StreamControllerLifecycle<T> to _BroadcastStreamController<dynamic> */ super._controller; }
    _expectsEvent(eventId) { return (this._eventState & _STATE_EVENT_ID) === eventId; }
    _toggleEventId() {
      this._eventState = _STATE_EVENT_ID;
    }
    get _isFiring() { return (this._eventState & _STATE_FIRING) !== 0; }
    _setRemoveAfterFiring() {
      /* Unimplemented AssertStatement: assert (_isFiring); */this._eventState = _STATE_REMOVE_AFTER_FIRING;
    }
    get _removeAfterFiring() { return (this._eventState & _STATE_REMOVE_AFTER_FIRING) !== 0; }
    _onPause() {
    }
    _onResume() {
    }
  }

  class _BroadcastStreamController {
    constructor(_onListen, _onCancel) {
      this._onListen = _onListen;
      this._onCancel = _onCancel;
      this._state = _STATE_INITIAL;
      this._STATE_INITIAL = 0;
      this._STATE_EVENT_ID = 1;
      this._STATE_FIRING = 2;
      this._STATE_CLOSED = 4;
      this._STATE_ADDSTREAM = 8;
      this._next = null;
      this._previous = null;
      this._addStreamState = null;
      this._doneFuture = null;
      this._next = this._previous = this;
    }
    get stream() { return new _BroadcastStream(this); }
    get sink() { return new _StreamSinkWrapper(this); }
    get isClosed() { return (this._state & _STATE_CLOSED) !== 0; }
    get isPaused() { return false; }
    get hasListener() { return !this._isEmpty; }
    get _hasOneListener() {
      /* Unimplemented AssertStatement: assert (!_isEmpty); */return dart_core.identical(this._next._next, this);
    }
    get _isFiring() { return (this._state & _STATE_FIRING) !== 0; }
    get _isAddingStream() { return (this._state & _STATE_ADDSTREAM) !== 0; }
    get _mayAddEvent() { return (this._state < _STATE_CLOSED); }
    _ensureDoneFuture() {
      if (this._doneFuture !== null) return this._doneFuture;
      return this._doneFuture = new _Future();
    }
    get _isEmpty() { return dart_core.identical(this._next, this); }
    _addListener(subscription) {
      /* Unimplemented AssertStatement: assert (identical(subscription._next, subscription)); */subscription._previous = this._previous;
      subscription._next = this;
      this._previous._next = subscription;
      this._previous = subscription;
      subscription._eventState = (this._state & _STATE_EVENT_ID);
    }
    _removeListener(subscription) {
      /* Unimplemented AssertStatement: assert (identical(subscription._controller, this)); *//* Unimplemented AssertStatement: assert (!identical(subscription._next, subscription)); */let previous = subscription._previous;
      let next = subscription._next;
      previous._next = next;
      next._previous = previous;
      subscription._next = subscription._previous = subscription;
    }
    _subscribe(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      if (this.isClosed) {
        if (onDone === null) onDone = _nullDoneHandler;
        return new _DoneStreamSubscription(onDone);
      }
      let subscription = new _BroadcastSubscription(this, onData, onError, onDone, cancelOnError);
      this._addListener(/* Unimplemented: DownCast: StreamSubscription<dynamic> to _BroadcastSubscription<T> */ subscription);
      if (dart_core.identical(this._next, this._previous)) {
        _runGuarded(this._onListen);
      }
      return /* Unimplemented: DownCastDynamic: StreamSubscription<dynamic> to StreamSubscription<T> */ subscription;
    }
    _recordCancel(subscription) {
      if (dart_core.identical(subscription._next, subscription)) return null;
      /* Unimplemented AssertStatement: assert (!identical(subscription._next, subscription)); */if (subscription._isFiring) {
        subscription._setRemoveAfterFiring();
      }
       else {
        /* Unimplemented AssertStatement: assert (!identical(subscription._next, subscription)); */this._removeListener(subscription);
        if (!this._isFiring && this._isEmpty) {
          this._callOnCancel();
        }
      }
      return null;
    }
    _recordPause(subscription) {
    }
    _recordResume(subscription) {
    }
    _addEventError() {
      if (this.isClosed) {
        return new dart_core.StateError("Cannot add new events after calling close");
      }
      /* Unimplemented AssertStatement: assert (_isAddingStream); */return new dart_core.StateError("Cannot add new events while doing an addStream");
    }
    add(data) {
      if (!this._mayAddEvent) throw this._addEventError();
      _sendData(data);
    }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      error = _nonNullError(error);
      if (!this._mayAddEvent) throw this._addEventError();
      let replacement = Zone.current.errorCallback(error, stackTrace);
      if (replacement !== null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
      }
      _sendError(error, stackTrace);
    }
    close() {
      if (this.isClosed) {
        /* Unimplemented AssertStatement: assert (_doneFuture != null); */return this._doneFuture;
      }
      if (!this._mayAddEvent) throw this._addEventError();
      this._state = _STATE_CLOSED;
      let doneFuture = this._ensureDoneFuture();
      _sendDone();
      return doneFuture;
    }
    get done() { return this._ensureDoneFuture(); }
    addStream(stream, opt$) {
      let cancelOnError = opt$.cancelOnError === undefined ? true : opt$.cancelOnError;
      if (!this._mayAddEvent) throw this._addEventError();
      this._state = _STATE_ADDSTREAM;
      this._addStreamState = /* Unimplemented: DownCastExact: _AddStreamState<dynamic> to _AddStreamState<T> */ new _AddStreamState(this, stream, cancelOnError);
      return this._addStreamState.addStreamFuture;
    }
    _add(data) {
      _sendData(data);
    }
    _addError(error, stackTrace) {
      _sendError(error, stackTrace);
    }
    _close() {
      /* Unimplemented AssertStatement: assert (_isAddingStream); */let addState = this._addStreamState;
      this._addStreamState = null;
      this._state = ~_STATE_ADDSTREAM;
      addState.complete();
    }
    _forEachListener(/* Unimplemented FunctionTypedFormalParameter: void action(_BufferingStreamSubscription<T> subscription) */) {
      if (this._isFiring) {
        throw new dart_core.StateError("Cannot fire new event. Controller is already firing an event");
      }
      if (this._isEmpty) return;
      let id = (this._state & _STATE_EVENT_ID);
      this._state = _STATE_EVENT_ID | _STATE_FIRING;
      let link = this._next;
      while (!dart_core.identical(link, this)) {
        let subscription = /* Unimplemented: DownCast: _BroadcastSubscriptionLink to _BroadcastSubscription<T> */ link;
        if (subscription._expectsEvent(id)) {
          subscription._eventState = _BroadcastSubscription._STATE_FIRING;
          action(subscription);
          subscription._toggleEventId();
          link = subscription._next;
          if (subscription._removeAfterFiring) {
            this._removeListener(subscription);
          }
          subscription._eventState = ~_BroadcastSubscription._STATE_FIRING;
        }
         else {
          link = subscription._next;
        }
      }
      this._state = ~_STATE_FIRING;
      if (this._isEmpty) {
        this._callOnCancel();
      }
    }
    _callOnCancel() {
      /* Unimplemented AssertStatement: assert (_isEmpty); */if (this.isClosed && this._doneFuture._mayComplete) {
        this._doneFuture._asyncComplete(null);
      }
      _runGuarded(this._onCancel);
    }
  }

  class _SyncBroadcastStreamController extends _BroadcastStreamController {
    constructor(/* Unimplemented FunctionTypedFormalParameter: void onListen() */, /* Unimplemented FunctionTypedFormalParameter: void onCancel() */) {
      super(onListen, onCancel);
    }
    _sendData(data) {
      if (_isEmpty) return;
      if (_hasOneListener) {
        _state = _BroadcastStreamController._STATE_FIRING;
        let subscription = /* Unimplemented: DownCast: _BroadcastSubscriptionLink to _BroadcastSubscription<dynamic> */ _next;
        subscription._add(data);
        _state = ~_BroadcastStreamController._STATE_FIRING;
        if (_isEmpty) {
          _callOnCancel();
        }
        return;
      }
      _forEachListener((subscription) => {
        subscription._add(data);
      });
    }
    _sendError(error, stackTrace) {
      if (_isEmpty) return;
      _forEachListener((subscription) => {
        subscription._addError(error, stackTrace);
      });
    }
    _sendDone() {
      if (!_isEmpty) {
        _forEachListener(/* Unimplemented: ClosureWrapLiteral: (_BroadcastSubscription<T>) → dynamic to (_BufferingStreamSubscription<T>) → void */ (subscription) => {
          subscription._close();
        });
      }
       else {
        /* Unimplemented AssertStatement: assert (_doneFuture != null); *//* Unimplemented AssertStatement: assert (_doneFuture._mayComplete); */_doneFuture._asyncComplete(null);
      }
    }
  }

  class _AsyncBroadcastStreamController extends _BroadcastStreamController {
    constructor(/* Unimplemented FunctionTypedFormalParameter: void onListen() */, /* Unimplemented FunctionTypedFormalParameter: void onCancel() */) {
      super(onListen, onCancel);
    }
    _sendData(data) {
      for (let link = _next; !dart_core.identical(link, this); link = link._next) {
        let subscription = /* Unimplemented: DownCast: _BroadcastSubscriptionLink to _BroadcastSubscription<T> */ link;
        subscription._addPending(new _DelayedData(data));
      }
    }
    _sendError(error, stackTrace) {
      for (let link = _next; !dart_core.identical(link, this); link = link._next) {
        let subscription = /* Unimplemented: DownCast: _BroadcastSubscriptionLink to _BroadcastSubscription<T> */ link;
        subscription._addPending(new _DelayedError(error, stackTrace));
      }
    }
    _sendDone() {
      if (!_isEmpty) {
        for (let link = _next; !dart_core.identical(link, this); link = link._next) {
          let subscription = /* Unimplemented: DownCast: _BroadcastSubscriptionLink to _BroadcastSubscription<T> */ link;
          subscription._addPending(new _DelayedDone());
        }
      }
       else {
        /* Unimplemented AssertStatement: assert (_doneFuture != null); *//* Unimplemented AssertStatement: assert (_doneFuture._mayComplete); */_doneFuture._asyncComplete(null);
      }
    }
  }

  class _AsBroadcastStreamController extends _SyncBroadcastStreamController {
    constructor(/* Unimplemented FunctionTypedFormalParameter: void onListen() */, /* Unimplemented FunctionTypedFormalParameter: void onCancel() */) {
      this._pending = null;
      super(onListen, onCancel);
    }
    get _hasPending() { return this._pending !== null && !this._pending.isEmpty; }
    _addPendingEvent(event) {
      if (this._pending === null) {
        this._pending = new _StreamImplEvents();
      }
      this._pending.add(event);
    }
    add(data) {
      if (!isClosed && _isFiring) {
        this._addPendingEvent(new _DelayedData(data));
        return;
      }
      super.add(data);
      while (this._hasPending) {
        this._pending.handleNext(this);
      }
    }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      if (!isClosed && _isFiring) {
        this._addPendingEvent(new _DelayedError(error, stackTrace));
        return;
      }
      if (!_mayAddEvent) throw _addEventError();
      _sendError(error, stackTrace);
      while (this._hasPending) {
        this._pending.handleNext(this);
      }
    }
    close() {
      if (!isClosed && _isFiring) {
        this._addPendingEvent(new _DelayedDone());
        _state = _BroadcastStreamController._STATE_CLOSED;
        return super.done;
      }
      let result = super.close();
      /* Unimplemented AssertStatement: assert (!_hasPending); */return result;
    }
    _callOnCancel() {
      if (this._hasPending) {
        this._pending.clear();
        this._pending = null;
      }
      super._callOnCancel();
    }
  }

  class _DoneSubscription {
    constructor() {
      this._pauseCount = 0;
      super();
    }
    onData(/* Unimplemented FunctionTypedFormalParameter: void handleData(T data) */) {
    }
    onError(handleError) {
    }
    onDone(/* Unimplemented FunctionTypedFormalParameter: void handleDone() */) {
    }
    pause(resumeSignal) {
      if (resumeSignal === undefined) resumeSignal = null;
      if (resumeSignal !== null) resumeSignal.then(this._resume);
      this._pauseCount++;
    }
    resume() {
      this._resume(null);
    }
    _resume(_) {
      if (this._pauseCount > 0) this._pauseCount--;
    }
    cancel() {
      return new _Future.immediate(null);
    }
    get isPaused() { return this._pauseCount > 0; }
    asFuture(value) {
      if (value === undefined) value = null;
      return new _Future()
    }
  }

  class DeferredLibrary {
    constructor(libraryName, opt$) {
      let uri = opt$.uri === undefined ? null : opt$.uri;
      this.libraryName = libraryName;
      this.uri = uri;
    }
    load() {}
  }

  class DeferredLoadException {
    constructor(_s) {
      this._s = _s;
    }
    toString() { return "DeferredLoadException: '" + (this._s) + "'"; }
  }

  class Future {
    constructor(/* Unimplemented FunctionTypedFormalParameter: computation() */) {
      let result = new _Future();
      Timer.run(() => {
        /* Unimplemented TryStatement: try {result._complete(computation());} catch (e, s) {_completeWithErrorCallback(result, e, s);} */});
      return /* Unimplemented: DownCastDynamic: _Future<dynamic> to Future<T> */ result;
    }
    __init_microtask(/* Unimplemented FunctionTypedFormalParameter: computation() */) {
      let result = new _Future();
      scheduleMicrotask(() => {
        /* Unimplemented TryStatement: try {result._complete(computation());} catch (e, s) {_completeWithErrorCallback(result, e, s);} */});
      return /* Unimplemented: DownCastDynamic: _Future<dynamic> to Future<T> */ result;
    }
    __init_sync(/* Unimplemented FunctionTypedFormalParameter: computation() */) {
      /* Unimplemented TryStatement: try {var result = computation(); return new Future<T>.value(result);} catch (error, stackTrace) {return new Future<T>.error(error, stackTrace);} */}
    __init_value(value) {
      if (value === undefined) value = null;
      return new _Future.immediate(value);
    }
    __init_error(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      error = _nonNullError(error);
      if (!dart_core.identical(Zone.current, _ROOT_ZONE)) {
        let replacement = Zone.current.errorCallback(error, stackTrace);
        if (replacement !== null) {
          error = _nonNullError(replacement.error);
          stackTrace = replacement.stackTrace;
        }
      }
      return new _Future.immediateError(error, stackTrace);
    }
    __init_delayed(duration, computation) {
      if (computation === undefined) computation = null;
      let result = new _Future();
      new Timer(duration, () => {
        /* Unimplemented TryStatement: try {result._complete(computation == null ? null : computation());} catch (e, s) {_completeWithErrorCallback(result, e, s);} */});
      return /* Unimplemented: DownCastDynamic: _Future<dynamic> to Future<T> */ result;
    }
    static wait(futures, opt$) {
      let eagerError = opt$.eagerError === undefined ? false : opt$.eagerError;
      let cleanUp = opt$.cleanUp === undefined ? null : opt$.cleanUp;
      let result = new _Future();
      let values = null;
      let remaining = 0;
      let error = null;
      let stackTrace = null;
      /* Unimplemented FunctionDeclarationStatement: void handleError(theError, theStackTrace) {remaining--; if (values != null) {if (cleanUp != null) {for (var value in values) {if (value != null) {new Future.sync(() {cleanUp(value);});}}} values = null; if (remaining == 0 || eagerError) {result._completeError(theError, theStackTrace);} else {error = theError; stackTrace = theStackTrace;}} else if (remaining == 0 && !eagerError) {result._completeError(error, stackTrace);}} *//* Unimplemented ForEachStatement: for (Future future in futures) {int pos = remaining++; future.then((Object value) {remaining--; if (values != null) {values[pos] = value; if (remaining == 0) {result._completeWithValue(values);}} else {if (cleanUp != null && value != null) {new Future.sync(() {cleanUp(value);});} if (remaining == 0 && !eagerError) {result._completeError(error, stackTrace);}}}, onError: handleError);} */if (remaining === 0) {
        return /* Unimplemented: DownCastExact: Future<dynamic> to Future<List<dynamic>> */ new Future.this.value(/* Unimplemented const *//* Unimplemented ArrayList */[]);
      }
      values = new dart_core.List(remaining);
      return result;
    }
    static forEach(input, /* Unimplemented FunctionTypedFormalParameter: f(element) */) {
      let iterator = input.iterator;
      return doWhile(() => {
        if (!iterator.moveNext()) return false;
        return new Future.this.sync(() => f(iterator.current)).this.then((_) => true);
      });
    }
    static doWhile(/* Unimplemented FunctionTypedFormalParameter: f() */) {
      let doneSignal = new _Future();
      let nextIteration = null;
      nextIteration = Zone.current.bindUnaryCallback(/* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (keepGoing) => {
        if (keepGoing) {
          new Future.this.sync(f).this.then(/* Unimplemented: DownCast: dynamic to (dynamic) → dynamic */ nextIteration, /* Unimplemented NamedExpression: onError: doneSignal._completeError */);
        }
         else {
          doneSignal._complete(null);
        }
      }, /* Unimplemented NamedExpression: runGuarded: true */);
      /* Unimplemented MethodInvocation: nextIteration(true) */;
      return doneSignal;
    }
  }
  Future.microtask = function(/* Unimplemented FunctionTypedFormalParameter: computation() */) { this.__init_microtask(/* Unimplemented FunctionTypedFormalParameter: computation() */) };
  Future.microtask.prototype = Future.prototype;
  Future.sync = function(/* Unimplemented FunctionTypedFormalParameter: computation() */) { this.__init_sync(/* Unimplemented FunctionTypedFormalParameter: computation() */) };
  Future.sync.prototype = Future.prototype;
  Future.value = function(value) { this.__init_value(value) };
  Future.value.prototype = Future.prototype;
  Future.error = function(error, stackTrace) { this.__init_error(error, stackTrace) };
  Future.error.prototype = Future.prototype;
  Future.delayed = function(duration, computation) { this.__init_delayed(duration, computation) };
  Future.delayed.prototype = Future.prototype;

  class TimeoutException {
    constructor(message, duration) {
      if (duration === undefined) duration = null;
      this.message = message;
      this.duration = duration;
    }
    toString() {
      let result = "TimeoutException";
      if (this.duration !== null) result = "TimeoutException after " + (this.duration) + "";
      if (this.message !== null) result = "" + (result) + ": " + (this.message) + "";
      return result;
    }
  }

  class Completer {
    constructor() {
      return new _AsyncCompleter();
    }
    __init_sync() {
      return new _SyncCompleter();
    }
  }
  Completer.sync = function() { this.__init_sync() };
  Completer.sync.prototype = Completer.prototype;

  // Function _completeWithErrorCallback: (_Future<dynamic>, dynamic, dynamic) → void
  function _completeWithErrorCallback(result, error, stackTrace) {
    let replacement = Zone.current.errorCallback(error, /* Unimplemented: DownCast: dynamic to StackTrace */ stackTrace);
    if (replacement !== null) {
      error = _nonNullError(replacement.error);
      stackTrace = replacement.stackTrace;
    }
    result._completeError(error, /* Unimplemented: DownCast: dynamic to StackTrace */ stackTrace);
  }

  // Function _nonNullError: (Object) → Object
  function _nonNullError(error) { return (error !== null) ? error : new dart_core.NullThrownError(); }

  class _Completer {
    constructor() {
      this.future = new _Future();
      super();
    }
    completeError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      error = _nonNullError(error);
      if (!this.future._mayComplete) throw new dart_core.StateError("Future already completed");
      let replacement = Zone.current.errorCallback(error, stackTrace);
      if (replacement !== null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
      }
      this._completeError(error, stackTrace);
    }
    get isCompleted() { return !this.future._mayComplete; }
  }

  class _AsyncCompleter extends _Completer {
    complete(value) {
      if (value === undefined) value = null;
      if (!future._mayComplete) throw new dart_core.StateError("Future already completed");
      future._asyncComplete(value);
    }
    _completeError(error, stackTrace) {
      future._asyncCompleteError(error, stackTrace);
    }
  }

  class _SyncCompleter extends _Completer {
    complete(value) {
      if (value === undefined) value = null;
      if (!future._mayComplete) throw new dart_core.StateError("Future already completed");
      future._complete(value);
    }
    _completeError(error, stackTrace) {
      future._completeError(error, stackTrace);
    }
  }

  class _FutureListener {
    __init_then(result, onValue, errorCallback) {
      this.result = result;
      this.callback = onValue;
      this.errorCallback = errorCallback;
      this.state = (errorCallback === null) ? STATE_THEN : STATE_THEN_ONERROR;
      this.MASK_VALUE = 1;
      this.MASK_ERROR = 2;
      this.MASK_TEST_ERROR = 4;
      this.MASK_WHENCOMPLETE = 8;
      this.STATE_CHAIN = 0;
      this.STATE_THEN = MASK_VALUE;
      this.STATE_THEN_ONERROR = MASK_VALUE | MASK_ERROR;
      this.STATE_CATCHERROR = MASK_ERROR;
      this.STATE_CATCHERROR_TEST = MASK_ERROR | MASK_TEST_ERROR;
      this.STATE_WHENCOMPLETE = MASK_WHENCOMPLETE;
      this._nextListener = null;
    }
    __init_catchError(result, errorCallback, test) {
      this.result = result;
      this.errorCallback = errorCallback;
      this.callback = test;
      this.state = (test === null) ? STATE_CATCHERROR : STATE_CATCHERROR_TEST;
      this.MASK_VALUE = 1;
      this.MASK_ERROR = 2;
      this.MASK_TEST_ERROR = 4;
      this.MASK_WHENCOMPLETE = 8;
      this.STATE_CHAIN = 0;
      this.STATE_THEN = MASK_VALUE;
      this.STATE_THEN_ONERROR = MASK_VALUE | MASK_ERROR;
      this.STATE_CATCHERROR = MASK_ERROR;
      this.STATE_CATCHERROR_TEST = MASK_ERROR | MASK_TEST_ERROR;
      this.STATE_WHENCOMPLETE = MASK_WHENCOMPLETE;
      this._nextListener = null;
    }
    __init_whenComplete(result, onComplete) {
      this.result = result;
      this.callback = onComplete;
      this.errorCallback = null;
      this.state = STATE_WHENCOMPLETE;
      this.MASK_VALUE = 1;
      this.MASK_ERROR = 2;
      this.MASK_TEST_ERROR = 4;
      this.MASK_WHENCOMPLETE = 8;
      this.STATE_CHAIN = 0;
      this.STATE_THEN = MASK_VALUE;
      this.STATE_THEN_ONERROR = MASK_VALUE | MASK_ERROR;
      this.STATE_CATCHERROR = MASK_ERROR;
      this.STATE_CATCHERROR_TEST = MASK_ERROR | MASK_TEST_ERROR;
      this.STATE_WHENCOMPLETE = MASK_WHENCOMPLETE;
      this._nextListener = null;
    }
    __init_chain(result) {
      this.result = result;
      this.callback = null;
      this.errorCallback = null;
      this.state = STATE_CHAIN;
      this.MASK_VALUE = 1;
      this.MASK_ERROR = 2;
      this.MASK_TEST_ERROR = 4;
      this.MASK_WHENCOMPLETE = 8;
      this.STATE_CHAIN = 0;
      this.STATE_THEN = MASK_VALUE;
      this.STATE_THEN_ONERROR = MASK_VALUE | MASK_ERROR;
      this.STATE_CATCHERROR = MASK_ERROR;
      this.STATE_CATCHERROR_TEST = MASK_ERROR | MASK_TEST_ERROR;
      this.STATE_WHENCOMPLETE = MASK_WHENCOMPLETE;
      this._nextListener = null;
    }
    get _zone() { return this.result._zone; }
    get handlesValue() { return (this.state & MASK_VALUE !== 0); }
    get handlesError() { return (this.state & MASK_ERROR !== 0); }
    get hasErrorTest() { return (this.state === STATE_CATCHERROR_TEST); }
    get handlesComplete() { return (this.state === STATE_WHENCOMPLETE); }
    get _onValue() {
      /* Unimplemented AssertStatement: assert (handlesValue); */return /* Unimplemented: DownCast: Function to (dynamic) → dynamic */ this.callback;
    }
    get _onError() { return this.errorCallback; }
    get _errorTest() {
      /* Unimplemented AssertStatement: assert (hasErrorTest); */return /* Unimplemented: DownCast: Function to (dynamic) → bool */ this.callback;
    }
    get _whenCompleteAction() {
      /* Unimplemented AssertStatement: assert (handlesComplete); */return /* Unimplemented: DownCast: Function to () → dynamic */ this.callback;
    }
  }
  _FutureListener.then = function(result, onValue, errorCallback) { this.__init_then(result, onValue, errorCallback) };
  _FutureListener.then.prototype = _FutureListener.prototype;
  _FutureListener.catchError = function(result, errorCallback, test) { this.__init_catchError(result, errorCallback, test) };
  _FutureListener.catchError.prototype = _FutureListener.prototype;
  _FutureListener.whenComplete = function(result, onComplete) { this.__init_whenComplete(result, onComplete) };
  _FutureListener.whenComplete.prototype = _FutureListener.prototype;
  _FutureListener.chain = function(result) { this.__init_chain(result) };
  _FutureListener.chain.prototype = _FutureListener.prototype;

  class _Future {
    constructor() {
      this._zone = Zone.current;
      this._INCOMPLETE = 0;
      this._PENDING_COMPLETE = 1;
      this._CHAINED = 2;
      this._VALUE = 4;
      this._ERROR = 8;
      this._state = _INCOMPLETE;
      this._resultOrListeners = null;
    }
    __init_immediate(value) {
      this._zone = Zone.current;
      this._INCOMPLETE = 0;
      this._PENDING_COMPLETE = 1;
      this._CHAINED = 2;
      this._VALUE = 4;
      this._ERROR = 8;
      this._state = _INCOMPLETE;
      this._resultOrListeners = null;
      this._asyncComplete(value);
    }
    __init_immediateError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      this._zone = Zone.current;
      this._INCOMPLETE = 0;
      this._PENDING_COMPLETE = 1;
      this._CHAINED = 2;
      this._VALUE = 4;
      this._ERROR = 8;
      this._state = _INCOMPLETE;
      this._resultOrListeners = null;
      this._asyncCompleteError(error, stackTrace);
    }
    get _mayComplete() { return this._state === _INCOMPLETE; }
    get _isChained() { return this._state === _CHAINED; }
    get _isComplete() { return this._state >= _VALUE; }
    get _hasValue() { return this._state === _VALUE; }
    get _hasError() { return this._state === _ERROR; }
    set _isChained(value) {
      if (value) {
        /* Unimplemented AssertStatement: assert (!_isComplete); */this._state = _CHAINED;
      }
       else {
        /* Unimplemented AssertStatement: assert (_isChained); */this._state = _INCOMPLETE;
      }
    }
    then(/* Unimplemented FunctionTypedFormalParameter: f(T value) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let result = new _Future();
      if (!dart_core.identical(result._zone, _ROOT_ZONE)) {
        f = result._zone.registerUnaryCallback(/* Unimplemented: ClosureWrap: (T) → dynamic to (dynamic) → dynamic */ f);
        if (onError !== null) {
          onError = _registerErrorHandler(onError, result._zone);
        }
      }
      this._addListener(new _FutureListener.then(result, f, onError));
      return result;
    }
    catchError(onError, opt$) {
      let test = opt$.test === undefined ? null : opt$.test;
      let result = new _Future();
      if (!dart_core.identical(result._zone, _ROOT_ZONE)) {
        onError = _registerErrorHandler(onError, result._zone);
        if (test !== null) test = /* Unimplemented: ClosureWrap: (dynamic) → dynamic to (dynamic) → bool */ result._zone.registerUnaryCallback(test);
      }
      this._addListener(new _FutureListener.catchError(result, onError, test));
      return result;
    }
    whenComplete(/* Unimplemented FunctionTypedFormalParameter: action() */) {
      let result = new _Future();
      if (!dart_core.identical(result._zone, _ROOT_ZONE)) {
        action = result._zone.registerCallback(action);
      }
      this._addListener(new _FutureListener.whenComplete(result, action));
      return /* Unimplemented: DownCastDynamic: _Future<dynamic> to Future<T> */ result;
    }
    asStream() { return /* Unimplemented: DownCastExact: Stream<dynamic> to Stream<T> */ new Stream.fromFuture(this); }
    _markPendingCompletion() {
      if (!this._mayComplete) throw new dart_core.StateError("Future already completed");
      this._state = _PENDING_COMPLETE;
    }
    get _value() {
      /* Unimplemented AssertStatement: assert (_isComplete && _hasValue); */return /* Unimplemented: DownCast: dynamic to T */ this._resultOrListeners;
    }
    get _error() {
      /* Unimplemented AssertStatement: assert (_isComplete && _hasError); */return /* Unimplemented: DownCast: dynamic to AsyncError */ this._resultOrListeners;
    }
    _setValue(value) {
      /* Unimplemented AssertStatement: assert (!_isComplete); */this._state = _VALUE;
      this._resultOrListeners = value;
    }
    _setErrorObject(error) {
      /* Unimplemented AssertStatement: assert (!_isComplete); */this._state = _ERROR;
      this._resultOrListeners = error;
    }
    _setError(error, stackTrace) {
      this._setErrorObject(new AsyncError(error, stackTrace));
    }
    _addListener(listener) {
      /* Unimplemented AssertStatement: assert (listener._nextListener == null); */if (this._isComplete) {
        this._zone.scheduleMicrotask(() => {
          _propagateToListeners(this, listener);
        });
      }
       else {
        listener._nextListener = /* Unimplemented: DownCast: dynamic to _FutureListener */ this._resultOrListeners;
        this._resultOrListeners = listener;
      }
    }
    _removeListeners() {
      /* Unimplemented AssertStatement: assert (!_isComplete); */let current = /* Unimplemented: DownCast: dynamic to _FutureListener */ this._resultOrListeners;
      this._resultOrListeners = null;
      let prev = null;
      while (current !== null) {
        let next = current._nextListener;
        current._nextListener = prev;
        prev = current;
        current = next;
      }
      return prev;
    }
    static _chainForeignFuture(source, target) {
      /* Unimplemented AssertStatement: assert (!target._isComplete); *//* Unimplemented AssertStatement: assert (source is! _Future); */target._isChained = true;
      source.then((value) => {
        /* Unimplemented AssertStatement: assert (target._isChained); */target.this._completeWithValue(value);
      }, /* Unimplemented NamedExpression: onError: (error, [stackTrace]) {assert (target._isChained); target._completeError(error, stackTrace);} */);
    }
    static _chainCoreFuture(source, target) {
      /* Unimplemented AssertStatement: assert (!target._isComplete); *//* Unimplemented AssertStatement: assert (source is _Future); */target._isChained = true;
      let listener = new _FutureListener.chain(target);
      if (source._isComplete) {
        _propagateToListeners(source, listener);
      }
       else {
        source.this._addListener(listener);
      }
    }
    _complete(value) {
      /* Unimplemented AssertStatement: assert (!_isComplete); */if (/* Unimplemented IsExpression: value is Future */) {
        if (/* Unimplemented IsExpression: value is _Future */) {
          _chainCoreFuture(/* Unimplemented: DownCast: dynamic to _Future<dynamic> */ value, this);
        }
         else {
          _chainForeignFuture(/* Unimplemented: DownCast: dynamic to Future<dynamic> */ value, this);
        }
      }
       else {
        let listeners = this._removeListeners();
        this._setValue(/* Unimplemented: DownCast: dynamic to T */ value);
        _propagateToListeners(this, listeners);
      }
    }
    _completeWithValue(value) {
      /* Unimplemented AssertStatement: assert (!_isComplete); *//* Unimplemented AssertStatement: assert (value is! Future); */let listeners = this._removeListeners();
      this._setValue(/* Unimplemented: DownCast: dynamic to T */ value);
      _propagateToListeners(this, listeners);
    }
    _completeError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      /* Unimplemented AssertStatement: assert (!_isComplete); */let listeners = this._removeListeners();
      this._setError(error, stackTrace);
      _propagateToListeners(this, listeners);
    }
    _asyncComplete(value) {
      /* Unimplemented AssertStatement: assert (!_isComplete); */if (value === null) {
      }
       else if (/* Unimplemented IsExpression: value is Future */) {
        let typedFuture = /* Unimplemented: DownCast: dynamic to Future<T> */ value;
        if (/* Unimplemented IsExpression: typedFuture is _Future */) {
          let coreFuture = /* Unimplemented: DownCast: Future<T> to _Future<T> */ typedFuture;
          if (coreFuture._isComplete && coreFuture._hasError) {
            this._markPendingCompletion();
            this._zone.scheduleMicrotask(() => {
              _chainCoreFuture(coreFuture, this);
            });
          }
           else {
            _chainCoreFuture(coreFuture, this);
          }
        }
         else {
          _chainForeignFuture(typedFuture, this);
        }
        return;
      }
       else {
        let typedValue = /* Unimplemented: DownCast: dynamic to T */ value;
      }
      this._markPendingCompletion();
      this._zone.scheduleMicrotask(() => {
        this._completeWithValue(value);
      });
    }
    _asyncCompleteError(error, stackTrace) {
      /* Unimplemented AssertStatement: assert (!_isComplete); */this._markPendingCompletion();
      this._zone.scheduleMicrotask(() => {
        this._completeError(error, stackTrace);
      });
    }
    static _propagateToListeners(source, listeners) {
      while (true) {
        /* Unimplemented AssertStatement: assert (source._isComplete); */let hasError = source._hasError;
        if (listeners === null) {
          if (hasError) {
            let asyncError = source._error;
            source._zone.handleUncaughtError(asyncError.error, asyncError.stackTrace);
          }
          return;
        }
        while (listeners._nextListener !== null) {
          let listener = listeners;
          listeners = listener._nextListener;
          listener._nextListener = null;
          _propagateToListeners(source, listener);
        }
        let listener = listeners;
        let listenerHasValue = true;
        let sourceValue = hasError ? null : source._value;
        let listenerValueOrError = sourceValue;
        let isPropagationAborted = false;
        if (hasError || (listener.handlesValue || listener.handlesComplete)) {
          let zone = listener._zone;
          if (hasError && !source._zone.inSameErrorZone(zone)) {
            let asyncError = source._error;
            source._zone.handleUncaughtError(asyncError.error, asyncError.stackTrace);
            return;
          }
          let oldZone = null;
          if (!dart_core.identical(Zone.current, zone)) {
            oldZone = Zone._enter(zone);
          }
          /* Unimplemented FunctionDeclarationStatement: bool handleValueCallback() {try {listenerValueOrError = zone.runUnary(listener._onValue, sourceValue); return true;} catch (e, s) {listenerValueOrError = new AsyncError(e, s); return false;}} *//* Unimplemented FunctionDeclarationStatement: void handleError() {AsyncError asyncError = source._error; bool matchesTest = true; if (listener.hasErrorTest) {_FutureErrorTest test = listener._errorTest; try {matchesTest = zone.runUnary(test, asyncError.error);} catch (e, s) {listenerValueOrError = identical(asyncError.error, e) ? asyncError : new AsyncError(e, s); listenerHasValue = false; return;}} Function errorCallback = listener._onError; if (matchesTest && errorCallback != null) {try {if (errorCallback is ZoneBinaryCallback) {listenerValueOrError = zone.runBinary(errorCallback, asyncError.error, asyncError.stackTrace);} else {listenerValueOrError = zone.runUnary(errorCallback, asyncError.error);}} catch (e, s) {listenerValueOrError = identical(asyncError.error, e) ? asyncError : new AsyncError(e, s); listenerHasValue = false; return;} listenerHasValue = true;} else {listenerValueOrError = asyncError; listenerHasValue = false;}} *//* Unimplemented FunctionDeclarationStatement: void handleWhenCompleteCallback() {var completeResult; try {completeResult = zone.run(listener._whenCompleteAction);} catch (e, s) {if (hasError && identical(source._error.error, e)) {listenerValueOrError = source._error;} else {listenerValueOrError = new AsyncError(e, s);} listenerHasValue = false; return;} if (completeResult is Future) {_Future result = listener.result; result._isChained = true; isPropagationAborted = true; completeResult.then((ignored) {_propagateToListeners(source, new _FutureListener.chain(result));}, onError: (error, [stackTrace]) {if (completeResult is! _Future) {completeResult = new _Future(); completeResult._setError(error, stackTrace);} _propagateToListeners(completeResult, new _FutureListener.chain(result));});}} */if (!hasError) {
            if (listener.handlesValue) {
              listenerHasValue = handleValueCallback();
            }
          }
           else {
            handleError();
          }
          if (listener.handlesComplete) {
            handleWhenCompleteCallback();
          }
          if (oldZone !== null) Zone._leave(oldZone);
          if (isPropagationAborted) return;
          if (listenerHasValue && !dart_core.identical(sourceValue, listenerValueOrError) && /* Unimplemented IsExpression: listenerValueOrError is Future */) {
            let chainSource = /* Unimplemented: DownCast: dynamic to Future<dynamic> */ listenerValueOrError;
            let result = listener.result;
            if (/* Unimplemented IsExpression: chainSource is _Future */) {
              if (chainSource._isComplete) {
                result._isChained = true;
                source = /* Unimplemented: DownCast: Future<dynamic> to _Future<dynamic> */ chainSource;
                listeners = new _FutureListener.chain(result);
                /* Unimplemented ContinueStatement: continue; */}
               else {
                _chainCoreFuture(/* Unimplemented: DownCast: Future<dynamic> to _Future<dynamic> */ chainSource, result);
              }
            }
             else {
              _chainForeignFuture(chainSource, result);
            }
            return;
          }
        }
        let result = listener.result;
        listeners = result.this._removeListeners();
        if (listenerHasValue) {
          result.this._setValue(listenerValueOrError);
        }
         else {
          let asyncError = /* Unimplemented: DownCast: dynamic to AsyncError */ listenerValueOrError;
          result.this._setErrorObject(asyncError);
        }
        source = result;
      }
    }
    timeout(timeLimit, opt$) {
      let onTimeout = opt$.onTimeout === undefined ? null : opt$.onTimeout;
      if (this._isComplete) return new _Future.this.immediate(this);
      let result = new _Future();
      let timer = null;
      if (onTimeout === null) {
        timer = new Timer(timeLimit, () => {
          result.this._completeError(new TimeoutException("Future not completed", timeLimit));
        });
      }
       else {
        let zone = Zone.current;
        onTimeout = zone.registerCallback(onTimeout);
        timer = new Timer(timeLimit, () => {
          /* Unimplemented TryStatement: try {result._complete(zone.run(onTimeout));} catch (e, s) {result._completeError(e, s);} */});
      }
      this.this.then((v) => {
        if (timer.isActive) {
          timer.cancel();
          result.this._completeWithValue(v);
        }
      }, /* Unimplemented NamedExpression: onError: (e, s) {if (timer.isActive) {timer.cancel(); result._completeError(e, s);}} */);
      return result;
    }
  }
  _Future.immediate = function(value) { this.__init_immediate(value) };
  _Future.immediate.prototype = _Future.prototype;
  _Future.immediateError = function(error, stackTrace) { this.__init_immediateError(error, stackTrace) };
  _Future.immediateError.prototype = _Future.prototype;

  class _AsyncCallbackEntry {
    constructor(callback) {
      this.callback = callback;
      this.next = null;
    }
  }

  dart.async._nextCallback = null;
  dart.async._lastCallback = null;
  dart.async._lastPriorityCallback = null;
  dart.async._isInCallbackLoop = false;
  // Function _asyncRunCallbackLoop: () → void
  function _asyncRunCallbackLoop() {
    while (dart.async._nextCallback !== null) {
      dart.async._lastPriorityCallback = null;
      let entry = dart.async._nextCallback;
      dart.async._nextCallback = entry.next;
      if (dart.async._nextCallback === null) dart.async._lastCallback = null;
      entry.callback();
    }
  }

  // Function _asyncRunCallback: () → void
  function _asyncRunCallback() {
    dart.async._isInCallbackLoop = true;
    /* Unimplemented TryStatement: try {_asyncRunCallbackLoop();} finally {_lastPriorityCallback = null; _isInCallbackLoop = false; if (_nextCallback != null) _AsyncRun._scheduleImmediate(_asyncRunCallback);} */}

  // Function _scheduleAsyncCallback: (dynamic) → void
  function _scheduleAsyncCallback(callback) {
    if (dart.async._nextCallback === null) {
      dart.async._nextCallback = dart.async._lastCallback = new _AsyncCallbackEntry(callback);
      if (!dart.async._isInCallbackLoop) {
        _AsyncRun._scheduleImmediate(_asyncRunCallback);
      }
    }
     else {
      let newEntry = new _AsyncCallbackEntry(callback);
      dart.async._lastCallback.next = newEntry;
      dart.async._lastCallback = newEntry;
    }
  }

  // Function _schedulePriorityAsyncCallback: (dynamic) → void
  function _schedulePriorityAsyncCallback(callback) {
    let entry = new _AsyncCallbackEntry(callback);
    if (dart.async._nextCallback === null) {
      _scheduleAsyncCallback(callback);
      dart.async._lastPriorityCallback = dart.async._lastCallback;
    }
     else if (dart.async._lastPriorityCallback === null) {
      entry.next = dart.async._nextCallback;
      dart.async._nextCallback = dart.async._lastPriorityCallback = entry;
    }
     else {
      entry.next = dart.async._lastPriorityCallback.next;
      dart.async._lastPriorityCallback.next = entry;
      dart.async._lastPriorityCallback = entry;
      if (entry.next === null) {
        dart.async._lastCallback = entry;
      }
    }
  }

  // Function scheduleMicrotask: (() → void) → void
  function scheduleMicrotask(/* Unimplemented FunctionTypedFormalParameter: void callback() */) {
    if (dart_core.identical(_ROOT_ZONE, Zone.current)) {
      _rootScheduleMicrotask(null, null, /* Unimplemented: DownCast: dynamic to Zone */ _ROOT_ZONE, callback);
      return;
    }
    Zone.current.scheduleMicrotask(Zone.current.bindCallback(callback, /* Unimplemented NamedExpression: runGuarded: true */));
  }

  class _AsyncRun {
    static _scheduleImmediate(/* Unimplemented FunctionTypedFormalParameter: void callback() */) {}
  }

  class Stream {
    constructor() {
    }
    __init_fromFuture(future) {
      let controller = /* Unimplemented: DownCastExact: StreamController<T> to _StreamController<T> */ new StreamController(/* Unimplemented NamedExpression: sync: true */);
      future.then((value) => {
        controller._add(/* Unimplemented: DownCast: dynamic to T */ value);
        controller._closeUnchecked();
      }, /* Unimplemented NamedExpression: onError: (error, stackTrace) {controller._addError(error, stackTrace); controller._closeUnchecked();} */);
      return controller.stream;
    }
    __init_fromIterable(data) {
      return new _GeneratedStreamImpl(() => new _IterablePendingEvents(data));
    }
    __init_periodic(period, computation) {
      if (computation === undefined) computation = null;
      if (computation === null) computation = ((i) => null);
      let timer = null;
      let computationCount = 0;
      let controller = null;
      let watch = new dart_core.Stopwatch();
      /* Unimplemented FunctionDeclarationStatement: void sendEvent() {watch.reset(); T data = computation(computationCount++); controller.add(data);} *//* Unimplemented FunctionDeclarationStatement: void startPeriodicTimer() {assert (timer == null); timer = new Timer.periodic(period, (Timer timer) {sendEvent();});} */controller = new StreamController(/* Unimplemented NamedExpression: sync: true */, /* Unimplemented NamedExpression: onListen: () {watch.start(); startPeriodicTimer();} */, /* Unimplemented NamedExpression: onPause: () {timer.cancel(); timer = null; watch.stop();} */, /* Unimplemented NamedExpression: onResume: () {assert (timer == null); Duration elapsed = watch.elapsed; watch.start(); timer = new Timer(period - elapsed, () {timer = null; startPeriodicTimer(); sendEvent();});} */, /* Unimplemented NamedExpression: onCancel: () {if (timer != null) timer.cancel(); timer = null;} */);
      return controller.stream;
    }
    __init_eventTransformed(source, /* Unimplemented FunctionTypedFormalParameter: EventSink mapSink(EventSink<T> sink) */) {
      return /* Unimplemented: DownCastExact: _BoundSinkStream<dynamic, dynamic> to Stream<T> */ new _BoundSinkStream(source, mapSink);
    }
    get isBroadcast() { return false; }
    asBroadcastStream(opt$) {
      let onListen = opt$.onListen === undefined ? null : opt$.onListen;
      let onCancel = opt$.onCancel === undefined ? null : opt$.onCancel;
      return new _AsBroadcastStream(this, onListen, onCancel);
    }
    where(/* Unimplemented FunctionTypedFormalParameter: bool test(T event) */) {
      return new _WhereStream(this, test);
    }
    map(/* Unimplemented FunctionTypedFormalParameter: convert(T event) */) {
      return new _MapStream(this, convert);
    }
    asyncMap(/* Unimplemented FunctionTypedFormalParameter: convert(T event) */) {
      let controller = null;
      let subscription = null;
      /* Unimplemented FunctionDeclarationStatement: void onListen() {final add = controller.add; assert (controller is _StreamController || controller is _BroadcastStreamController); final eventSink = controller; final addError = eventSink._addError; subscription = this.listen((T event) {var newValue; try {newValue = convert(event);} catch (e, s) {controller.addError(e, s); return;} if (newValue is Future) {subscription.pause(); newValue.then(add, onError: addError).whenComplete(subscription.resume);} else {controller.add(newValue);}}, onError: addError, onDone: controller.close);} */if (this.isBroadcast) {
        controller = new StreamController.broadcast(/* Unimplemented NamedExpression: onListen: onListen */, /* Unimplemented NamedExpression: onCancel: () {subscription.cancel();} */, /* Unimplemented NamedExpression: sync: true */);
      }
       else {
        controller = new StreamController(/* Unimplemented NamedExpression: onListen: onListen */, /* Unimplemented NamedExpression: onPause: () {subscription.pause();} */, /* Unimplemented NamedExpression: onResume: () {subscription.resume();} */, /* Unimplemented NamedExpression: onCancel: () {subscription.cancel();} */, /* Unimplemented NamedExpression: sync: true */);
      }
      return controller.stream;
    }
    asyncExpand(/* Unimplemented FunctionTypedFormalParameter: Stream convert(T event) */) {
      let controller = null;
      let subscription = null;
      /* Unimplemented FunctionDeclarationStatement: void onListen() {assert (controller is _StreamController || controller is _BroadcastStreamController); final eventSink = controller; subscription = this.listen((T event) {Stream newStream; try {newStream = convert(event);} catch (e, s) {controller.addError(e, s); return;} if (newStream != null) {subscription.pause(); controller.addStream(newStream).whenComplete(subscription.resume);}}, onError: eventSink._addError, onDone: controller.close);} */if (this.isBroadcast) {
        controller = new StreamController.broadcast(/* Unimplemented NamedExpression: onListen: onListen */, /* Unimplemented NamedExpression: onCancel: () {subscription.cancel();} */, /* Unimplemented NamedExpression: sync: true */);
      }
       else {
        controller = new StreamController(/* Unimplemented NamedExpression: onListen: onListen */, /* Unimplemented NamedExpression: onPause: () {subscription.pause();} */, /* Unimplemented NamedExpression: onResume: () {subscription.resume();} */, /* Unimplemented NamedExpression: onCancel: () {subscription.cancel();} */, /* Unimplemented NamedExpression: sync: true */);
      }
      return controller.stream;
    }
    handleError(onError, opt$) {
      let test = opt$.test === undefined ? null : opt$.test;
      return new _HandleErrorStream(this, onError, test);
    }
    expand(/* Unimplemented FunctionTypedFormalParameter: Iterable convert(T value) */) {
      return new _ExpandStream(this, convert);
    }
    pipe(streamConsumer) {
      return streamConsumer.addStream(this).then((_) => streamConsumer.close());
    }
    transform(streamTransformer) {
      return streamTransformer.bind(this);
    }
    reduce(/* Unimplemented FunctionTypedFormalParameter: T combine(T previous, T element) */) {
      let result = new _Future();
      let seenFirst = false;
      let value = null;
      let subscription = null;
      subscription = this.this.listen((element) => {
        if (seenFirst) {
          _runUserCode(() => combine(value, element), /* Unimplemented: ClosureWrapLiteral: (T) → dynamic to (dynamic) → dynamic */ (newValue) => {
            value = newValue;
          }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, result));
        }
         else {
          value = element;
          seenFirst = true;
        }
      }, /* Unimplemented NamedExpression: onError: result._completeError */, /* Unimplemented NamedExpression: onDone: () {if (!seenFirst) {try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(result, e, s);}} else {result._complete(value);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return result;
    }
    fold(initialValue, /* Unimplemented FunctionTypedFormalParameter: combine(var previous, T element) */) {
      let result = new _Future();
      let value = initialValue;
      let subscription = null;
      subscription = this.this.listen((element) => {
        _runUserCode(() => combine(value, element), (newValue) => {
          value = newValue;
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, result));
      }, /* Unimplemented NamedExpression: onError: (e, st) {result._completeError(e, st);} */, /* Unimplemented NamedExpression: onDone: () {result._complete(value);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return result;
    }
    join(separator) {
      if (separator === undefined) separator = "";
      let result = new _Future();
      let buffer = new dart_core.StringBuffer();
      let subscription = null;
      let first = true;
      subscription = this.this.listen((element) => {
        if (!first) {
          buffer.write(separator);
        }
        first = false;
        /* Unimplemented TryStatement: try {buffer.write(element);} catch (e, s) {_cancelAndErrorWithReplacement(subscription, result, e, s);} */}, /* Unimplemented NamedExpression: onError: (e) {result._completeError(e);} */, /* Unimplemented NamedExpression: onDone: () {result._complete(buffer.toString());} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return result;
    }
    contains(needle) {
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((element) => {
        _runUserCode(() => (dart.equals(element, needle)), /* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (isMatch) => {
          if (isMatch) {
            _cancelAndValue(subscription, future, true);
          }
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(false);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    forEach(/* Unimplemented FunctionTypedFormalParameter: void action(T element) */) {
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((element) => {
        _runUserCode(() => action(element), (_) => {
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(null);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    every(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */) {
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((element) => {
        _runUserCode(() => test(element), /* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (isMatch) => {
          if (!isMatch) {
            _cancelAndValue(subscription, future, false);
          }
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(true);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    any(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */) {
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((element) => {
        _runUserCode(() => test(element), /* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (isMatch) => {
          if (isMatch) {
            _cancelAndValue(subscription, future, true);
          }
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(false);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    get length() {
      let future = new _Future();
      let count = 0;
      this.this.listen((_) => {
        count++;
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(count);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    get isEmpty() {
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((_) => {
        _cancelAndValue(subscription, future, false);
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(true);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    toList() {
      let result = /* Unimplemented ArrayList */[];
      let future = new _Future();
      this.this.listen((data) => {
        result.add(data);
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(result);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    toSet() {
      let result = new dart_core.Set();
      let future = new _Future();
      this.this.listen((data) => {
        result.add(data);
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._complete(result);} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    drain(futureValue) {
      if (futureValue === undefined) futureValue = null;
      return this.listen(null, /* Unimplemented NamedExpression: cancelOnError: true */).asFuture(futureValue)
    }
    take(count) {
      return /* Unimplemented: DownCastExact: _TakeStream<dynamic> to Stream<T> */ new _TakeStream(this, count);
    }
    takeWhile(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */) {
      return /* Unimplemented: DownCastExact: _TakeWhileStream<dynamic> to Stream<T> */ new _TakeWhileStream(this, test);
    }
    skip(count) {
      return /* Unimplemented: DownCastExact: _SkipStream<dynamic> to Stream<T> */ new _SkipStream(this, count);
    }
    skipWhile(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */) {
      return /* Unimplemented: DownCastExact: _SkipWhileStream<dynamic> to Stream<T> */ new _SkipWhileStream(this, test);
    }
    distinct(equals) {
      if (equals === undefined) equals = null;
      return /* Unimplemented: DownCastExact: _DistinctStream<dynamic> to Stream<T> */ new _DistinctStream(this, equals);
    }
    get first() {
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((value) => {
        _cancelAndValue(subscription, future, value);
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(future, e, s);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    get last() {
      let future = new _Future();
      let result = null;
      let foundResult = false;
      let subscription = null;
      subscription = this.this.listen((value) => {
        foundResult = true;
        result = value;
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {if (foundResult) {future._complete(result); return;} try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(future, e, s);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    get single() {
      let future = new _Future();
      let result = null;
      let foundResult = false;
      let subscription = null;
      subscription = this.this.listen((value) => {
        if (foundResult) {
          /* Unimplemented TryStatement: try {throw IterableElementError.tooMany();} catch (e, s) {_cancelAndErrorWithReplacement(subscription, future, e, s);} */return;
        }
        foundResult = true;
        result = value;
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {if (foundResult) {future._complete(result); return;} try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(future, e, s);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    firstWhere(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */, opt$) {
      let defaultValue = opt$.defaultValue === undefined ? null : opt$.defaultValue;
      let future = new _Future();
      let subscription = null;
      subscription = this.this.listen((value) => {
        _runUserCode(() => test(value), /* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (isMatch) => {
          if (isMatch) {
            _cancelAndValue(subscription, future, value);
          }
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {if (defaultValue != null) {_runUserCode(defaultValue, future._complete, future._completeError); return;} try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(future, e, s);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    lastWhere(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */, opt$) {
      let defaultValue = opt$.defaultValue === undefined ? null : opt$.defaultValue;
      let future = new _Future();
      let result = null;
      let foundResult = false;
      let subscription = null;
      subscription = this.this.listen((value) => {
        _runUserCode(() => true === test(value), /* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (isMatch) => {
          if (isMatch) {
            foundResult = true;
            result = value;
          }
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {if (foundResult) {future._complete(result); return;} if (defaultValue != null) {_runUserCode(defaultValue, future._complete, future._completeError); return;} try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(future, e, s);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    singleWhere(/* Unimplemented FunctionTypedFormalParameter: bool test(T element) */) {
      let future = new _Future();
      let result = null;
      let foundResult = false;
      let subscription = null;
      subscription = this.this.listen((value) => {
        _runUserCode(() => true === test(value), /* Unimplemented: ClosureWrapLiteral: (bool) → dynamic to (dynamic) → dynamic */ (isMatch) => {
          if (isMatch) {
            if (foundResult) {
              /* Unimplemented TryStatement: try {throw IterableElementError.tooMany();} catch (e, s) {_cancelAndErrorWithReplacement(subscription, future, e, s);} */return;
            }
            foundResult = true;
            result = value;
          }
        }, /* Unimplemented: DownCast: dynamic to (dynamic, StackTrace) → dynamic */ _cancelAndErrorClosure(subscription, future));
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {if (foundResult) {future._complete(result); return;} try {throw IterableElementError.noElement();} catch (e, s) {_completeWithErrorCallback(future, e, s);}} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    elementAt(index) {
      if (/* Unimplemented IsExpression: index is! int */ || index < 0) throw new dart_core.ArgumentError(index);
      let future = new _Future();
      let subscription = null;
      let elementIndex = 0;
      subscription = this.this.listen((value) => {
        if (index === elementIndex) {
          _cancelAndValue(subscription, future, value);
          return;
        }
        elementIndex = 1;
      }, /* Unimplemented NamedExpression: onError: future._completeError */, /* Unimplemented NamedExpression: onDone: () {future._completeError(new RangeError.index(index, this, "index", null, elementIndex));} */, /* Unimplemented NamedExpression: cancelOnError: true */);
      return future;
    }
    timeout(timeLimit, opt$) {
      let onTimeout = opt$.onTimeout === undefined ? null : opt$.onTimeout;
      let controller = null;
      let subscription = null;
      let timer = null;
      let zone = null;
      let timeout = null;
      /* Unimplemented FunctionDeclarationStatement: void onData(T event) {timer.cancel(); controller.add(event); timer = zone.createTimer(timeLimit, timeout);} *//* Unimplemented FunctionDeclarationStatement: void onError(error, StackTrace stackTrace) {timer.cancel(); assert (controller is _StreamController || controller is _BroadcastStreamController); var eventSink = controller; eventSink._addError(error, stackTrace); timer = zone.createTimer(timeLimit, timeout);} *//* Unimplemented FunctionDeclarationStatement: void onDone() {timer.cancel(); controller.close();} *//* Unimplemented FunctionDeclarationStatement: void onListen() {zone = Zone.current; if (onTimeout == null) {timeout = () {controller.addError(new TimeoutException("No stream event", timeLimit), null);};} else {onTimeout = zone.registerUnaryCallback(onTimeout); _ControllerEventSinkWrapper wrapper = new _ControllerEventSinkWrapper(null); timeout = () {wrapper._sink = controller; zone.runUnaryGuarded(onTimeout, wrapper); wrapper._sink = null;};} subscription = this.listen(onData, onError: onError, onDone: onDone); timer = zone.createTimer(timeLimit, timeout);} *//* Unimplemented FunctionDeclarationStatement: Future onCancel() {timer.cancel(); Future result = subscription.cancel(); subscription = null; return result;} */controller = this.isBroadcast ? new _SyncBroadcastStreamController(onListen, onCancel) : new _SyncStreamController(onListen, () => {
        timer.cancel();
        subscription.pause();
      }, () => {
        subscription.resume();
        timer = zone.createTimer(timeLimit, /* Unimplemented: DownCast: Function to () → void */ timeout);
      }, onCancel);
      return controller.stream;
    }
  }
  Stream.fromFuture = function(future) { this.__init_fromFuture(future) };
  Stream.fromFuture.prototype = Stream.prototype;
  Stream.fromIterable = function(data) { this.__init_fromIterable(data) };
  Stream.fromIterable.prototype = Stream.prototype;
  Stream.periodic = function(period, computation) { this.__init_periodic(period, computation) };
  Stream.periodic.prototype = Stream.prototype;
  Stream.eventTransformed = function(source, /* Unimplemented FunctionTypedFormalParameter: EventSink mapSink(EventSink<T> sink) */) { this.__init_eventTransformed(source, /* Unimplemented FunctionTypedFormalParameter: EventSink mapSink(EventSink<T> sink) */) };
  Stream.eventTransformed.prototype = Stream.prototype;

  class StreamSubscription {
  }

  class EventSink {
  }

  class StreamView extends Stream {
    constructor(_stream) {
      this._stream = _stream;
      super();
    }
    get isBroadcast() { return this._stream.isBroadcast; }
    asBroadcastStream(opt$) {
      let onListen = opt$.onListen === undefined ? null : opt$.onListen;
      let onCancel = opt$.onCancel === undefined ? null : opt$.onCancel;
      return this._stream.asBroadcastStream(/* Unimplemented NamedExpression: onListen: onListen */, /* Unimplemented NamedExpression: onCancel: onCancel */)
    }
    listen(/* Unimplemented FunctionTypedFormalParameter: void onData(T value) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let onDone = opt$.onDone === undefined ? null : opt$.onDone;
      let cancelOnError = opt$.cancelOnError === undefined ? null : opt$.cancelOnError;
      return this._stream.listen(onData, /* Unimplemented NamedExpression: onError: onError */, /* Unimplemented NamedExpression: onDone: onDone */, /* Unimplemented NamedExpression: cancelOnError: cancelOnError */);
    }
  }

  class StreamConsumer {
  }

  class StreamSink {
  }

  class StreamTransformer {
    constructor(/* Unimplemented FunctionTypedFormalParameter: StreamSubscription<T> transformer(Stream<S> stream, bool cancelOnError) */) {
      return new _StreamSubscriptionTransformer(/* Unimplemented FunctionTypedFormalParameter: StreamSubscription<T> transformer(Stream<S> stream, bool cancelOnError) */);
    }
    __init_fromHandlers(opt$) {
      return new _StreamHandlerTransformer(opt$);
    }
  }
  StreamTransformer.fromHandlers = function(opt$) { this.__init_fromHandlers(opt$) };
  StreamTransformer.fromHandlers.prototype = StreamTransformer.prototype;

  class StreamIterator {
    constructor(stream) {
      return new _StreamIteratorImpl(stream);
    }
  }

  class _ControllerEventSinkWrapper {
    constructor(_sink) {
      this._sink = _sink;
    }
    add(data) {
      this._sink.add(data);
    }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      this._sink.addError(error, stackTrace);
    }
    close() {
      this._sink.close();
    }
  }

  class StreamController {
    constructor(opt$) {
      let onListen = opt$.onListen === undefined ? null : opt$.onListen;
      let onPause = opt$.onPause === undefined ? null : opt$.onPause;
      let onResume = opt$.onResume === undefined ? null : opt$.onResume;
      let onCancel = opt$.onCancel === undefined ? null : opt$.onCancel;
      let sync = opt$.sync === undefined ? false : opt$.sync;
      if (onListen === null && onPause === null && onResume === null && onCancel === null) {
        return /* Unimplemented: DownCastDynamic: _StreamController<dynamic> to StreamController<T> */ sync ? new _NoCallbackSyncStreamController() : new _NoCallbackAsyncStreamController();
      }
      return sync ? new _SyncStreamController(onListen, onPause, onResume, onCancel) : new _AsyncStreamController(onListen, onPause, onResume, onCancel);
    }
    __init_broadcast(opt$) {
      let onListen = opt$.onListen === undefined ? null : opt$.onListen;
      let onCancel = opt$.onCancel === undefined ? null : opt$.onCancel;
      let sync = opt$.sync === undefined ? false : opt$.sync;
      return sync ? new _SyncBroadcastStreamController(onListen, onCancel) : new _AsyncBroadcastStreamController(onListen, onCancel);
    }
  }
  StreamController.broadcast = function(opt$) { this.__init_broadcast(opt$) };
  StreamController.broadcast.prototype = StreamController.prototype;

  class _StreamControllerLifecycle {
    _recordPause(subscription) {
    }
    _recordResume(subscription) {
    }
    _recordCancel(subscription) { return null; }
  }

  class _StreamController {
    constructor() {
      this._STATE_INITIAL = 0;
      this._STATE_SUBSCRIBED = 1;
      this._STATE_CANCELED = 2;
      this._STATE_SUBSCRIPTION_MASK = 3;
      this._STATE_CLOSED = 4;
      this._STATE_ADDSTREAM = 8;
      this._varData = null;
      this._state = _STATE_INITIAL;
      this._doneFuture = null;
    }
    get stream() { return /* Unimplemented: DownCastExact: _ControllerStream<dynamic> to Stream<T> */ new _ControllerStream(this); }
    get sink() { return new _StreamSinkWrapper(this); }
    get _isCanceled() { return (this._state & _STATE_CANCELED) !== 0; }
    get hasListener() { return (this._state & _STATE_SUBSCRIBED) !== 0; }
    get _isInitialState() { return (this._state & _STATE_SUBSCRIPTION_MASK) === _STATE_INITIAL; }
    get isClosed() { return (this._state & _STATE_CLOSED) !== 0; }
    get isPaused() { return this.hasListener ? this._subscription._isInputPaused : !this._isCanceled; }
    get _isAddingStream() { return (this._state & _STATE_ADDSTREAM) !== 0; }
    get _mayAddEvent() { return (this._state < _STATE_CLOSED); }
    get _pendingEvents() {
      /* Unimplemented AssertStatement: assert (_isInitialState); */if (!this._isAddingStream) {
        return /* Unimplemented: DownCast: dynamic to _PendingEvents */ this._varData;
      }
      let state = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
      return /* Unimplemented: DownCast: dynamic to _PendingEvents */ state.varData;
    }
    _ensurePendingEvents() {
      /* Unimplemented AssertStatement: assert (_isInitialState); */if (!this._isAddingStream) {
        if (this._varData === null) this._varData = new _StreamImplEvents();
        return /* Unimplemented: DownCast: dynamic to _StreamImplEvents */ this._varData;
      }
      let state = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
      if (state.varData === null) state.varData = new _StreamImplEvents();
      return /* Unimplemented: DownCast: dynamic to _StreamImplEvents */ state.varData;
    }
    get _subscription() {
      /* Unimplemented AssertStatement: assert (hasListener); */if (this._isAddingStream) {
        let addState = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
        return /* Unimplemented: DownCast: dynamic to _ControllerSubscription<dynamic> */ addState.varData;
      }
      return /* Unimplemented: DownCast: dynamic to _ControllerSubscription<dynamic> */ this._varData;
    }
    _badEventState() {
      if (this.isClosed) {
        return new dart_core.StateError("Cannot add event after closing");
      }
      /* Unimplemented AssertStatement: assert (_isAddingStream); */return new dart_core.StateError("Cannot add event while adding a stream");
    }
    addStream(source, opt$) {
      let cancelOnError = opt$.cancelOnError === undefined ? true : opt$.cancelOnError;
      if (!this._mayAddEvent) throw this._badEventState();
      if (this._isCanceled) return new _Future.immediate(null);
      let addState = new _StreamControllerAddStreamState(this, this._varData, source, cancelOnError);
      this._varData = addState;
      this._state = _STATE_ADDSTREAM;
      return addState.addStreamFuture;
    }
    get done() { return this._ensureDoneFuture(); }
    _ensureDoneFuture() {
      if (this._doneFuture === null) {
        this._doneFuture = this._isCanceled ? Future._nullFuture : new _Future();
      }
      return this._doneFuture;
    }
    add(value) {
      if (!this._mayAddEvent) throw this._badEventState();
      this._add(value);
    }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      error = _nonNullError(error);
      if (!this._mayAddEvent) throw this._badEventState();
      let replacement = Zone.current.errorCallback(error, stackTrace);
      if (replacement !== null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
      }
      this._addError(error, stackTrace);
    }
    close() {
      if (this.isClosed) {
        return this._ensureDoneFuture();
      }
      if (!this._mayAddEvent) throw this._badEventState();
      this._closeUnchecked();
      return this._ensureDoneFuture();
    }
    _closeUnchecked() {
      this._state = _STATE_CLOSED;
      if (this.hasListener) {
        _sendDone();
      }
       else if (this._isInitialState) {
        this._ensurePendingEvents().add(new _DelayedDone());
      }
    }
    _add(value) {
      if (this.hasListener) {
        _sendData(value);
      }
       else if (this._isInitialState) {
        this._ensurePendingEvents().add(new _DelayedData(value));
      }
    }
    _addError(error, stackTrace) {
      if (this.hasListener) {
        _sendError(error, stackTrace);
      }
       else if (this._isInitialState) {
        this._ensurePendingEvents().add(new _DelayedError(error, stackTrace));
      }
    }
    _close() {
      /* Unimplemented AssertStatement: assert (_isAddingStream); */let addState = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
      this._varData = addState.varData;
      this._state = ~_STATE_ADDSTREAM;
      addState.complete();
    }
    _subscribe(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      if (!this._isInitialState) {
        throw new dart_core.StateError("Stream has already been listened to.");
      }
      let subscription = new _ControllerSubscription(this, onData, onError, onDone, cancelOnError);
      let pendingEvents = this._pendingEvents;
      this._state = _STATE_SUBSCRIBED;
      if (this._isAddingStream) {
        let addState = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
        addState.varData = subscription;
        addState.resume();
      }
       else {
        this._varData = subscription;
      }
      subscription._setPendingEvents(pendingEvents);
      subscription._guardCallback(() => {
        _runGuarded(this._onListen);
      });
      return /* Unimplemented: DownCastDynamic: _ControllerSubscription<dynamic> to StreamSubscription<T> */ subscription;
    }
    _recordCancel(subscription) {
      let result = null;
      if (this._isAddingStream) {
        let addState = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
        result = addState.cancel();
      }
      this._varData = null;
      this._state = (this._state & ~(_STATE_SUBSCRIBED | _STATE_ADDSTREAM)) | _STATE_CANCELED;
      if (this._onCancel !== null) {
        if (result === null) {
          /* Unimplemented TryStatement: try {result = _onCancel();} catch (e, s) {result = new _Future().._asyncCompleteError(e, s);} */}
         else {
          result = result.whenComplete(this._onCancel);
        }
      }
      /* Unimplemented FunctionDeclarationStatement: void complete() {if (_doneFuture != null && _doneFuture._mayComplete) {_doneFuture._asyncComplete(null);}} */if (result !== null) {
        result = result.whenComplete(complete);
      }
       else {
        complete();
      }
      return result;
    }
    _recordPause(subscription) {
      if (this._isAddingStream) {
        let addState = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
        addState.pause();
      }
      _runGuarded(this._onPause);
    }
    _recordResume(subscription) {
      if (this._isAddingStream) {
        let addState = /* Unimplemented: DownCast: dynamic to _StreamControllerAddStreamState<dynamic> */ this._varData;
        addState.resume();
      }
      _runGuarded(this._onResume);
    }
  }

  class _SyncStreamControllerDispatch {
    _sendData(data) {
      _subscription._add(data);
    }
    _sendError(error, stackTrace) {
      _subscription._addError(error, stackTrace);
    }
    _sendDone() {
      _subscription._close();
    }
  }

  class _AsyncStreamControllerDispatch {
    _sendData(data) {
      _subscription._addPending(new _DelayedData(data));
    }
    _sendError(error, stackTrace) {
      _subscription._addPending(new _DelayedError(error, stackTrace));
    }
    _sendDone() {
      _subscription._addPending(new _DelayedDone());
    }
  }

  class _AsyncStreamController extends _StreamController {
    constructor(_onListen, _onPause, _onResume, _onCancel) {
      this._onListen = _onListen;
      this._onPause = _onPause;
      this._onResume = _onResume;
      this._onCancel = _onCancel;
      super();
    }
  }

  class _SyncStreamController extends _StreamController {
    constructor(_onListen, _onPause, _onResume, _onCancel) {
      this._onListen = _onListen;
      this._onPause = _onPause;
      this._onResume = _onResume;
      this._onCancel = _onCancel;
      super();
    }
  }

  class _NoCallbacks {
    get _onListen() { return null; }
    get _onPause() { return null; }
    get _onResume() { return null; }
    get _onCancel() { return null; }
  }

  /* Unimplemented ClassTypeAlias: class _NoCallbackAsyncStreamController = _StreamController with _AsyncStreamControllerDispatch, _NoCallbacks; *//* Unimplemented ClassTypeAlias: class _NoCallbackSyncStreamController = _StreamController with _SyncStreamControllerDispatch, _NoCallbacks; */// Function _runGuarded: (() → dynamic) → Future<dynamic>
  function _runGuarded(notificationHandler) {
    if (notificationHandler === null) return null;
    /* Unimplemented TryStatement: try {var result = notificationHandler(); if (result is Future) return result; return null;} catch (e, s) {Zone.current.handleUncaughtError(e, s);} */}

  class _ControllerStream extends _StreamImpl {
    constructor(_controller) {
      this._controller = _controller;
      super();
    }
    _createSubscription(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) { return this._controller._subscribe(onData, onError, onDone, cancelOnError); }
    get hashCode() { return this._controller.hashCode ^ 892482866; }
    ==(other) {
      if (dart_core.identical(this, other)) return true;
      if (/* Unimplemented IsExpression: other is! _ControllerStream */) return false;
      let otherStream = /* Unimplemented: DownCast: Object to _ControllerStream<dynamic> */ other;
      return dart_core.identical(otherStream._controller, this._controller);
    }
  }

  class _ControllerSubscription extends _BufferingStreamSubscription {
    constructor(_controller, /* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      this._controller = _controller;
      super(onData, onError, onDone, cancelOnError);
    }
    _onCancel() {
      return this._controller._recordCancel(this);
    }
    _onPause() {
      this._controller._recordPause(this);
    }
    _onResume() {
      this._controller._recordResume(this);
    }
  }

  class _StreamSinkWrapper {
    constructor(_target) {
      this._target = _target;
    }
    add(data) {
      this._target.add(data);
    }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      this._target.addError(error, stackTrace);
    }
    close() { return this._target.close(); }
    addStream(source, opt$) {
      let cancelOnError = opt$.cancelOnError === undefined ? true : opt$.cancelOnError;
      return this._target.addStream(source, /* Unimplemented NamedExpression: cancelOnError: cancelOnError */)
    }
    get done() { return this._target.done; }
  }

  class _AddStreamState {
    constructor(controller, source, cancelOnError) {
      this.addStreamFuture = new _Future();
      this.addSubscription = source.listen(/* Unimplemented: ClosureWrap: (T) → void to (dynamic) → void */ controller._add, /* Unimplemented: DownCast: dynamic to Function */ /* Unimplemented NamedExpression: onError: cancelOnError ? makeErrorHandler(controller) : controller._addError */, /* Unimplemented NamedExpression: onDone: controller._close */, /* Unimplemented NamedExpression: cancelOnError: cancelOnError */);
    }
    static makeErrorHandler(controller) { return (e, s) => {
      controller._addError(e, s);
      controller._close();
    }; }
    pause() {
      this.addSubscription.pause();
    }
    resume() {
      this.addSubscription.resume();
    }
    cancel() {
      let cancel = this.addSubscription.cancel();
      if (cancel === null) {
        this.addStreamFuture._asyncComplete(null);
        return null;
      }
      return cancel.whenComplete(() => {
        this.addStreamFuture._asyncComplete(null);
      });
    }
    complete() {
      this.addStreamFuture._asyncComplete(null);
    }
  }

  class _StreamControllerAddStreamState extends _AddStreamState {
    constructor(controller, varData, source, cancelOnError) {
      this.varData = varData;
      super(/* Unimplemented: DownCastDynamic: _StreamController<dynamic> to _EventSink<T> */ controller, source, cancelOnError);
      if (controller.isPaused) {
        addSubscription.pause();
      }
    }
  }

  class _EventSink {
  }

  class _EventDispatch {
  }

  class _BufferingStreamSubscription {
    constructor(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      this._zone = Zone.current;
      this._state = (cancelOnError ? _STATE_CANCEL_ON_ERROR : 0);
      this._STATE_CANCEL_ON_ERROR = 1;
      this._STATE_CLOSED = 2;
      this._STATE_INPUT_PAUSED = 4;
      this._STATE_CANCELED = 8;
      this._STATE_WAIT_FOR_CANCEL = 16;
      this._STATE_IN_CALLBACK = 32;
      this._STATE_HAS_PENDING = 64;
      this._STATE_PAUSE_COUNT = 128;
      this._STATE_PAUSE_COUNT_SHIFT = 7;
      this._onData = null;
      this._onError = null;
      this._onDone = null;
      this._cancelFuture = null;
      this._pending = null;
      this.this.onData(onData);
      this.this.onError(onError);
      this.this.onDone(onDone);
    }
    _setPendingEvents(pendingEvents) {
      /* Unimplemented AssertStatement: assert (_pending == null); */if (pendingEvents === null) return;
      this._pending = pendingEvents;
      if (!pendingEvents.isEmpty) {
        this._state = _STATE_HAS_PENDING;
        this._pending.schedule(this);
      }
    }
    _extractPending() {
      /* Unimplemented AssertStatement: assert (_isCanceled); */let events = this._pending;
      this._pending = null;
      return events;
    }
    onData(/* Unimplemented FunctionTypedFormalParameter: void handleData(T event) */) {
      if (handleData === null) handleData = _nullDataHandler;
      this._onData = this._zone.registerUnaryCallback(/* Unimplemented: ClosureWrap: (T) → void to (dynamic) → dynamic */ handleData);
    }
    onError(handleError) {
      if (handleError === null) handleError = _nullErrorHandler;
      this._onError = _registerErrorHandler(handleError, this._zone);
    }
    onDone(/* Unimplemented FunctionTypedFormalParameter: void handleDone() */) {
      if (handleDone === null) handleDone = _nullDoneHandler;
      this._onDone = this._zone.registerCallback(handleDone);
    }
    pause(resumeSignal) {
      if (resumeSignal === undefined) resumeSignal = null;
      if (this._isCanceled) return;
      let wasPaused = this._isPaused;
      let wasInputPaused = this._isInputPaused;
      this._state = (this._state + _STATE_PAUSE_COUNT) | _STATE_INPUT_PAUSED;
      if (resumeSignal !== null) resumeSignal.whenComplete(this.resume);
      if (!wasPaused && this._pending !== null) this._pending.cancelSchedule();
      if (!wasInputPaused && !this._inCallback) this._guardCallback(this._onPause);
    }
    resume() {
      if (this._isCanceled) return;
      if (this._isPaused) {
        this._decrementPauseCount();
        if (!this._isPaused) {
          if (this._hasPending && !this._pending.isEmpty) {
            this._pending.schedule(this);
          }
           else {
            /* Unimplemented AssertStatement: assert (_mayResumeInput); */this._state = ~_STATE_INPUT_PAUSED;
            if (!this._inCallback) this._guardCallback(this._onResume);
          }
        }
      }
    }
    cancel() {
      this._state = ~_STATE_WAIT_FOR_CANCEL;
      if (this._isCanceled) return this._cancelFuture;
      this._cancel();
      return this._cancelFuture;
    }
    asFuture(futureValue) {
      if (futureValue === undefined) futureValue = null;
      let result = new _Future();
      this._onDone = () => {
        result._complete(futureValue);
      };
      this._onError = (error, stackTrace) => {
        this.cancel();
        result._completeError(error, /* Unimplemented: DownCast: dynamic to StackTrace */ stackTrace);
      };
      return result;
    }
    get _isInputPaused() { return (this._state & _STATE_INPUT_PAUSED) !== 0; }
    get _isClosed() { return (this._state & _STATE_CLOSED) !== 0; }
    get _isCanceled() { return (this._state & _STATE_CANCELED) !== 0; }
    get _waitsForCancel() { return (this._state & _STATE_WAIT_FOR_CANCEL) !== 0; }
    get _inCallback() { return (this._state & _STATE_IN_CALLBACK) !== 0; }
    get _hasPending() { return (this._state & _STATE_HAS_PENDING) !== 0; }
    get _isPaused() { return this._state >= _STATE_PAUSE_COUNT; }
    get _canFire() { return this._state < _STATE_IN_CALLBACK; }
    get _mayResumeInput() { return !this._isPaused && (this._pending === null || this._pending.isEmpty); }
    get _cancelOnError() { return (this._state & _STATE_CANCEL_ON_ERROR) !== 0; }
    get isPaused() { return this._isPaused; }
    _cancel() {
      this._state = _STATE_CANCELED;
      if (this._hasPending) {
        this._pending.cancelSchedule();
      }
      if (!this._inCallback) this._pending = null;
      this._cancelFuture = this._onCancel();
    }
    _incrementPauseCount() {
      this._state = (this._state + _STATE_PAUSE_COUNT) | _STATE_INPUT_PAUSED;
    }
    _decrementPauseCount() {
      /* Unimplemented AssertStatement: assert (_isPaused); */this._state = _STATE_PAUSE_COUNT;
    }
    _add(data) {
      /* Unimplemented AssertStatement: assert (!_isClosed); */if (this._isCanceled) return;
      if (this._canFire) {
        this._sendData(data);
      }
       else {
        this._addPending(new _DelayedData(data));
      }
    }
    _addError(error, stackTrace) {
      if (this._isCanceled) return;
      if (this._canFire) {
        this._sendError(error, stackTrace);
      }
       else {
        this._addPending(new _DelayedError(error, stackTrace));
      }
    }
    _close() {
      /* Unimplemented AssertStatement: assert (!_isClosed); */if (this._isCanceled) return;
      this._state = _STATE_CLOSED;
      if (this._canFire) {
        this._sendDone();
      }
       else {
        this._addPending(new _DelayedDone());
      }
    }
    _onPause() {
      /* Unimplemented AssertStatement: assert (_isInputPaused); */}
    _onResume() {
      /* Unimplemented AssertStatement: assert (!_isInputPaused); */}
    _onCancel() {
      /* Unimplemented AssertStatement: assert (_isCanceled); */return null;
    }
    _addPending(event) {
      let pending = /* Unimplemented: DownCast: _PendingEvents to _StreamImplEvents */ this._pending;
      if (this._pending === null) pending = this._pending = new _StreamImplEvents();
      pending.add(event);
      if (!this._hasPending) {
        this._state = _STATE_HAS_PENDING;
        if (!this._isPaused) {
          this._pending.schedule(this);
        }
      }
    }
    _sendData(data) {
      /* Unimplemented AssertStatement: assert (!_isCanceled); *//* Unimplemented AssertStatement: assert (!_isPaused); *//* Unimplemented AssertStatement: assert (!_inCallback); */let wasInputPaused = this._isInputPaused;
      this._state = _STATE_IN_CALLBACK;
      this._zone.runUnaryGuarded(/* Unimplemented: ClosureWrap: (T) → void to (dynamic) → dynamic */ this._onData, data);
      this._state = ~_STATE_IN_CALLBACK;
      this._checkState(wasInputPaused);
    }
    _sendError(error, stackTrace) {
      /* Unimplemented AssertStatement: assert (!_isCanceled); *//* Unimplemented AssertStatement: assert (!_isPaused); *//* Unimplemented AssertStatement: assert (!_inCallback); */let wasInputPaused = this._isInputPaused;
      /* Unimplemented FunctionDeclarationStatement: void sendError() {if (_isCanceled && !_waitsForCancel) return; _state |= _STATE_IN_CALLBACK; if (_onError is ZoneBinaryCallback) {_zone.runBinaryGuarded(_onError, error, stackTrace);} else {_zone.runUnaryGuarded(_onError, error);} _state &= ~_STATE_IN_CALLBACK;} */if (this._cancelOnError) {
        this._state = _STATE_WAIT_FOR_CANCEL;
        this._cancel();
        if (/* Unimplemented IsExpression: _cancelFuture is Future */) {
          this._cancelFuture.whenComplete(sendError);
        }
         else {
          sendError();
        }
      }
       else {
        sendError();
        this._checkState(wasInputPaused);
      }
    }
    _sendDone() {
      /* Unimplemented AssertStatement: assert (!_isCanceled); *//* Unimplemented AssertStatement: assert (!_isPaused); *//* Unimplemented AssertStatement: assert (!_inCallback); *//* Unimplemented FunctionDeclarationStatement: void sendDone() {if (!_waitsForCancel) return; _state |= (_STATE_CANCELED | _STATE_CLOSED | _STATE_IN_CALLBACK); _zone.runGuarded(_onDone); _state &= ~_STATE_IN_CALLBACK;} */this._cancel();
      this._state = _STATE_WAIT_FOR_CANCEL;
      if (/* Unimplemented IsExpression: _cancelFuture is Future */) {
        this._cancelFuture.whenComplete(sendDone);
      }
       else {
        sendDone();
      }
    }
    _guardCallback(callback) {
      /* Unimplemented AssertStatement: assert (!_inCallback); */let wasInputPaused = this._isInputPaused;
      this._state = _STATE_IN_CALLBACK;
      /* Unimplemented MethodInvocation: callback() */;
      this._state = ~_STATE_IN_CALLBACK;
      this._checkState(wasInputPaused);
    }
    _checkState(wasInputPaused) {
      /* Unimplemented AssertStatement: assert (!_inCallback); */if (this._hasPending && this._pending.isEmpty) {
        this._state = ~_STATE_HAS_PENDING;
        if (this._isInputPaused && this._mayResumeInput) {
          this._state = ~_STATE_INPUT_PAUSED;
        }
      }
      while (true) {
        if (this._isCanceled) {
          this._pending = null;
          return;
        }
        let isInputPaused = this._isInputPaused;
        if (wasInputPaused === isInputPaused) /* Unimplemented BreakStatement: break; */this._state = _STATE_IN_CALLBACK;
        if (isInputPaused) {
          this._onPause();
        }
         else {
          this._onResume();
        }
        this._state = ~_STATE_IN_CALLBACK;
        wasInputPaused = isInputPaused;
      }
      if (this._hasPending && !this._isPaused) {
        this._pending.schedule(this);
      }
    }
  }

  class _StreamImpl extends Stream {
    listen(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let onDone = opt$.onDone === undefined ? null : opt$.onDone;
      let cancelOnError = opt$.cancelOnError === undefined ? null : opt$.cancelOnError;
      cancelOnError = dart_core.identical(true, cancelOnError);
      let subscription = this._createSubscription(onData, onError, onDone, cancelOnError);
      this._onListen(subscription);
      return /* Unimplemented: DownCastDynamic: StreamSubscription<dynamic> to StreamSubscription<T> */ subscription;
    }
    _createSubscription(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      return new _BufferingStreamSubscription(onData, onError, onDone, cancelOnError);
    }
    _onListen(subscription) {
    }
  }

  class _GeneratedStreamImpl extends _StreamImpl {
    constructor(_pending) {
      this._pending = _pending;
      this._isUsed = false;
      super();
    }
    _createSubscription(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      if (this._isUsed) throw new dart_core.StateError("Stream has already been listened to.");
      this._isUsed = true;
      return /* Unimplemented CascadeExpression: new _BufferingStreamSubscription(onData, onError, onDone, cancelOnError).._setPendingEvents(_pending()) */;
    }
  }

  class _IterablePendingEvents extends _PendingEvents {
    constructor(data) {
      this._iterator = data.iterator;
      super();
    }
    get isEmpty() { return this._iterator === null; }
    handleNext(dispatch) {
      if (this._iterator === null) {
        throw new dart_core.StateError("No events pending.");
      }
      let isDone = null;
      /* Unimplemented TryStatement: try {isDone = !_iterator.moveNext();} catch (e, s) {_iterator = null; dispatch._sendError(e, s); return;} */if (!isDone) {
        dispatch._sendData(this._iterator.current);
      }
       else {
        this._iterator = null;
        dispatch._sendDone();
      }
    }
    clear() {
      if (isScheduled) cancelSchedule();
      this._iterator = null;
    }
  }

  // Function _nullDataHandler: (dynamic) → void
  function _nullDataHandler(value) {
  }

  // Function _nullErrorHandler: (dynamic, [StackTrace]) → void
  function _nullErrorHandler(error, stackTrace) {
    if (stackTrace === undefined) stackTrace = null;
    Zone.current.handleUncaughtError(error, stackTrace);
  }

  // Function _nullDoneHandler: () → void
  function _nullDoneHandler() {
  }

  class _DelayedEvent {
    constructor() {
      this.next = null;
      super();
    }
  }

  class _DelayedData extends _DelayedEvent {
    constructor(value) {
      this.value = value;
      super();
    }
    perform(dispatch) {
      dispatch._sendData(this.value);
    }
  }

  class _DelayedError extends _DelayedEvent {
    constructor(error, stackTrace) {
      this.error = error;
      this.stackTrace = stackTrace;
      super();
    }
    perform(dispatch) {
      dispatch._sendError(this.error, this.stackTrace);
    }
  }

  class _DelayedDone {
    constructor() {
    }
    perform(dispatch) {
      dispatch._sendDone();
    }
    get next() { return null; }
    set next(_) {
      throw new dart_core.StateError("No events after a done.");
    }
  }

  class _PendingEvents {
    constructor() {
      this._STATE_UNSCHEDULED = 0;
      this._STATE_SCHEDULED = 1;
      this._STATE_CANCELED = 3;
      this._state = _STATE_UNSCHEDULED;
      super();
    }
    get isScheduled() { return this._state === _STATE_SCHEDULED; }
    get _eventScheduled() { return this._state >= _STATE_SCHEDULED; }
    schedule(dispatch) {
      if (this.isScheduled) return;
      /* Unimplemented AssertStatement: assert (!isEmpty); */if (this._eventScheduled) {
        /* Unimplemented AssertStatement: assert (_state == _STATE_CANCELED); */this._state = _STATE_SCHEDULED;
        return;
      }
      scheduleMicrotask(() => {
        let oldState = this._state;
        this._state = _STATE_UNSCHEDULED;
        if (oldState === _STATE_CANCELED) return;
        this.handleNext(dispatch);
      });
      this._state = _STATE_SCHEDULED;
    }
    cancelSchedule() {
      if (this.isScheduled) this._state = _STATE_CANCELED;
    }
  }

  class _StreamImplEvents extends _PendingEvents {
    constructor() {
      this.firstPendingEvent = null;
      this.lastPendingEvent = null;
      super();
    }
    get isEmpty() { return this.lastPendingEvent === null; }
    add(event) {
      if (this.lastPendingEvent === null) {
        this.firstPendingEvent = this.lastPendingEvent = event;
      }
       else {
        this.lastPendingEvent = this.lastPendingEvent.next = event;
      }
    }
    handleNext(dispatch) {
      /* Unimplemented AssertStatement: assert (!isScheduled); */let event = this.firstPendingEvent;
      this.firstPendingEvent = event.next;
      if (this.firstPendingEvent === null) {
        this.lastPendingEvent = null;
      }
      event.perform(dispatch);
    }
    clear() {
      if (isScheduled) cancelSchedule();
      this.firstPendingEvent = this.lastPendingEvent = null;
    }
  }

  class _BroadcastLinkedList {
    constructor() {
      this._next = null;
      this._previous = null;
      super();
    }
    _unlink() {
      this._previous._next = this._next;
      this._next._previous = this._previous;
      this._next = this._previous = this;
    }
    _insertBefore(newNext) {
      let newPrevious = newNext._previous;
      newPrevious._next = this;
      newNext._previous = this._previous;
      this._previous._next = newNext;
      this._previous = newPrevious;
    }
  }

  class _DoneStreamSubscription {
    constructor(_onDone) {
      this._onDone = _onDone;
      this._zone = Zone.current;
      this._DONE_SENT = 1;
      this._SCHEDULED = 2;
      this._PAUSED = 4;
      this._state = 0;
      this._schedule();
    }
    get _isSent() { return (this._state & _DONE_SENT) !== 0; }
    get _isScheduled() { return (this._state & _SCHEDULED) !== 0; }
    get isPaused() { return this._state >= _PAUSED; }
    _schedule() {
      if (this._isScheduled) return;
      this._zone.scheduleMicrotask(this._sendDone);
      this._state = _SCHEDULED;
    }
    onData(/* Unimplemented FunctionTypedFormalParameter: void handleData(T data) */) {
    }
    onError(handleError) {
    }
    onDone(/* Unimplemented FunctionTypedFormalParameter: void handleDone() */) {
      this._onDone = handleDone;
    }
    pause(resumeSignal) {
      if (resumeSignal === undefined) resumeSignal = null;
      this._state = _PAUSED;
      if (resumeSignal !== null) resumeSignal.whenComplete(this.resume);
    }
    resume() {
      if (this.isPaused) {
        this._state = _PAUSED;
        if (!this.isPaused && !this._isSent) {
          this._schedule();
        }
      }
    }
    cancel() { return null; }
    asFuture(futureValue) {
      if (futureValue === undefined) futureValue = null;
      let result = new _Future();
      this._onDone = () => {
        result._completeWithValue(null);
      };
      return result;
    }
    _sendDone() {
      this._state = ~_SCHEDULED;
      if (this.isPaused) return;
      this._state = _DONE_SENT;
      if (this._onDone !== null) this._zone.runGuarded(this._onDone);
    }
  }

  class _AsBroadcastStream extends Stream {
    constructor(_source, /* Unimplemented FunctionTypedFormalParameter: void onListenHandler(StreamSubscription subscription) */, /* Unimplemented FunctionTypedFormalParameter: void onCancelHandler(StreamSubscription subscription) */) {
      this._source = _source;
      this._onListenHandler = Zone.current.registerUnaryCallback(/* Unimplemented: ClosureWrap: (StreamSubscription<dynamic>) → void to (dynamic) → dynamic */ onListenHandler);
      this._onCancelHandler = Zone.current.registerUnaryCallback(/* Unimplemented: ClosureWrap: (StreamSubscription<dynamic>) → void to (dynamic) → dynamic */ onCancelHandler);
      this._zone = Zone.current;
      this._controller = null;
      this._subscription = null;
      super();
      this._controller = new _AsBroadcastStreamController(this._onListen, this._onCancel);
    }
    get isBroadcast() { return true; }
    listen(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let onDone = opt$.onDone === undefined ? null : opt$.onDone;
      let cancelOnError = opt$.cancelOnError === undefined ? null : opt$.cancelOnError;
      if (this._controller === null || this._controller.isClosed) {
        return new _DoneStreamSubscription(onDone);
      }
      if (this._subscription === null) {
        this._subscription = this._source.listen(this._controller.add, /* Unimplemented NamedExpression: onError: _controller.addError */, /* Unimplemented NamedExpression: onDone: _controller.close */);
      }
      cancelOnError = dart_core.identical(true, cancelOnError);
      return this._controller._subscribe(onData, onError, onDone, cancelOnError);
    }
    _onCancel() {
      let shutdown = (this._controller === null) || this._controller.isClosed;
      if (this._onCancelHandler !== null) {
        this._zone.runUnary(/* Unimplemented: ClosureWrap: (StreamSubscription<dynamic>) → void to (dynamic) → dynamic */ this._onCancelHandler, new _BroadcastSubscriptionWrapper(this));
      }
      if (shutdown) {
        if (this._subscription !== null) {
          this._subscription.cancel();
          this._subscription = null;
        }
      }
    }
    _onListen() {
      if (this._onListenHandler !== null) {
        this._zone.runUnary(/* Unimplemented: ClosureWrap: (StreamSubscription<dynamic>) → void to (dynamic) → dynamic */ this._onListenHandler, new _BroadcastSubscriptionWrapper(this));
      }
    }
    _cancelSubscription() {
      if (this._subscription === null) return;
      let subscription = this._subscription;
      this._subscription = null;
      this._controller = null;
      subscription.cancel();
    }
    _pauseSubscription(resumeSignal) {
      if (this._subscription === null) return;
      this._subscription.pause(resumeSignal);
    }
    _resumeSubscription() {
      if (this._subscription === null) return;
      this._subscription.resume();
    }
    get _isSubscriptionPaused() {
      if (this._subscription === null) return false;
      return this._subscription.isPaused;
    }
  }

  class _BroadcastSubscriptionWrapper {
    constructor(_stream) {
      this._stream = _stream;
    }
    onData(/* Unimplemented FunctionTypedFormalParameter: void handleData(T data) */) {
      throw new dart_core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
    onError(/* Unimplemented FunctionTypedFormalParameter: void handleError(Object data) */) {
      throw new dart_core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
    onDone(/* Unimplemented FunctionTypedFormalParameter: void handleDone() */) {
      throw new dart_core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
    pause(resumeSignal) {
      if (resumeSignal === undefined) resumeSignal = null;
      this._stream._pauseSubscription(resumeSignal);
    }
    resume() {
      this._stream._resumeSubscription();
    }
    cancel() {
      this._stream._cancelSubscription();
      return null;
    }
    get isPaused() {
      return this._stream._isSubscriptionPaused;
    }
    asFuture(futureValue) {
      if (futureValue === undefined) futureValue = null;
      throw new dart_core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
  }

  class _StreamIteratorImpl {
    constructor(stream) {
      this._STATE_FOUND = 0;
      this._STATE_DONE = 1;
      this._STATE_MOVING = 2;
      this._STATE_EXTRA_DATA = 3;
      this._STATE_EXTRA_ERROR = 4;
      this._STATE_EXTRA_DONE = 5;
      this._subscription = null;
      this._current = null;
      this._futureOrPrefetch = null;
      this._state = _STATE_FOUND;
      this._subscription = stream.listen(this._onData, /* Unimplemented NamedExpression: onError: _onError */, /* Unimplemented NamedExpression: onDone: _onDone */, /* Unimplemented NamedExpression: cancelOnError: true */);
    }
    get current() { return this._current; }
    moveNext() {
      if (this._state === _STATE_DONE) {
        return new _Future.immediate(false);
      }
      if (this._state === _STATE_MOVING) {
        throw new dart_core.StateError("Already waiting for next.");
      }
      if (this._state === _STATE_FOUND) {
        this._state = _STATE_MOVING;
        this._current = null;
        this._futureOrPrefetch = new _Future();
        return /* Unimplemented: DownCast: dynamic to Future<bool> */ this._futureOrPrefetch;
      }
       else {
        /* Unimplemented AssertStatement: assert (_state >= _STATE_EXTRA_DATA); *//* Unimplemented SwitchStatement: switch (_state) {case _STATE_EXTRA_DATA: _state = _STATE_FOUND; _current = _futureOrPrefetch; _futureOrPrefetch = null; _subscription.resume(); return new _Future<bool>.immediate(true); case _STATE_EXTRA_ERROR: AsyncError prefetch = _futureOrPrefetch; _clear(); return new _Future<bool>.immediateError(prefetch.error, prefetch.stackTrace); case _STATE_EXTRA_DONE: _clear(); return new _Future<bool>.immediate(false);} */}
    }
    _clear() {
      this._subscription = null;
      this._futureOrPrefetch = null;
      this._current = null;
      this._state = _STATE_DONE;
    }
    cancel() {
      let subscription = this._subscription;
      if (this._state === _STATE_MOVING) {
        let hasNext = /* Unimplemented: DownCast: dynamic to _Future<bool> */ this._futureOrPrefetch;
        this._clear();
        hasNext._complete(false);
      }
       else {
        this._clear();
      }
      return subscription.cancel();
    }
    _onData(data) {
      if (this._state === _STATE_MOVING) {
        this._current = data;
        let hasNext = /* Unimplemented: DownCast: dynamic to _Future<bool> */ this._futureOrPrefetch;
        this._futureOrPrefetch = null;
        this._state = _STATE_FOUND;
        hasNext._complete(true);
        return;
      }
      this._subscription.pause();
      /* Unimplemented AssertStatement: assert (_futureOrPrefetch == null); */this._futureOrPrefetch = data;
      this._state = _STATE_EXTRA_DATA;
    }
    _onError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      if (this._state === _STATE_MOVING) {
        let hasNext = /* Unimplemented: DownCast: dynamic to _Future<bool> */ this._futureOrPrefetch;
        this._clear();
        hasNext._completeError(error, stackTrace);
        return;
      }
      this._subscription.pause();
      /* Unimplemented AssertStatement: assert (_futureOrPrefetch == null); */this._futureOrPrefetch = new AsyncError(error, stackTrace);
      this._state = _STATE_EXTRA_ERROR;
    }
    _onDone() {
      if (this._state === _STATE_MOVING) {
        let hasNext = /* Unimplemented: DownCast: dynamic to _Future<bool> */ this._futureOrPrefetch;
        this._clear();
        hasNext._complete(false);
        return;
      }
      this._subscription.pause();
      this._futureOrPrefetch = null;
      this._state = _STATE_EXTRA_DONE;
    }
  }

  // Function _runUserCode: (() → dynamic, (dynamic) → dynamic, (dynamic, StackTrace) → dynamic) → dynamic
  function _runUserCode(/* Unimplemented FunctionTypedFormalParameter: userCode() */, /* Unimplemented FunctionTypedFormalParameter: onSuccess(value) */, /* Unimplemented FunctionTypedFormalParameter: onError(error, StackTrace stackTrace) */) {
    /* Unimplemented TryStatement: try {onSuccess(userCode());} catch (e, s) {AsyncError replacement = Zone.current.errorCallback(e, s); if (replacement == null) {onError(e, s);} else {var error = _nonNullError(replacement.error); var stackTrace = replacement.stackTrace; onError(error, stackTrace);}} */}

  // Function _cancelAndError: (StreamSubscription<dynamic>, _Future<dynamic>, dynamic, StackTrace) → void
  function _cancelAndError(subscription, future, error, stackTrace) {
    let cancelFuture = subscription.cancel();
    if (/* Unimplemented IsExpression: cancelFuture is Future */) {
      cancelFuture.whenComplete(() => future._completeError(error, stackTrace));
    }
     else {
      future._completeError(error, stackTrace);
    }
  }

  // Function _cancelAndErrorWithReplacement: (StreamSubscription<dynamic>, _Future<dynamic>, dynamic, StackTrace) → void
  function _cancelAndErrorWithReplacement(subscription, future, error, stackTrace) {
    let replacement = Zone.current.errorCallback(error, stackTrace);
    if (replacement !== null) {
      error = _nonNullError(replacement.error);
      stackTrace = replacement.stackTrace;
    }
    _cancelAndError(subscription, future, error, stackTrace);
  }

  // Function _cancelAndErrorClosure: (StreamSubscription<dynamic>, _Future<dynamic>) → dynamic
  function _cancelAndErrorClosure(subscription, future) { return ((error, stackTrace) => _cancelAndError(subscription, future, error, stackTrace)); }

  // Function _cancelAndValue: (StreamSubscription<dynamic>, _Future<dynamic>, dynamic) → void
  function _cancelAndValue(subscription, future, value) {
    let cancelFuture = subscription.cancel();
    if (/* Unimplemented IsExpression: cancelFuture is Future */) {
      cancelFuture.whenComplete(() => future._complete(value));
    }
     else {
      future._complete(value);
    }
  }

  class _ForwardingStream extends Stream {
    constructor(_source) {
      this._source = _source;
      super();
    }
    get isBroadcast() { return this._source.isBroadcast; }
    listen(/* Unimplemented FunctionTypedFormalParameter: void onData(T value) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let onDone = opt$.onDone === undefined ? null : opt$.onDone;
      let cancelOnError = opt$.cancelOnError === undefined ? null : opt$.cancelOnError;
      cancelOnError = dart_core.identical(true, cancelOnError);
      return this._createSubscription(onData, onError, onDone, cancelOnError);
    }
    _createSubscription(/* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      return new _ForwardingStreamSubscription(this, onData, onError, onDone, cancelOnError);
    }
    _handleData(data, sink) {
      let outputData = data;
      sink._add(outputData);
    }
    _handleError(error, stackTrace, sink) {
      sink._addError(error, stackTrace);
    }
    _handleDone(sink) {
      sink._close();
    }
  }

  class _ForwardingStreamSubscription extends _BufferingStreamSubscription {
    constructor(_stream, /* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      this._stream = _stream;
      this._subscription = null;
      super(onData, onError, onDone, cancelOnError);
      this._subscription = this._stream._source.listen(this._handleData, /* Unimplemented NamedExpression: onError: _handleError */, /* Unimplemented NamedExpression: onDone: _handleDone */);
    }
    _add(data) {
      if (_isClosed) return;
      super._add(data);
    }
    _addError(error, stackTrace) {
      if (_isClosed) return;
      super._addError(error, stackTrace);
    }
    _onPause() {
      if (this._subscription === null) return;
      this._subscription.pause();
    }
    _onResume() {
      if (this._subscription === null) return;
      this._subscription.resume();
    }
    _onCancel() {
      if (this._subscription !== null) {
        let subscription = this._subscription;
        this._subscription = null;
        subscription.cancel();
      }
      return null;
    }
    _handleData(data) {
      this._stream._handleData(data, this);
    }
    _handleError(error, stackTrace) {
      this._stream._handleError(error, stackTrace, this);
    }
    _handleDone() {
      this._stream._handleDone(this);
    }
  }

  // Function _addErrorWithReplacement: (_EventSink<dynamic>, dynamic, dynamic) → void
  function _addErrorWithReplacement(sink, error, stackTrace) {
    let replacement = Zone.current.errorCallback(error, /* Unimplemented: DownCast: dynamic to StackTrace */ stackTrace);
    if (replacement !== null) {
      error = _nonNullError(replacement.error);
      stackTrace = replacement.stackTrace;
    }
    sink._addError(error, /* Unimplemented: DownCast: dynamic to StackTrace */ stackTrace);
  }

  class _WhereStream extends _ForwardingStream {
    constructor(source, /* Unimplemented FunctionTypedFormalParameter: bool test(T value) */) {
      this._test = test;
      super(source);
    }
    _handleData(inputEvent, sink) {
      let satisfies = null;
      /* Unimplemented TryStatement: try {satisfies = _test(inputEvent);} catch (e, s) {_addErrorWithReplacement(sink, e, s); return;} */if (satisfies) {
        sink._add(inputEvent);
      }
    }
  }

  class _MapStream extends _ForwardingStream {
    constructor(source, /* Unimplemented FunctionTypedFormalParameter: T transform(S event) */) {
      this._transform = transform;
      super(source);
    }
    _handleData(inputEvent, sink) {
      let outputEvent = null;
      /* Unimplemented TryStatement: try {outputEvent = _transform(inputEvent);} catch (e, s) {_addErrorWithReplacement(sink, e, s); return;} */sink._add(outputEvent);
    }
  }

  class _ExpandStream extends _ForwardingStream {
    constructor(source, /* Unimplemented FunctionTypedFormalParameter: Iterable<T> expand(S event) */) {
      this._expand = expand;
      super(source);
    }
    _handleData(inputEvent, sink) {
      /* Unimplemented TryStatement: try {for (T value in _expand(inputEvent)) {sink._add(value);}} catch (e, s) {_addErrorWithReplacement(sink, e, s);} */}
  }

  class _HandleErrorStream extends _ForwardingStream {
    constructor(source, onError, /* Unimplemented FunctionTypedFormalParameter: bool test(error) */) {
      this._transform = onError;
      this._test = test;
      super(source);
    }
    _handleError(error, stackTrace, sink) {
      let matches = true;
      if (this._test !== null) {
        /* Unimplemented TryStatement: try {matches = _test(error);} catch (e, s) {_addErrorWithReplacement(sink, e, s); return;} */}
      if (matches) {
        /* Unimplemented TryStatement: try {_invokeErrorHandler(_transform, error, stackTrace);} catch (e, s) {if (identical(e, error)) {sink._addError(error, stackTrace);} else {_addErrorWithReplacement(sink, e, s);} return;} */}
       else {
        sink._addError(error, stackTrace);
      }
    }
  }

  class _TakeStream extends _ForwardingStream {
    constructor(source, count) {
      this._remaining = count;
      super(source);
      if (/* Unimplemented IsExpression: count is! int */) throw new dart_core.ArgumentError(count);
    }
    _handleData(inputEvent, sink) {
      if (this._remaining > 0) {
        sink._add(inputEvent);
        this._remaining = 1;
        if (this._remaining === 0) {
          sink._close();
        }
      }
    }
  }

  class _TakeWhileStream extends _ForwardingStream {
    constructor(source, /* Unimplemented FunctionTypedFormalParameter: bool test(T value) */) {
      this._test = test;
      super(source);
    }
    _handleData(inputEvent, sink) {
      let satisfies = null;
      /* Unimplemented TryStatement: try {satisfies = _test(inputEvent);} catch (e, s) {_addErrorWithReplacement(sink, e, s); sink._close(); return;} */if (satisfies) {
        sink._add(inputEvent);
      }
       else {
        sink._close();
      }
    }
  }

  class _SkipStream extends _ForwardingStream {
    constructor(source, count) {
      this._remaining = count;
      super(source);
      if (/* Unimplemented IsExpression: count is! int */ || count < 0) throw new dart_core.ArgumentError(count);
    }
    _handleData(inputEvent, sink) {
      if (this._remaining > 0) {
        this._remaining--;
        return;
      }
      sink._add(inputEvent);
    }
  }

  class _SkipWhileStream extends _ForwardingStream {
    constructor(source, /* Unimplemented FunctionTypedFormalParameter: bool test(T value) */) {
      this._test = test;
      this._hasFailed = false;
      super(source);
    }
    _handleData(inputEvent, sink) {
      if (this._hasFailed) {
        sink._add(inputEvent);
        return;
      }
      let satisfies = null;
      /* Unimplemented TryStatement: try {satisfies = _test(inputEvent);} catch (e, s) {_addErrorWithReplacement(sink, e, s); _hasFailed = true; return;} */if (!satisfies) {
        this._hasFailed = true;
        sink._add(inputEvent);
      }
    }
  }

  class _DistinctStream extends _ForwardingStream {
    constructor(source, /* Unimplemented FunctionTypedFormalParameter: bool equals(T a, T b) */) {
      _SENTINEL = new dart_core.Object();
      this._previous = _SENTINEL;
      this._equals = equals;
      super(source);
    }
    _handleData(inputEvent, sink) {
      if (dart_core.identical(this._previous, _SENTINEL)) {
        this._previous = inputEvent;
        return sink._add(inputEvent);
      }
       else {
        let isEqual = null;
        /* Unimplemented TryStatement: try {if (_equals == null) {isEqual = (_previous == inputEvent);} else {isEqual = _equals(_previous, inputEvent);}} catch (e, s) {_addErrorWithReplacement(sink, e, s); return null;} */if (!isEqual) {
          sink._add(inputEvent);
          this._previous = inputEvent;
        }
      }
    }
  }

  class _EventSinkWrapper {
    constructor(_sink) {
      this._sink = _sink;
    }
    add(data) {
      this._sink._add(data);
    }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      this._sink._addError(error, stackTrace);
    }
    close() {
      this._sink._close();
    }
  }

  class _SinkTransformerStreamSubscription extends _BufferingStreamSubscription {
    constructor(source, mapper, /* Unimplemented FunctionTypedFormalParameter: void onData(T data) */, onError, /* Unimplemented FunctionTypedFormalParameter: void onDone() */, cancelOnError) {
      this._transformerSink = null;
      this._subscription = null;
      super(onData, onError, onDone, cancelOnError);
      let eventSink = new _EventSinkWrapper(this);
      this._transformerSink = mapper(eventSink);
      this._subscription = source.listen(this._handleData, /* Unimplemented NamedExpression: onError: _handleError */, /* Unimplemented NamedExpression: onDone: _handleDone */);
    }
    get _isSubscribed() { return this._subscription !== null; }
    _add(data) {
      if (_isClosed) {
        throw new dart_core.StateError("Stream is already closed");
      }
      super._add(data);
    }
    _addError(error, stackTrace) {
      if (_isClosed) {
        throw new dart_core.StateError("Stream is already closed");
      }
      super._addError(error, stackTrace);
    }
    _close() {
      if (_isClosed) {
        throw new dart_core.StateError("Stream is already closed");
      }
      super._close();
    }
    _onPause() {
      if (this._isSubscribed) this._subscription.pause();
    }
    _onResume() {
      if (this._isSubscribed) this._subscription.resume();
    }
    _onCancel() {
      if (this._isSubscribed) {
        let subscription = this._subscription;
        this._subscription = null;
        subscription.cancel();
      }
      return null;
    }
    _handleData(data) {
      /* Unimplemented TryStatement: try {_transformerSink.add(data);} catch (e, s) {_addError(e, s);} */}
    _handleError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      /* Unimplemented TryStatement: try {_transformerSink.addError(error, stackTrace);} catch (e, s) {if (identical(e, error)) {_addError(error, stackTrace);} else {_addError(e, s);}} */}
    _handleDone() {
      /* Unimplemented TryStatement: try {_subscription = null; _transformerSink.close();} catch (e, s) {_addError(e, s);} */}
  }

  class _StreamSinkTransformer {
    constructor(_sinkMapper) {
      this._sinkMapper = _sinkMapper;
    }
    bind(stream) { return new _BoundSinkStream(stream, this._sinkMapper); }
  }

  class _BoundSinkStream extends Stream {
    get isBroadcast() { return this._stream.isBroadcast; }
    constructor(_stream, _sinkMapper) {
      this._stream = _stream;
      this._sinkMapper = _sinkMapper;
      super();
    }
    listen(/* Unimplemented FunctionTypedFormalParameter: void onData(T event) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let onDone = opt$.onDone === undefined ? null : opt$.onDone;
      let cancelOnError = opt$.cancelOnError === undefined ? null : opt$.cancelOnError;
      cancelOnError = dart_core.identical(true, cancelOnError);
      let subscription = /* Unimplemented: DownCastExact: _SinkTransformerStreamSubscription<dynamic, dynamic> to StreamSubscription<T> */ new _SinkTransformerStreamSubscription(this._stream, this._sinkMapper, onData, onError, onDone, cancelOnError);
      return subscription;
    }
  }

  class _HandlerEventSink {
    constructor(_handleData, _handleError, _handleDone, _sink) {
      this._handleData = _handleData;
      this._handleError = _handleError;
      this._handleDone = _handleDone;
      this._sink = _sink;
    }
    add(data) { return this._handleData(data, this._sink); }
    addError(error, stackTrace) {
      if (stackTrace === undefined) stackTrace = null;
      return this._handleError(error, stackTrace, this._sink)
    }
    close() { return this._handleDone(this._sink); }
  }

  class _StreamHandlerTransformer extends _StreamSinkTransformer {
    constructor(opt$) {
      let handleData = opt$.handleData === undefined ? null : opt$.handleData;
      let handleError = opt$.handleError === undefined ? null : opt$.handleError;
      let handleDone = opt$.handleDone === undefined ? null : opt$.handleDone;
      super(/* Unimplemented: ClosureWrapLiteral: (EventSink<T>) → dynamic to (EventSink<T>) → EventSink<S> */ (outputSink) => {
        if (handleData === null) handleData = _defaultHandleData;
        if (handleError === null) handleError = _defaultHandleError;
        if (handleDone === null) handleDone = _defaultHandleDone;
        return new _HandlerEventSink(handleData, handleError, handleDone, outputSink);
      });
    }
    bind(stream) {
      return super.bind(stream);
    }
    static _defaultHandleData(data, sink) {
      sink.add(data);
    }
    static _defaultHandleError(error, stackTrace, sink) {
      sink.addError(error);
    }
    static _defaultHandleDone(sink) {
      sink.close();
    }
  }

  class _StreamSubscriptionTransformer {
    constructor(_transformer) {
      this._transformer = _transformer;
    }
    bind(stream) { return new _BoundSubscriptionStream(stream, this._transformer); }
  }

  class _BoundSubscriptionStream extends Stream {
    constructor(_stream, _transformer) {
      this._stream = _stream;
      this._transformer = _transformer;
      super();
    }
    listen(/* Unimplemented FunctionTypedFormalParameter: void onData(T event) */, opt$) {
      let onError = opt$.onError === undefined ? null : opt$.onError;
      let onDone = opt$.onDone === undefined ? null : opt$.onDone;
      let cancelOnError = opt$.cancelOnError === undefined ? null : opt$.cancelOnError;
      cancelOnError = dart_core.identical(true, cancelOnError);
      let result = this._transformer(this._stream, cancelOnError);
      result.onData(onData);
      result.onError(onError);
      result.onDone(onDone);
      return result;
    }
  }

  class Timer {
    constructor(duration, /* Unimplemented FunctionTypedFormalParameter: void callback() */) {
      if (dart.equals(Zone.current, Zone.ROOT)) {
        return Zone.current.createTimer(duration, callback);
      }
      return Zone.current.createTimer(duration, Zone.current.bindCallback(callback, /* Unimplemented NamedExpression: runGuarded: true */));
    }
    __init_periodic(duration, /* Unimplemented FunctionTypedFormalParameter: void callback(Timer timer) */) {
      if (dart.equals(Zone.current, Zone.ROOT)) {
        return Zone.current.createPeriodicTimer(duration, callback);
      }
      return Zone.current.createPeriodicTimer(duration, Zone.current.bindUnaryCallback(/* Unimplemented: ClosureWrap: (Timer) → void to (dynamic) → dynamic */ callback, /* Unimplemented NamedExpression: runGuarded: true */));
    }
    static run(/* Unimplemented FunctionTypedFormalParameter: void callback() */) {
      new Timer(dart_core.Duration.ZERO, callback);
    }
    static _createTimer(duration, /* Unimplemented FunctionTypedFormalParameter: void callback() */) {}
    static _createPeriodicTimer(duration, /* Unimplemented FunctionTypedFormalParameter: void callback(Timer timer) */) {}
  }
  Timer.periodic = function(duration, /* Unimplemented FunctionTypedFormalParameter: void callback(Timer timer) */) { this.__init_periodic(duration, /* Unimplemented FunctionTypedFormalParameter: void callback(Timer timer) */) };
  Timer.periodic.prototype = Timer.prototype;

  class AsyncError {
    constructor(error, stackTrace) {
      this.error = error;
      this.stackTrace = stackTrace;
    }
    toString() { return /* Unimplemented: DownCast: dynamic to String */ /* Unimplemented MethodInvocation: error.toString() */; }
  }

  class _ZoneFunction {
    constructor(zone, function) {
      this.zone = zone;
      this.function = function;
    }
  }

  class ZoneSpecification {
    constructor(opt$) {
      return new _ZoneSpecification(opt$);
    }
    __init_from(other, opt$) {
      let handleUncaughtError = opt$.handleUncaughtError === undefined ? null : opt$.handleUncaughtError;
      let run = opt$.run === undefined ? null : opt$.run;
      let runUnary = opt$.runUnary === undefined ? null : opt$.runUnary;
      let runBinary = opt$.runBinary === undefined ? null : opt$.runBinary;
      let registerCallback = opt$.registerCallback === undefined ? null : opt$.registerCallback;
      let registerUnaryCallback = opt$.registerUnaryCallback === undefined ? null : opt$.registerUnaryCallback;
      let registerBinaryCallback = opt$.registerBinaryCallback === undefined ? null : opt$.registerBinaryCallback;
      let errorCallback = opt$.errorCallback === undefined ? null : opt$.errorCallback;
      let scheduleMicrotask = opt$.scheduleMicrotask === undefined ? null : opt$.scheduleMicrotask;
      let createTimer = opt$.createTimer === undefined ? null : opt$.createTimer;
      let createPeriodicTimer = opt$.createPeriodicTimer === undefined ? null : opt$.createPeriodicTimer;
      let print = opt$.print === undefined ? null : opt$.print;
      let fork = opt$.fork === undefined ? null : opt$.fork;
      return new ZoneSpecification(/* Unimplemented NamedExpression: handleUncaughtError: handleUncaughtError != null ? handleUncaughtError : other.handleUncaughtError */, /* Unimplemented NamedExpression: run: run != null ? run : other.run */, /* Unimplemented NamedExpression: runUnary: runUnary != null ? runUnary : other.runUnary */, /* Unimplemented NamedExpression: runBinary: runBinary != null ? runBinary : other.runBinary */, /* Unimplemented NamedExpression: registerCallback: registerCallback != null ? registerCallback : other.registerCallback */, /* Unimplemented NamedExpression: registerUnaryCallback: registerUnaryCallback != null ? registerUnaryCallback : other.registerUnaryCallback */, /* Unimplemented NamedExpression: registerBinaryCallback: registerBinaryCallback != null ? registerBinaryCallback : other.registerBinaryCallback */, /* Unimplemented NamedExpression: errorCallback: errorCallback != null ? errorCallback : other.errorCallback */, /* Unimplemented NamedExpression: scheduleMicrotask: scheduleMicrotask != null ? scheduleMicrotask : other.scheduleMicrotask */, /* Unimplemented NamedExpression: createTimer: createTimer != null ? createTimer : other.createTimer */, /* Unimplemented NamedExpression: createPeriodicTimer: createPeriodicTimer != null ? createPeriodicTimer : other.createPeriodicTimer */, /* Unimplemented NamedExpression: print: print != null ? print : other.print */, /* Unimplemented NamedExpression: fork: fork != null ? fork : other.fork */);
    }
  }
  ZoneSpecification.from = function(other, opt$) { this.__init_from(other, opt$) };
  ZoneSpecification.from.prototype = ZoneSpecification.prototype;

  class _ZoneSpecification {
    constructor(opt$) {
      let handleUncaughtError = opt$.handleUncaughtError === undefined ? null : opt$.handleUncaughtError;
      let run = opt$.run === undefined ? null : opt$.run;
      let runUnary = opt$.runUnary === undefined ? null : opt$.runUnary;
      let runBinary = opt$.runBinary === undefined ? null : opt$.runBinary;
      let registerCallback = opt$.registerCallback === undefined ? null : opt$.registerCallback;
      let registerUnaryCallback = opt$.registerUnaryCallback === undefined ? null : opt$.registerUnaryCallback;
      let registerBinaryCallback = opt$.registerBinaryCallback === undefined ? null : opt$.registerBinaryCallback;
      let errorCallback = opt$.errorCallback === undefined ? null : opt$.errorCallback;
      let scheduleMicrotask = opt$.scheduleMicrotask === undefined ? null : opt$.scheduleMicrotask;
      let createTimer = opt$.createTimer === undefined ? null : opt$.createTimer;
      let createPeriodicTimer = opt$.createPeriodicTimer === undefined ? null : opt$.createPeriodicTimer;
      let print = opt$.print === undefined ? null : opt$.print;
      let fork = opt$.fork === undefined ? null : opt$.fork;
      this.handleUncaughtError = handleUncaughtError;
      this.run = run;
      this.runUnary = runUnary;
      this.runBinary = runBinary;
      this.registerCallback = registerCallback;
      this.registerUnaryCallback = registerUnaryCallback;
      this.registerBinaryCallback = registerBinaryCallback;
      this.errorCallback = errorCallback;
      this.scheduleMicrotask = scheduleMicrotask;
      this.createTimer = createTimer;
      this.createPeriodicTimer = createPeriodicTimer;
      this.print = print;
      this.fork = fork;
    }
  }

  class ZoneDelegate {
  }

  class Zone {
    __init__() {
      this.ROOT = /* Unimplemented: DownCast: dynamic to Zone */ _ROOT_ZONE;
      this._current = /* Unimplemented: DownCast: dynamic to Zone */ _ROOT_ZONE;
    }
    static get current() { return _current; }
    static _enter(zone) {
      /* Unimplemented AssertStatement: assert (zone != null); *//* Unimplemented AssertStatement: assert (!identical(zone, _current)); */let previous = _current;
      _current = zone;
      return previous;
    }
    static _leave(previous) {
      /* Unimplemented AssertStatement: assert (previous != null); */Zone._current = previous;
    }
  }
  Zone._ = function() { this.__init__() };
  Zone._.prototype = Zone.prototype;

  // Function _parentDelegate: (_Zone) → ZoneDelegate
  function _parentDelegate(zone) {
    if (zone.parent === null) return null;
    return zone.parent._delegate;
  }

  class _ZoneDelegate {
    constructor(_delegationTarget) {
      this._delegationTarget = _delegationTarget;
    }
    handleUncaughtError(zone, error, stackTrace) {
      let implementation = this._delegationTarget._handleUncaughtError;
      let implZone = implementation.zone;
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, error, stackTrace) */;
    }
    run(zone, /* Unimplemented FunctionTypedFormalParameter: f() */) {
      let implementation = this._delegationTarget._run;
      let implZone = implementation.zone;
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f) */;
    }
    runUnary(zone, /* Unimplemented FunctionTypedFormalParameter: f(arg) */, arg) {
      let implementation = this._delegationTarget._runUnary;
      let implZone = implementation.zone;
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f, arg) */;
    }
    runBinary(zone, /* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, arg1, arg2) {
      let implementation = this._delegationTarget._runBinary;
      let implZone = implementation.zone;
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f, arg1, arg2) */;
    }
    registerCallback(zone, /* Unimplemented FunctionTypedFormalParameter: f() */) {
      let implementation = this._delegationTarget._registerCallback;
      let implZone = implementation.zone;
      return /* Unimplemented: DownCast: dynamic to () → dynamic */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f) */;
    }
    registerUnaryCallback(zone, /* Unimplemented FunctionTypedFormalParameter: f(arg) */) {
      let implementation = this._delegationTarget._registerUnaryCallback;
      let implZone = implementation.zone;
      return /* Unimplemented: DownCast: dynamic to (dynamic) → dynamic */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f) */;
    }
    registerBinaryCallback(zone, /* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */) {
      let implementation = this._delegationTarget._registerBinaryCallback;
      let implZone = implementation.zone;
      return /* Unimplemented: DownCast: dynamic to (dynamic, dynamic) → dynamic */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f) */;
    }
    errorCallback(zone, error, stackTrace) {
      let implementation = this._delegationTarget._errorCallback;
      let implZone = implementation.zone;
      if (dart_core.identical(implZone, _ROOT_ZONE)) return null;
      return /* Unimplemented: DownCast: dynamic to AsyncError */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, error, stackTrace) */;
    }
    scheduleMicrotask(zone, /* Unimplemented FunctionTypedFormalParameter: f() */) {
      let implementation = this._delegationTarget._scheduleMicrotask;
      let implZone = implementation.zone;
      /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, f) */;
    }
    createTimer(zone, duration, /* Unimplemented FunctionTypedFormalParameter: void f() */) {
      let implementation = this._delegationTarget._createTimer;
      let implZone = implementation.zone;
      return /* Unimplemented: DownCast: dynamic to Timer */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, duration, f) */;
    }
    createPeriodicTimer(zone, period, /* Unimplemented FunctionTypedFormalParameter: void f(Timer timer) */) {
      let implementation = this._delegationTarget._createPeriodicTimer;
      let implZone = implementation.zone;
      return /* Unimplemented: DownCast: dynamic to Timer */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, period, f) */;
    }
    print(zone, line) {
      let implementation = this._delegationTarget._print;
      let implZone = implementation.zone;
      /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, line) */;
    }
    fork(zone, specification, zoneValues) {
      let implementation = this._delegationTarget._fork;
      let implZone = implementation.zone;
      return /* Unimplemented: DownCast: dynamic to Zone */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implZone, _parentDelegate(implZone), zone, specification, zoneValues) */;
    }
  }

  class _Zone {
    constructor() {
    }
    inSameErrorZone(otherZone) {
      return dart_core.identical(this, otherZone) || dart_core.identical(errorZone, otherZone.errorZone);
    }
  }

  class _CustomZone extends _Zone {
    get _delegate() {
      if (this._delegateCache !== null) return this._delegateCache;
      this._delegateCache = new _ZoneDelegate(this);
      return this._delegateCache;
    }
    constructor(parent, specification, _map) {
      this.parent = parent;
      this._map = _map;
      this._runUnary = null;
      this._run = null;
      this._runBinary = null;
      this._registerCallback = null;
      this._registerUnaryCallback = null;
      this._registerBinaryCallback = null;
      this._errorCallback = null;
      this._scheduleMicrotask = null;
      this._createTimer = null;
      this._createPeriodicTimer = null;
      this._print = null;
      this._fork = null;
      this._handleUncaughtError = null;
      this._delegateCache = null;
      super();
      this._run = (specification.run !== null) ? new _ZoneFunction(this, specification.run) : this.parent._run;
      this._runUnary = (specification.runUnary !== null) ? new _ZoneFunction(this, specification.runUnary) : this.parent._runUnary;
      this._runBinary = (specification.runBinary !== null) ? new _ZoneFunction(this, specification.runBinary) : this.parent._runBinary;
      this._registerCallback = (specification.registerCallback !== null) ? new _ZoneFunction(this, specification.registerCallback) : this.parent._registerCallback;
      this._registerUnaryCallback = (specification.registerUnaryCallback !== null) ? new _ZoneFunction(this, specification.registerUnaryCallback) : this.parent._registerUnaryCallback;
      this._registerBinaryCallback = (specification.registerBinaryCallback !== null) ? new _ZoneFunction(this, specification.registerBinaryCallback) : this.parent._registerBinaryCallback;
      this._errorCallback = (specification.errorCallback !== null) ? new _ZoneFunction(this, specification.errorCallback) : this.parent._errorCallback;
      this._scheduleMicrotask = (specification.scheduleMicrotask !== null) ? new _ZoneFunction(this, specification.scheduleMicrotask) : this.parent._scheduleMicrotask;
      this._createTimer = (specification.createTimer !== null) ? new _ZoneFunction(this, specification.createTimer) : this.parent._createTimer;
      this._createPeriodicTimer = (specification.createPeriodicTimer !== null) ? new _ZoneFunction(this, specification.createPeriodicTimer) : this.parent._createPeriodicTimer;
      this._print = (specification.print !== null) ? new _ZoneFunction(this, specification.print) : this.parent._print;
      this._fork = (specification.fork !== null) ? new _ZoneFunction(this, specification.fork) : this.parent._fork;
      this._handleUncaughtError = (specification.handleUncaughtError !== null) ? new _ZoneFunction(this, specification.handleUncaughtError) : this.parent._handleUncaughtError;
    }
    get errorZone() { return this._handleUncaughtError.zone; }
    runGuarded(/* Unimplemented FunctionTypedFormalParameter: f() */) {
      /* Unimplemented TryStatement: try {return run(f);} catch (e, s) {return handleUncaughtError(e, s);} */}
    runUnaryGuarded(/* Unimplemented FunctionTypedFormalParameter: f(arg) */, arg) {
      /* Unimplemented TryStatement: try {return runUnary(f, arg);} catch (e, s) {return handleUncaughtError(e, s);} */}
    runBinaryGuarded(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, arg1, arg2) {
      /* Unimplemented TryStatement: try {return runBinary(f, arg1, arg2);} catch (e, s) {return handleUncaughtError(e, s);} */}
    bindCallback(/* Unimplemented FunctionTypedFormalParameter: f() */, opt$) {
      let runGuarded = opt$.runGuarded === undefined ? true : opt$.runGuarded;
      let registered = this.registerCallback(f);
      if (runGuarded) {
        return () => this.this.runGuarded(registered);
      }
       else {
        return () => this.this.run(registered);
      }
    }
    bindUnaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg) */, opt$) {
      let runGuarded = opt$.runGuarded === undefined ? true : opt$.runGuarded;
      let registered = this.registerUnaryCallback(f);
      if (runGuarded) {
        return (arg) => this.this.runUnaryGuarded(registered, arg);
      }
       else {
        return (arg) => this.this.runUnary(registered, arg);
      }
    }
    bindBinaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, opt$) {
      let runGuarded = opt$.runGuarded === undefined ? true : opt$.runGuarded;
      let registered = this.registerBinaryCallback(f);
      if (runGuarded) {
        return (arg1, arg2) => this.this.runBinaryGuarded(registered, arg1, arg2);
      }
       else {
        return (arg1, arg2) => this.this.runBinary(registered, arg1, arg2);
      }
    }
    [](key) {
      let result = this._map[key];
      if (result !== null || this._map.containsKey(key)) return result;
      if (this.parent !== null) {
        let value = this.parent[key];
        if (value !== null) {
          this._map[key] = value;
        }
        return value;
      }
      /* Unimplemented AssertStatement: assert (this == _ROOT_ZONE); */return null;
    }
    handleUncaughtError(error, stackTrace) {
      let implementation = this._handleUncaughtError;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, error, stackTrace) */;
    }
    fork(opt$) {
      let specification = opt$.specification === undefined ? null : opt$.specification;
      let zoneValues = opt$.zoneValues === undefined ? null : opt$.zoneValues;
      let implementation = this._fork;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented: DownCast: dynamic to Zone */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, specification, zoneValues) */;
    }
    run(/* Unimplemented FunctionTypedFormalParameter: f() */) {
      let implementation = this._run;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f) */;
    }
    runUnary(/* Unimplemented FunctionTypedFormalParameter: f(arg) */, arg) {
      let implementation = this._runUnary;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f, arg) */;
    }
    runBinary(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, arg1, arg2) {
      let implementation = this._runBinary;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f, arg1, arg2) */;
    }
    registerCallback(/* Unimplemented FunctionTypedFormalParameter: f() */) {
      let implementation = this._registerCallback;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented: DownCast: dynamic to () → dynamic */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f) */;
    }
    registerUnaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg) */) {
      let implementation = this._registerUnaryCallback;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented: DownCast: dynamic to (dynamic) → dynamic */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f) */;
    }
    registerBinaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */) {
      let implementation = this._registerBinaryCallback;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented: DownCast: dynamic to (dynamic, dynamic) → dynamic */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f) */;
    }
    errorCallback(error, stackTrace) {
      let implementation = this._errorCallback;
      /* Unimplemented AssertStatement: assert (implementation != null); */let implementationZone = implementation.zone;
      if (dart_core.identical(implementationZone, _ROOT_ZONE)) return null;
      let parentDelegate = _parentDelegate(/* Unimplemented: DownCast: Zone to _Zone */ implementationZone);
      return /* Unimplemented: DownCast: dynamic to AsyncError */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementationZone, parentDelegate, this, error, stackTrace) */;
    }
    scheduleMicrotask(/* Unimplemented FunctionTypedFormalParameter: void f() */) {
      let implementation = this._scheduleMicrotask;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, f) */;
    }
    createTimer(duration, /* Unimplemented FunctionTypedFormalParameter: void f() */) {
      let implementation = this._createTimer;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented: DownCast: dynamic to Timer */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, duration, f) */;
    }
    createPeriodicTimer(duration, /* Unimplemented FunctionTypedFormalParameter: void f(Timer timer) */) {
      let implementation = this._createPeriodicTimer;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented: DownCast: dynamic to Timer */ /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, duration, f) */;
    }
    print(line) {
      let implementation = this._print;
      /* Unimplemented AssertStatement: assert (implementation != null); */let parentDelegate = _parentDelegate(implementation.zone);
      return /* Unimplemented FunctionExpressionInvocation: (implementation.function)(implementation.zone, parentDelegate, this, line) */;
    }
  }

  // Function _rootHandleUncaughtError: (Zone, ZoneDelegate, Zone, dynamic, StackTrace) → void
  function _rootHandleUncaughtError(self, parent, zone, error, stackTrace) {
    _schedulePriorityAsyncCallback(() => {
      throw new _UncaughtAsyncError(error, stackTrace);
    });
  }

  // Function _rootRun: (Zone, ZoneDelegate, Zone, () → dynamic) → dynamic
  function _rootRun(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f() */) {
    if (dart.equals(Zone._current, zone)) return f();
    let old = Zone._enter(zone);
    /* Unimplemented TryStatement: try {return f();} finally {Zone._leave(old);} */}

  // Function _rootRunUnary: (Zone, ZoneDelegate, Zone, (dynamic) → dynamic, dynamic) → dynamic
  function _rootRunUnary(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f(arg) */, arg) {
    if (dart.equals(Zone._current, zone)) return f(arg);
    let old = Zone._enter(zone);
    /* Unimplemented TryStatement: try {return f(arg);} finally {Zone._leave(old);} */}

  // Function _rootRunBinary: (Zone, ZoneDelegate, Zone, (dynamic, dynamic) → dynamic, dynamic, dynamic) → dynamic
  function _rootRunBinary(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, arg1, arg2) {
    if (dart.equals(Zone._current, zone)) return f(arg1, arg2);
    let old = Zone._enter(zone);
    /* Unimplemented TryStatement: try {return f(arg1, arg2);} finally {Zone._leave(old);} */}

  // Function _rootRegisterCallback: (Zone, ZoneDelegate, Zone, () → dynamic) → () → dynamic
  function _rootRegisterCallback(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f() */) {
    return f;
  }

  // Function _rootRegisterUnaryCallback: (Zone, ZoneDelegate, Zone, (dynamic) → dynamic) → (dynamic) → dynamic
  function _rootRegisterUnaryCallback(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f(arg) */) {
    return f;
  }

  // Function _rootRegisterBinaryCallback: (Zone, ZoneDelegate, Zone, (dynamic, dynamic) → dynamic) → (dynamic, dynamic) → dynamic
  function _rootRegisterBinaryCallback(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */) {
    return f;
  }

  // Function _rootErrorCallback: (Zone, ZoneDelegate, Zone, Object, StackTrace) → AsyncError
  function _rootErrorCallback(self, parent, zone, error, stackTrace) { return null; }

  // Function _rootScheduleMicrotask: (Zone, ZoneDelegate, Zone, () → dynamic) → void
  function _rootScheduleMicrotask(self, parent, zone, /* Unimplemented FunctionTypedFormalParameter: f() */) {
    if (!dart_core.identical(_ROOT_ZONE, zone)) {
      let hasErrorHandler = /* Unimplemented postfix operator: !_ROOT_ZONE.inSameErrorZone(zone) */;
      f = zone.bindCallback(f, /* Unimplemented NamedExpression: runGuarded: hasErrorHandler */);
    }
    _scheduleAsyncCallback(f);
  }

  // Function _rootCreateTimer: (Zone, ZoneDelegate, Zone, Duration, () → void) → Timer
  function _rootCreateTimer(self, parent, zone, duration, /* Unimplemented FunctionTypedFormalParameter: void callback() */) {
    if (!dart_core.identical(_ROOT_ZONE, zone)) {
      callback = zone.bindCallback(callback);
    }
    return Timer._createTimer(duration, callback);
  }

  // Function _rootCreatePeriodicTimer: (Zone, ZoneDelegate, Zone, Duration, (Timer) → void) → Timer
  function _rootCreatePeriodicTimer(self, parent, zone, duration, /* Unimplemented FunctionTypedFormalParameter: void callback(Timer timer) */) {
    if (!dart_core.identical(_ROOT_ZONE, zone)) {
      callback = zone.bindUnaryCallback(/* Unimplemented: ClosureWrap: (Timer) → void to (dynamic) → dynamic */ callback);
    }
    return Timer._createPeriodicTimer(duration, callback);
  }

  // Function _rootPrint: (Zone, ZoneDelegate, Zone, String) → void
  function _rootPrint(self, parent, zone, line) {
    dart._internal.printToConsole(line);
  }

  // Function _printToZone: (String) → void
  function _printToZone(line) {
    Zone.current.print(line);
  }

  // Function _rootFork: (Zone, ZoneDelegate, Zone, ZoneSpecification, Map<dynamic, dynamic>) → Zone
  function _rootFork(self, parent, zone, specification, zoneValues) {
    dart._internal.printToZone = _printToZone;
    if (specification === null) {
      specification = new ZoneSpecification();
    }
     else if (/* Unimplemented IsExpression: specification is! _ZoneSpecification */) {
      throw new dart_core.ArgumentError("ZoneSpecifications must be instantiated" + " with the provided constructor.");
    }
    let valueMap = null;
    if (zoneValues === null) {
      if (/* Unimplemented IsExpression: zone is _Zone */) {
        valueMap = /* Unimplemented: DownCast: dynamic to Map<dynamic, dynamic> */ zone._map;
      }
       else {
        valueMap = new dart.collection.HashMap();
      }
    }
     else {
      valueMap = new dart.collection.HashMap.from(zoneValues);
    }
    return new _CustomZone(zone, specification, valueMap);
  }

  class _RootZoneSpecification {
    get handleUncaughtError() { return _rootHandleUncaughtError; }
    get run() { return _rootRun; }
    get runUnary() { return _rootRunUnary; }
    get runBinary() { return _rootRunBinary; }
    get registerCallback() { return _rootRegisterCallback; }
    get registerUnaryCallback() { return _rootRegisterUnaryCallback; }
    get registerBinaryCallback() { return _rootRegisterBinaryCallback; }
    get errorCallback() { return _rootErrorCallback; }
    get scheduleMicrotask() { return _rootScheduleMicrotask; }
    get createTimer() { return _rootCreateTimer; }
    get createPeriodicTimer() { return _rootCreatePeriodicTimer; }
    get print() { return _rootPrint; }
    get fork() { return _rootFork; }
  }

  class _RootZone extends _Zone {
    constructor() {
      _rootMap = new dart.collection.HashMap();
      this._rootDelegate = null;
      super();
    }
    get _run() { return new _ZoneFunction(_ROOT_ZONE, _rootRun); }
    get _runUnary() { return new _ZoneFunction(_ROOT_ZONE, _rootRunUnary); }
    get _runBinary() { return new _ZoneFunction(_ROOT_ZONE, _rootRunBinary); }
    get _registerCallback() { return new _ZoneFunction(_ROOT_ZONE, _rootRegisterCallback); }
    get _registerUnaryCallback() { return new _ZoneFunction(_ROOT_ZONE, _rootRegisterUnaryCallback); }
    get _registerBinaryCallback() { return new _ZoneFunction(_ROOT_ZONE, _rootRegisterBinaryCallback); }
    get _errorCallback() { return new _ZoneFunction(_ROOT_ZONE, _rootErrorCallback); }
    get _scheduleMicrotask() { return new _ZoneFunction(_ROOT_ZONE, _rootScheduleMicrotask); }
    get _createTimer() { return new _ZoneFunction(_ROOT_ZONE, _rootCreateTimer); }
    get _createPeriodicTimer() { return new _ZoneFunction(_ROOT_ZONE, _rootCreatePeriodicTimer); }
    get _print() { return new _ZoneFunction(_ROOT_ZONE, _rootPrint); }
    get _fork() { return new _ZoneFunction(_ROOT_ZONE, _rootFork); }
    get _handleUncaughtError() { return new _ZoneFunction(_ROOT_ZONE, _rootHandleUncaughtError); }
    get parent() { return null; }
    get _map() { return _rootMap; }
    get _delegate() {
      if (_rootDelegate !== null) return _rootDelegate;
      return _rootDelegate = new _ZoneDelegate(this);
    }
    get errorZone() { return this; }
    runGuarded(/* Unimplemented FunctionTypedFormalParameter: f() */) {
      /* Unimplemented TryStatement: try {if (identical(_ROOT_ZONE, Zone._current)) {return f();} return _rootRun(null, null, this, f);} catch (e, s) {return handleUncaughtError(e, s);} */}
    runUnaryGuarded(/* Unimplemented FunctionTypedFormalParameter: f(arg) */, arg) {
      /* Unimplemented TryStatement: try {if (identical(_ROOT_ZONE, Zone._current)) {return f(arg);} return _rootRunUnary(null, null, this, f, arg);} catch (e, s) {return handleUncaughtError(e, s);} */}
    runBinaryGuarded(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, arg1, arg2) {
      /* Unimplemented TryStatement: try {if (identical(_ROOT_ZONE, Zone._current)) {return f(arg1, arg2);} return _rootRunBinary(null, null, this, f, arg1, arg2);} catch (e, s) {return handleUncaughtError(e, s);} */}
    bindCallback(/* Unimplemented FunctionTypedFormalParameter: f() */, opt$) {
      let runGuarded = opt$.runGuarded === undefined ? true : opt$.runGuarded;
      if (runGuarded) {
        return () => this.this.runGuarded(f);
      }
       else {
        return () => this.this.run(f);
      }
    }
    bindUnaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg) */, opt$) {
      let runGuarded = opt$.runGuarded === undefined ? true : opt$.runGuarded;
      if (runGuarded) {
        return (arg) => this.this.runUnaryGuarded(f, arg);
      }
       else {
        return (arg) => this.this.runUnary(f, arg);
      }
    }
    bindBinaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, opt$) {
      let runGuarded = opt$.runGuarded === undefined ? true : opt$.runGuarded;
      if (runGuarded) {
        return (arg1, arg2) => this.this.runBinaryGuarded(f, arg1, arg2);
      }
       else {
        return (arg1, arg2) => this.this.runBinary(f, arg1, arg2);
      }
    }
    [](key) { return null; }
    handleUncaughtError(error, stackTrace) {
      return _rootHandleUncaughtError(null, null, this, error, stackTrace);
    }
    fork(opt$) {
      let specification = opt$.specification === undefined ? null : opt$.specification;
      let zoneValues = opt$.zoneValues === undefined ? null : opt$.zoneValues;
      return _rootFork(null, null, this, specification, zoneValues);
    }
    run(/* Unimplemented FunctionTypedFormalParameter: f() */) {
      if (dart_core.identical(Zone._current, _ROOT_ZONE)) return f();
      return _rootRun(null, null, this, f);
    }
    runUnary(/* Unimplemented FunctionTypedFormalParameter: f(arg) */, arg) {
      if (dart_core.identical(Zone._current, _ROOT_ZONE)) return f(arg);
      return _rootRunUnary(null, null, this, f, arg);
    }
    runBinary(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */, arg1, arg2) {
      if (dart_core.identical(Zone._current, _ROOT_ZONE)) return f(arg1, arg2);
      return _rootRunBinary(null, null, this, f, arg1, arg2);
    }
    registerCallback(/* Unimplemented FunctionTypedFormalParameter: f() */) { return f; }
    registerUnaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg) */) { return f; }
    registerBinaryCallback(/* Unimplemented FunctionTypedFormalParameter: f(arg1, arg2) */) { return f; }
    errorCallback(error, stackTrace) { return null; }
    scheduleMicrotask(/* Unimplemented FunctionTypedFormalParameter: void f() */) {
      _rootScheduleMicrotask(null, null, this, f);
    }
    createTimer(duration, /* Unimplemented FunctionTypedFormalParameter: void f() */) {
      return Timer._createTimer(duration, f);
    }
    createPeriodicTimer(duration, /* Unimplemented FunctionTypedFormalParameter: void f(Timer timer) */) {
      return Timer._createPeriodicTimer(duration, f);
    }
    print(line) {
      dart._internal.printToConsole(line);
    }
  }

  let _ROOT_ZONE = new _RootZone();
  // Function runZoned: (() → dynamic, {zoneValues: Map<dynamic, dynamic>, zoneSpecification: ZoneSpecification, onError: Function}) → dynamic
  function runZoned(/* Unimplemented FunctionTypedFormalParameter: body() */, opt$) {
    let zoneValues = opt$.zoneValues === undefined ? null : opt$.zoneValues;
    let zoneSpecification = opt$.zoneSpecification === undefined ? null : opt$.zoneSpecification;
    let onError = opt$.onError === undefined ? null : opt$.onError;
    let errorHandler = null;
    if (onError !== null) {
      errorHandler = (self, parent, zone, error, stackTrace) => {
        /* Unimplemented TryStatement: try {if (onError is ZoneBinaryCallback) {return self.parent.runBinary(onError, error, stackTrace);} return self.parent.runUnary(onError, error);} catch (e, s) {if (identical(e, error)) {return parent.handleUncaughtError(zone, error, stackTrace);} else {return parent.handleUncaughtError(zone, e, s);}} */};
    }
    if (zoneSpecification === null) {
      zoneSpecification = new ZoneSpecification(/* Unimplemented NamedExpression: handleUncaughtError: errorHandler */);
    }
     else if (errorHandler !== null) {
      zoneSpecification = new ZoneSpecification.from(zoneSpecification, /* Unimplemented NamedExpression: handleUncaughtError: errorHandler */);
    }
    let zone = Zone.current.fork(/* Unimplemented NamedExpression: specification: zoneSpecification */, /* Unimplemented NamedExpression: zoneValues: zoneValues */);
    if (onError !== null) {
      return zone.runGuarded(body);
    }
     else {
      return zone.run(body);
    }
  }

  // Exports:
  dart.async.DeferredLibrary = DeferredLibrary;
  dart.async.DeferredLoadException = DeferredLoadException;
  dart.async.Future = Future;
  dart.async.TimeoutException = TimeoutException;
  dart.async.Completer = Completer;
  dart.async.scheduleMicrotask = scheduleMicrotask;
  dart.async.Stream = Stream;
  dart.async.StreamSubscription = StreamSubscription;
  dart.async.EventSink = EventSink;
  dart.async.StreamView = StreamView;
  dart.async.StreamConsumer = StreamConsumer;
  dart.async.StreamSink = StreamSink;
  dart.async.StreamTransformer = StreamTransformer;
  dart.async.StreamIterator = StreamIterator;
  dart.async.StreamController = StreamController;
  dart.async.Timer = Timer;
  dart.async.AsyncError = AsyncError;
  dart.async.ZoneSpecification = ZoneSpecification;
  dart.async.ZoneDelegate = ZoneDelegate;
  dart.async.Zone = Zone;
  dart.async.runZoned = runZoned;
})(dart.async || (dart.async = {}));