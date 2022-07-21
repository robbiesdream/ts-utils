import tail from 'lodash-es/tail'
import head from 'lodash-es/head'

import {Type} from "../types/type.util";
import {ExtractFromMixin, Mixin} from "./mixin.artisan";
import {Merge} from "type-fest";
import {ExtractFromType} from "../types/utils.types";

type MixinsArray = [Mixin<unknown>, ...Mixin<unknown>[]]
type UnknownType = Type<unknown>

export type RecursiveMergeMixins<M extends any[], PreviousType = Record<string, unknown>, ReturnType = any> = {
  'next': M extends [infer First extends Mixin, ...infer Next extends Mixin[]]
    ? Next extends []
      ? RecursiveMergeMixins<[], void, Merge<PreviousType, ExtractFromMixin<First>>>
      : RecursiveMergeMixins<Next, Merge<PreviousType, ExtractFromMixin<First>>>
    : never
  'done': ReturnType
}[M extends [] ? 'done' : 'next']

export const MixinsComposer =
  <Fns extends MixinsArray, Base extends Type>
  (mixins: Fns, baseClass: Base, reversed = true)
    : Type<ExtractFromType<Base> & RecursiveMergeMixins<Fns>> => {
    const processableMixins = reversed ? mixins.reverse() : mixins
    const remaining: [Mixin<unknown>, ...Mixin<unknown>[]] = tail(processableMixins)
    const currentMixin = head(mixins)
    if (remaining.length > 0) {
      const following = MixinsComposer(remaining, baseClass, false)
      return currentMixin(following)
    }
    return currentMixin(baseClass)
  }
