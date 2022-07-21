import {Merge} from "type-fest";

export type RecursiveMerge<M extends any[], PreviousType = void, ReturnType = any> = {
  'next': M extends [infer First, ...infer Next]
    ? PreviousType extends void
      ? RecursiveMerge<Next, First>
      : Next extends []
        ? RecursiveMerge<[], ReturnType, Merge<PreviousType, First>>
        : RecursiveMerge<Next, Merge<PreviousType, First>>
    : never
  'done': ReturnType
}[M extends [] ? 'done' : 'next']

// type First = { foo: string }
// type Second = { baz: string }
// type Base = { base: boolean }
//
// type Mixed = RecursiveMerge<[First, Second, Base]>
//
// const Ob: Mixed = {
//   base: true,
//   baz: '',
//   foo: ''
// }
