import {
  SET_ORDERED_ITEMS,
  SET_ORDERED_ITEMS_MAP,
  TodoListAction
} from './action';
import {defaultTodoListState, TodoListState} from './state';

export const todoListReducer = (state: TodoListState = defaultTodoListState,
    action: TodoListAction): TodoListState => {
  switch(action.type) {
    case SET_ORDERED_ITEMS:
      return {
        ...state,
        orderedItems: action.payload.orderedItems,
      };
    case SET_ORDERED_ITEMS_MAP:
      return {
        ...state,
        orderedItemsMap: action.payload.orderedItemsMap,
      };
    default:
      return state;
  }
}
