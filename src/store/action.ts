import {ListItemData} from '../common/types';
import {OrderedItemsMap} from './types';

export const SET_ORDERED_ITEMS = 'SET_ORDERED_ITEMS';
export const SET_ORDERED_ITEMS_MAP = 'SET_ORDERED_ITEMS_MAP';

interface SetOrderedItemsAction {
  type: typeof SET_ORDERED_ITEMS
  payload: {
    orderedItems: ListItemData[],
  }
}

interface SetOrderedItemsMapAction {
  type: typeof SET_ORDERED_ITEMS_MAP
  payload: {
    orderedItemsMap: OrderedItemsMap,
  }
}

export type TodoListAction =
  SetOrderedItemsAction |
  SetOrderedItemsMapAction;