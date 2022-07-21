import tail from 'lodash-es/tail'
import head from 'lodash-es/head'

import {Type} from "../types/type.util";
import {ExtractFromMixin, Mixin} from "./mixin.artisan";
import {Merge} from "type-fest";
import {ExtractFromType} from "../types/utils.types";

type MixinsArray = [Mixin, ...Mixin[]]

export type RecursiveMergeMixins<M extends unknown[], PreviousType = Record<string, unknown>, ReturnType = unknown> = {
  'next': M extends [infer First extends Mixin, ...infer Next extends Mixin[]]
    ? Next extends []
      ? RecursiveMergeMixins<[], void, Merge<PreviousType, ExtractFromMixin<First>>>
      : RecursiveMergeMixins<Next, Merge<PreviousType, ExtractFromMixin<First>>>
    : never
  'done': ReturnType
}[M extends [] ? 'done' : 'next']

export type MixinsComposerType = <Fns extends MixinsArray, Base extends Type>(mixins: Fns, baseClass: Base, reversed?: boolean) => Type<ExtractFromType<Base> & RecursiveMergeMixins<Fns>>
export const MixinsComposer: MixinsComposerType =
  (mixins, baseClass, reversed = true) => {
    const processableMixins = reversed ? mixins.reverse() : mixins
    const remaining: [Mixin<unknown>, ...Mixin<unknown>[]] = tail(processableMixins)
    const currentMixin = head(mixins)
    if (remaining.length > 0) {
      const following = MixinsComposer(remaining, baseClass, false)
      return currentMixin(following)
    }
    return currentMixin(baseClass)
  }

export class NoopMixinBase {
}
