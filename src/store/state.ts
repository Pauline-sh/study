import {ListItemData} from '../common/types';
import {OrderedItemsMap} from './types';

export interface TodoListState {
  orderedItems: ListItemData[],
  orderedItemsMap: OrderedItemsMap,
}

export const defaultTodoListState: TodoListState = {
  orderedItems: [],
  orderedItemsMap: {},
};
