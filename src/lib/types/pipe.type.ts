import {AnyFunction, BooleanSwitch, ExtractFunctionArguments, ExtractFunctionReturnValue, IsAny} from "./utils.types";


export type Pipe<Fns extends any[], IsPipe = true, PreviousFunction = void, InitalParams extends any[] = any[], ReturnType = any> = {
  'next': ( ( ..._: Fns ) => any ) extends ( ( _: infer First, ..._1: infer Next ) => any )
    ? PreviousFunction extends void
      ? Pipe<Next, IsPipe, First, ExtractFunctionArguments<First>, ExtractFunctionReturnValue<First> >
      : ReturnType extends ExtractFunctionArguments<First>[0]
        ? Pipe<Next, IsPipe, First, InitalParams, ExtractFunctionReturnValue<First> >
        : IsAny<ReturnType> extends true
          ? Pipe<Next, IsPipe, First, InitalParams, ExtractFunctionReturnValue<First> >
          : {
            ERROR: ['Return type ', ReturnType , 'does comply with the input of', ExtractFunctionArguments<First>[0]],
            POSITION: ['Position of problem for input arguments is at', Fns['length'], 'from the', BooleanSwitch<IsPipe, 'end', 'beginning'> , 'and the output of function to the ', BooleanSwitch<IsPipe, 'left', 'right'>],
          }
    : never
  'done': ( ...args: InitalParams ) => ReturnType,
}[
  Fns extends []
    ? 'done'
    : 'next'
  ]

export type PipeFn = <Fns extends [AnyFunction, ...AnyFunction[]] >(
  ...fns: Fns &
    Pipe<Fns> extends AnyFunction
    ? Fns
    : never
) =>  Pipe<Fns>

