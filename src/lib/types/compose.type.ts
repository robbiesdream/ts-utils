import {AnyFunction, Reverse} from "./utils.types";
import {Pipe} from "./pipe.type";

export type Compose<Fns extends any[]> = Pipe<Reverse<Fns>, false>
export type ComposeFn = <Fns extends [AnyFunction, ...AnyFunction[]]>(
  ...fns: Fns &
    Compose<Fns> extends AnyFunction
    ? Fns
    : never
) => Compose<Fns>
