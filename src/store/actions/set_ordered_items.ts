import {ListItemData} from '../../common/types';

import {SET_ORDERED_ITEMS, TodoListAction} from '../action';

export function setOrderedItems(newOrderedItems: ListItemData[]): TodoListAction {
  return {
		type: SET_ORDERED_ITEMS,
		payload: {orderedItems: newOrderedItems}
	}
}