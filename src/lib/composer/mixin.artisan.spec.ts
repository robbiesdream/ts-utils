import {MixinArtisan} from "./mixin.artisan";

class Logger {
  loggableProperty: string

  Logger() {
    this.loggableProperty = 'World'
    this.log()
  }

  log() {
    return this.loggableProperty
  }
}

class BaseClass {
  public loggableProperty = 'Hello!'
  iAmTheBase(){
    console.log('I am the base!')
  }
}

describe(MixinArtisan.name, function () {
  describe('when creating a new mixin from type', () => {
    const LoggerMixable = MixinArtisan.craft<Logger>(Logger)<BaseClass>(BaseClass)
    let logger: Logger

    beforeEach(() => {
      logger = new LoggerMixable()
    })
    it('should create instances of correct type', () => {
      expect(logger).toBeInstanceOf(LoggerMixable)
    })
    it('should return a composable mixin with suffixed name', () => {
      expect(logger.constructor.name).toEqual('LoggerMixable')
    })
    it('should have all members of mixin class', () => {
      expect(logger).toHaveProperty('log')
    })
    it('should have all base class members', () => {
      expect(logger).toHaveProperty('iAmTheBase')
    })
    it('should have base class properties accessible from mixable class', ()=>{
      expect(logger.log()).toEqual('World')
    })
  })
  describe('when extending from a mixin', () => {
    const LoggerMixin = MixinArtisan.craft<Logger>(Logger)
    const LoggerMixable = LoggerMixin<BaseClass>(BaseClass)
    class MyTestClass extends LoggerMixable {}
    let testInstance: MyTestClass

    beforeEach(() => {
      testInstance = new MyTestClass()
    })
    it('should execute the initializing methods of the mixins', () => {
      expect(testInstance.loggableProperty).toEqual("World")
    })
  })
});
