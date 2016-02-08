/*!
 * promise-delay <https://github.com/AndreasPizsa/promise-delay>
 *
 * Copyright (c) 2016, Andreas Pizsa.
 * Licensed under the MIT License.
 */

var globals = typeof window === 'undefined' ? global : window;

/**
 *
 * @param {Promise}
 * @api public
 */
var install = module.exports = function install(PromiseLib) {

  PromiseLib = PromiseLib || Promise;

  if(!PromiseLib.delay) PromiseLib.delay = function(milliseconds, value) {
    function returnResolvedValue(value) {
      return new PromiseLib(function(resolve){
        globals.setTimeout(resolve.bind(this,value),milliseconds);
      });
    }

    return  (value instanceof PromiseLib)
      ? value.then(returnResolvedValue.bind(this))
      : returnResolvedValue(value);
  };

  var Prototype = PromiseLib.resolve(100).constructor.prototype;
  if(!Prototype.delay) Prototype.delay = function(milliseconds) {
    return PromiseLib.delay(milliseconds,this);
  }
};

