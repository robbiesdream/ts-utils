import {Type} from "./type.util";

export type ExtractFunctionArguments<Fn> = Fn extends (...args: infer P) => any ? P : never
export type ExtractFunctionReturnValue<Fn> = Fn extends (...args: any[]) => infer P ? P : never
export type ExtractFromType<T> = T extends Type<infer C> ? C : never

export type BooleanSwitch<Test, T = true, F = false> = Test extends true ? T : F
export type AnyFunction = (...args: any[]) => any
export type IsFinite<Tuple extends any[], Finite, Infinite> =
  Tuple extends [] ? Finite :
    Tuple extends Array<infer Element> ?
      Element[] extends Tuple ?
        Infinite
        : Tuple extends [any, ...infer Rest]
          ? IsFinite<Rest, Finite, Infinite>
          : never
      : never
export type Prepend<Tuple extends any[], Addend> = [Addend, ...Tuple]
export type Reverse<Tuple extends any[], Prefix extends any[] = []> = {
  empty: Prefix,
  nonEmpty: Tuple extends [infer First, ...infer Next]
    ? Reverse<Next, Prepend<Prefix, First>>
    : never
  infinite: {
    ERROR: 'Cannot reverse an infinite tuple'
    CODENAME: 'InfiniteTuple'
  }
}[
  Tuple extends [any, ...any[]]
    ? IsFinite<Tuple, 'nonEmpty', 'infinite'>
    : 'empty'
  ]
type Arbitrary = 'It was 1554792354 seconds since Jan 01, 1970 when I wrote this'
export type IsAny<O, T = true, F = false> = Arbitrary extends O
  ? any extends O
    ? T
    : F
  : F
