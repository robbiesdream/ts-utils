import {Type} from "../types/type.util";
import {ExtractFromType, ExtractFunctionReturnValue} from "../types/utils.types";

type AnyFunction = (...args: any[]) => any
const noopFn = () => null
export type Mixin<T = unknown> = (baseClass?: Type<any>) => Type<T>
export type ExtractFromMixin<T extends Mixin<any>> = ExtractFromType<ExtractFunctionReturnValue<T>>

export class MixinArtisan {

  public static craft<T>(MixableType: Type<T>) {
    return (baseClass?) => {

      const constructorName = `${MixableType.name}Mixable`

      const Base = baseClass || class BaseClass {
      }

      const ClassStore = {
        [constructorName]: class extends Base {
          constructor() {
            super();
            if (typeof this[MixableType.name] === 'function') {
              this[MixableType.name]()
            }
          }
        }
      }

      const FinalClass = ClassStore[constructorName]

      const nonTransportableProperties = ['constructor']

      Object.getOwnPropertyNames(MixableType.prototype).filter(p => !nonTransportableProperties.includes(p)).forEach((name) => {
        FinalClass.prototype[name] = MixableType.prototype[name];
      });


      return ClassStore[constructorName] as Type<T>
    }
  }
}
