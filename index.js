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


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = pjs;
    }
    exports.pjs = pjs;
  } else {
    global.pjs = pjs;
  }

}.call(this);
