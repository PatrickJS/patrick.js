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

  if (pjs.isDefined(exports)) {
    if (pjs.isDefined(module) && module.exports) {
      exports = module.exports = pjs;
    }
    exports.pjs = pjs;
  } else {
    global.pjs = pjs;
  }

}.call(this);
