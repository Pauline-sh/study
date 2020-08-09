import {SET_ORDERED_ITEMS_MAP, TodoListAction} from '../action';
import {OrderedItemsMap} from '../types';

export function setOrderedItemsMap(newOrderedItemsMap: OrderedItemsMap): TodoListAction {
  return {
		type: SET_ORDERED_ITEMS_MAP,
		payload: {orderedItemsMap: newOrderedItemsMap}
	}
}