!function() {
  'use strict';

  var global = this;

  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Start PatrickJS
  var pjs = {};
  global.pjs = pjs;

  pjs.isUndefined = function(value) {
    return typeof value === 'undefined';
  };

  pjs.isDefined = function(value) {
    return typeof value !== 'undefined';
  };

  pjs.isFunction = function(value) {
    return typeof value === 'function';
  };

  pjs.isArray = function(value) {
    return Array.isArray(value);
  };

  pjs.isString = function(value){
    return typeof value === 'string';
  };

  pjs.identity = function(value) {
    return value;
  };

  pjs.first = function(array, index) {
    if (pjs.isUndefined(index)) return array[0];
    var _array = [];
    if (index) {
      for (var i = 0; i < index; i++) {
        var temp = array[i];
        if (pjs.isDefined(temp)) {
          _array.push(temp);
        }
      }
    }
    return _array;
  };

  pjs.last = function(array, index) {
    var length = array.length-1;
    if (index > length) {
      return array;
    } else if (index === 0) {
      return [];
    } else if (pjs.isDefined(index)) {
      var tempArray = [];
      for (var i = length; i >= index-1; i--) {
        tempArray.unshift(array[i]);
      }
      return tempArray;
    } else {
      return array[length];
    }
  };

  pjs.each = function(collection, iterator) {
    if (pjs.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else {
      for (var key in collection) {
        if (collection.hasOwnProperty(key)) {
          iterator(collection[key], key, collection);
        }
      }

    }
  };

  pjs.indexOf = function(collection, target, start) {
    start = start || 0;
    var length = collection.length-1;
    for (var i = 0 + start; i < length; i++) {
      if (collection[i] === target) {
        return i;
      }
    }
    return -1;
  };


  pjs.checkEvent = function(event) {
    if (pjs.isString(event)) {
      throw new TypeError('Event is not a string.');
    }
  };

  pjs.checkHandler = function(handler) {
    if (!pjs.isFunction(handler)) {
      throw new TypeError('Handler is not a function');
    }
  };

  var handlers = {};
  var pubsub = {};

  pjs.publish = pjs.pub = function(event) {
    pjs.checkEvent(event);

    if (!handlers[event]) {
      return;
    }

    var ctx = { event: event, args: slice.call(arguments, 1) };

    for (var i = 0, l = handlers[event].length; i < l; i++) {
      handlers[event][i].apply(ctx, ctx.args);
    }

  };

  pjs.subscribe = pjs.sub = function(event, handler) {
    pjs.checkEvent(event);
    pjs.checkHandler(handler);
    (handlers[event] = handlers[event] || []).push(handler);
  };


  pjs.unsubscribe = pjs.unsub = function() {
    var args = slice.call(arguments);
    var event, handler, i, l;

    if (args.length >= 2) {
      event = args[0];
      handler = args[1];

      pjs.checkEvent(event);
      pjs.checkHandler(handler);

      if (!handlers[event]) {
        return;
      }

      for (i = 0, l = handlers[event].length; i < l; i++) {
        if (handlers[event][i] === handler) {
          handlers[event].splice(i, 1);
        }
      }
    } else {
      handler = args[0];

      pjs.checkHandler(handler);

      for (event in handlers) {
        for (i = 0, l = handlers[event].length; i < l; i++) {
          if (handlers[event][i] === handler) {
            handlers[event].splice(i, 1);
          } // end handlers in event
        } // end for loop
      } // end for event
    } // end else
  }; // end sub


  pjs.Promises = function() {

    // promises state
    var State = {
      _PENDING:   0,
      _FULFILLED: 1,
      _REJECTED:  2
    };

    var Promises = {
      state: State._PENDING,
      changeState: function(state, value)  {

        // catch changing to state (perhaps trying to change value)
        if (this.state === state) {
          return new Error('can\'t transition to same state: ' + state);
        }

        // trying to change out of fulfilled or rejected
        if (this.state === State._FULFILLED || this.state === State._REJECTED) {
          return new Error('can\'t transition from current state: ' + state);
        }

        // if the second argument is't given at all (passing undefined allowed)
        if (state === State._FULFILLED && arguments.length < 2) {
          return new Error('transition to fulfilled must have a non \'null\' value');
        }

        // if a null reason is passed in
        if (state === State._REJECTED && arguments.length < 2) {
          return new Error('transition to rejected must have a non \'null\' reason');
        }

        // change state
        this.state = state;
        this.value = value;
        this.resolve();

        return this.state;
      },
      async: function(fn) {
        setTimeout(fn, 5);
      },
      fulfill: function(value) {
        this.changeState(State._FULFILLED, value);
      },
      reject: function(reason) {
        this.changeState(State._REJECTED, reason);
      },
      then: function(onFulfilled, onRejected) {
        var promise = Object.create(Promises),
            self    = this;

        // initialize array for cache
        self.cache = self.cache || [];

        this.async(function() {
          self.cache.push({
            fulfill: onFulfilled,
            reject:  onRejected,
            promise: promise
          });
          self.resolve();
        });

        // chaining promises
        return promise;
      },
      resolve: function() {

        // check state if pending state
        if (this.state === State._PENDING) {
          return false;
        }

        // for each 'then'
        while (this.cache && this.cache.length) {
          var obj = this.cache.shift();

          // get the function based on state
          var fn = (this.state === State._FULFILLED) ?
                                         obj.fulfill :
                                          obj.reject;

          if (typeof fn !== 'function') {
            obj.promise.changeState(this.state, this.value);
          } else {

            // fulfill promise with a value or reject with an error
            try {

              var value = fn(this.value);

              // deal with promise returned
              if (value && typeof value.then === 'function') {
                value.then(function(value) {
                  obj.promise.changeState(State._FULFILLED, value);
                }, function(reason) {
                  obj.promise.changeState(State._REJECTED, error);
                });

              // deal with other value returned
              } else {
                obj.promise.changeState(State._FULFILLED, value);
              } // end if promise is returned

            // deal with error thrown
            } catch (error) {
              obj.promise.changeState(State._REJECTED, error);
            }

          } // end else typeof 'function'

        } // end while this.cache

      } // end resolve method
    }; // end Promises


    return Object.create(Promises);
  };

  if (pjs.isDefined(exports)) {
    if (pjs.isDefined(module) && module.exports) {
      exports = module.exports = pjs;
    }
    exports.pjs = pjs;
  } else {
    global.pjs = pjs;
  }

}.call(this);
