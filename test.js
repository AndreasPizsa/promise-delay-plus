const should = require('should');
require('.')();

describe('Promise.delay()', function(){
  const milliseconds = 1000;
  const startTime = Date.now();
  const targetTime = startTime + milliseconds;
  const targetValue= Math.random().toString(36);
  var promise;

  it('Returns a promise', function(){
    promise = Promise.delay(milliseconds, targetValue).then(function(value){promise.isResolved=value});
    promise.isResolved = false;
    (promise instanceof Promise).should.be.true();
    promise.isResolved.should.be.false();
  });

  it('that will be resolved with value (or undefined) after given ms milliseconds.', function(done){
    this.timeout(milliseconds+1000);

    function shouldNotBeResolved()
    {
      if(Date.now() < targetTime) {
        promise.isResolved.should.be.false();
        return setTimeout(shouldNotBeResolved,100);
      }

      process.nextTick(shouldBeResolved);
    }

    function shouldBeResolved()
    {
      if(!promise.isResolved && Date.now() < targetTime + 500) {
        return setTimeout(shouldBeResolved,100);
      }
      promise.isResolved.should.be.equal(targetValue);
      done();
    }

    shouldNotBeResolved();
  });

  it('will attach a delay() function to the prototype', function() {
    return Promise.resolve(100).delay(0).then(function(value){
      value.should.be.equal(100);
    });
  });

    it('does not install over existing implementations',function(){
    var Bluebird = require('bluebird');
    var delay = Bluebird.delay;
    var promise = Bluebird.resolve(100);
    var protoDelay = promise.constructor.prototype.delay;

    require('.')(Bluebird);

    Bluebird.delay.should.be.equal(delay);
    promise.constructor.prototype.delay.should.be.equal(protoDelay);
  });

});
