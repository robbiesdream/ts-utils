import {MixinsComposer} from "./mixins.composer";
import {MixinArtisan} from "./mixin.artisan";

class MixinOne {
  expectedProperty: string
  expectedFromOne = 0

  MixinOne() {
    this.expectedFromOne = 1
    this.expectedProperty += 'Mixin One Added'
  }
}

const MixinOneMixin = MixinArtisan.craft<MixinOne>(MixinOne)

class MixinTwo {
  expectedProperty: string
  expectedFromTwo = 2

  MixinTwo() {
    this.expectedProperty += ' - Mixin Two Added'
  }
}

const MixinTwoMixin = MixinArtisan.craft<MixinTwo>(MixinTwo)

class BaseClass {
  expectedProperty = ''
  fromTheBase: boolean

  constructor() {
    this.fromTheBase = true
  }
}

class TestClass extends MixinsComposer([MixinOneMixin, MixinTwoMixin], BaseClass) {
  getExpectedProperty() {
    return this.expectedProperty
  }
}

describe(MixinsComposer.name, function () {
  let testInstance: TestClass
  let testMixinOne: MixinOne
  let testMixinTwo: MixinTwo
  beforeEach(() => {
    testInstance = new TestClass()
    testMixinOne = new MixinOne()
    testMixinTwo = new MixinTwo()
  })
  it('should execute base class constructor first', () => {
    expect(() => new TestClass()).not.toThrow()
  })
  it('should compose mixins in the correct order', () => {
    expect(testInstance.getExpectedProperty()).toEqual('Mixin One Added - Mixin Two Added')
  })
  it('should return a class with all the methods of MixinOne', () => {
    expect(testInstance).toHaveProperty('MixinOne')
    expect(testInstance).toHaveProperty('MixinTwo')
  })
  it('should not execute constructor assignations', () => {
    expect(testInstance.expectedFromOne).not.toEqual(0)
  })
  it('should keep values defined in mixins initializers', () => {
    expect(testInstance.expectedFromOne).toEqual(1)
  })
});
