import {
  Action,
  Reducer,
} from './types'

type ReducerArray<STATE, ACTION> = Reducer<STATE, ACTION>[]
export class MappedPipeReducer<STATE, ACTION_TYPE = any, ACTION extends Action = Action> {
  private reducerMap = new Map<ACTION_TYPE, ReducerArray<STATE, Action>>()

  /**
   * Append reducer functions for the given key
   */
  public add = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[],
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = Array.isArray(actionTypeOrActionTypes)
      ? actionTypeOrActionTypes
      : [actionTypeOrActionTypes]
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      const reducerArray: ReducerArray<STATE, SETTED_ACTION> = this.reducerMap.has(actionType)
        ? this.reducerMap.get(actionType)
        : []
      this.reducerMap.set(actionType, reducerArray.concat(reducerOrReducers))
    })
    return this
  }

  /**
   * Replace reducer functions for the given key
   */
  public set = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[],
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = Array.isArray(actionTypeOrActionTypes)
      ? actionTypeOrActionTypes
      : [actionTypeOrActionTypes]
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      this.reducerMap.set(actionType, reducers)
    })
    return this
  }

  public get = <SETTED_ACTION_TYPE extends ACTION_TYPE>(actionType: SETTED_ACTION_TYPE) => this.reducerMap.get(actionType)

  public reduce = (state: STATE, action: ACTION): STATE => {
    if (!this.reducerMap.has(action.type)) return state
    const reducers = this.reducerMap.get(action.type)
    return reducers.reduce((aState, reducer) => reducer(aState, action), state)
  }
}
