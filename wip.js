function pjs(id) {

    // About object is returned if there is no 'id' parameter
    var about = {
        Version: '0.1.0',
        Author: "PatrickJS"
    };

    if (id) {

        // Avoid clobbering the window scope:
        // return a new pjs object if we're in the wrong scope
        if (window === this) {
            return new pjs(id);
        }

        // We're in the correct object scope:
        // Init our element object and return the object
        this.e = document.getElementById(id);
        return this;
    } else {
    // No 'id' parameter was given, return the 'about' object
        return about;
    }
};

pjs.prototype = {
}


;(function(global) {
  var pjs = {
    VERSION: '0.0.1',
    Author: 'PatrickJS'
  };

  if (global.pjs) {
    throw new Error('pjs has already been defined');
  } else {
    global.pjs = pjs;
  }
}(typeof window === 'undefined' ? this : window));
