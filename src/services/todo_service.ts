import {ListItemData} from '../common/types';
import {stubItems} from '../common/stub_data';

import {setOrderedItems} from '../store/actions/set_ordered_items';
import {setOrderedItemsMap} from '../store/actions/set_ordered_items_map';
import {store} from '../store/store';
import {OrderedItemsMap} from '../store/types';

export class TodoService {
	static instance: TodoService | null = null;

	private constructor() {
		this.prepareItems();
	}

  private prepareItems(): void {
    const orderedItems: ListItemData[] = []; 
    const orderedItemsMap: OrderedItemsMap = {};

    for (let i = 0; i < stubItems.length; i++) {
      orderedItems.push(stubItems[i]);
      orderedItemsMap[stubItems[i].id] = i;
		}

    store.dispatch(setOrderedItems(orderedItems));
    store.dispatch(setOrderedItemsMap(orderedItemsMap));
  }

	static getSingleton() {
		return TodoService.instance ? TodoService.instance : new TodoService();
	}
}