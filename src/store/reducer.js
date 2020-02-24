import {defaultWorkshopState} from './state';
import {workshopAction} from './action';

export const workshopReducer = (state = defaultWorkshopState, action) => {
  switch(action.type) {
    case workshopAction.incrementCounter:
      return {
        ...state,
        counter: state.counter + 1,
      };
    case workshopAction.decrementCounter:
      return {
        ...state,
        counter: state.counter - 1,
      }
    default:
      return state;
  }
}
