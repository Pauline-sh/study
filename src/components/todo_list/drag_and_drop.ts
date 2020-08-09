import { Unsubscribe } from 'redux';

import {ListItemData} from '../../common/types';
import {MapListItem} from '../../types/todo_list';

import {setOrderedItems} from '../../store/actions/set_ordered_items';
import {setOrderedItemsMap} from '../../store/actions/set_ordered_items_map';
import {TodoListState} from '../../store/state';
import {store} from '../../store/store';

import {ListItem} from '../list_item/list_item';

export class DragAndDrop {
	private readonly container: HTMLElement;
  private enabled: boolean = false;

  private draggedItem: ListItem | null = null;
  private hoveredItem: ListItem | null = null;
  private clientCoordinates: {x: number, y: number} = {x: 0, y: 0};
  private orderedItems: ListItemData[] = [];
  private orderedItemsMap: MapListItem = {};
  private animation: Promise<void> | null = null;

  private _storeUnsubscribe!: Unsubscribe;

	constructor(container: HTMLElement) {
    this.container = container;
	}

	public enable() {
		if (this.enabled) {
			return;
		}

    this.enabled = true;

    this._storeUnsubscribe = store.subscribe(
        () => this.stateChanged(store.getState()));
    this.stateChanged(store.getState());

    const state = store.getState();
    this.orderedItems = state.orderedItems;
    this.orderedItemsMap = state.orderedItemsMap;

    this.addDragApiListeners();
	}

	public disable() {
		if (!this.enabled) {
			return;
		}

    this.enabled = false;

    this._storeUnsubscribe();

		this.removeDragApiListeners();
	}
  
  stateChanged(state: TodoListState) {
    this.orderedItems = state.orderedItems;
    this.orderedItemsMap = state.orderedItemsMap;
  }

  private addDragApiListeners(): void {
    this.container.addEventListener('dragstart', (e) =>
        this.dragStartHandler(e));
    this.container.addEventListener('drag', (e) =>
        this.dragHandler(e));
    this.container.addEventListener('dragover', (e) =>
        this.dragOverHandler(e));
    this.container.addEventListener('dragleave', (e) =>
        this.dragLeaveHandler(e));
    this.container.addEventListener('drop', (e) =>
        this.dropHandler(e));
    this.container.addEventListener('dragend', (e) =>
        this.dragEndHandler(e));
  }

  private removeDragApiListeners(): void {
    this.container.removeEventListener('dragstart', (e) =>
        this.dragStartHandler(e));
    this.container.removeEventListener('drag', (e) =>
        this.dragHandler(e));
    this.container.removeEventListener('dragover', (e) =>
        this.dragOverHandler(e));
    this.container.removeEventListener('dragleave', (e) =>
        this.dragLeaveHandler(e));
    this.container.removeEventListener('drop', (e) =>
        this.dropHandler(e));
    this.container.removeEventListener('dragend', (e) =>
        this.dragEndHandler(e));
  }

  // Workaround for ancient firefox bug
  // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  private saveCoordinates(e: MouseEvent): void {
    this.clientCoordinates.x = e.clientX;
    this.clientCoordinates.y = e.clientY;
  }

  private getListElementFromEvent(e: MouseEvent): ListItem | undefined {
    const item = e.composedPath().find((item) => item instanceof ListItem);
    return item === undefined ? undefined : <ListItem>item;
  }

  private getItemIndex(item: ListItem): number {
    const id = parseInt(item.id, 10);
    return this.orderedItemsMap[id];
  }

  private swapItems(draggedIndex: number, hoveredIndex: number): void {
    // Initially swap items order.
    const temp = this.orderedItems[draggedIndex];
    this.orderedItems[draggedIndex] = this.orderedItems[hoveredIndex];
    this.orderedItems[hoveredIndex] = temp;
    // Then map their new indices to their ids for future retrieving.
    const draggedItemId = parseInt(this.draggedItem!.id, 10);
    const hoveredItemId = parseInt(this.hoveredItem!.id, 10);
    this.orderedItemsMap[draggedItemId] = hoveredIndex;
    this.orderedItemsMap[hoveredItemId] = draggedIndex;
  }

  private reorderItems(): void {
    const draggedIndex = this.getItemIndex(this.draggedItem!);
    const hoveredIndex = this.getItemIndex(this.hoveredItem!);
    this.swapItems(draggedIndex, hoveredIndex);

    this.hoveredItem!.ignoreWhileReordering = true;
    const direction = draggedIndex > hoveredIndex ? 'BOTTOM' : 'TOP';
    this.animation = this.hoveredItem!.animateReordering(direction);
  }

  private dragStartHandler(e: MouseEvent): void {
    const item = this.getListElementFromEvent(e);
    if (item) {
      document.addEventListener('dragover', (e) =>
          this.saveCoordinates(e));
      this.draggedItem = item;
      window.requestAnimationFrame(() => {
        this.draggedItem!.style.visibility = 'hidden';
      });
    }
  }

  private dragHandler(e: MouseEvent): void {
    if (!this.draggedItem || !this.hoveredItem) {
      return;
    }

    this.handleDrag();
  }

  private handleDrag(): void {
    const hoveredItemRect = this.hoveredItem!.getBoundingClientRect();
    const shouldReoder = !this.hoveredItem!.ignoreWhileReordering &&
        hoveredItemRect.top < this.clientCoordinates.y &&
        hoveredItemRect.bottom > this.clientCoordinates.y;

    if (shouldReoder) {
      this.reorderItems();
    }
  }

  private dragOverHandler(e: MouseEvent): void {
    const item = this.getListElementFromEvent(e);
    if (item && item.id !== this.draggedItem?.id) {
      this.hoveredItem = item;
      e.preventDefault();
    }
  }

  private dragLeaveHandler(e: MouseEvent): void {
    if (!this.hoveredItem) {
      return;
    }

    this.hoveredItem = null;
  }

  private dropHandler(e: MouseEvent): void {
  }

  private dragEndHandler(e: MouseEvent): void {
    if (this.hoveredItem) {
      this.hoveredItem = null;
    }

    document.removeEventListener('dragover', (e) =>
        this.saveCoordinates(e));
    this.clientCoordinates.x = 0;
    this.clientCoordinates.y = 0;

    this.updateState();
  }

  private async updateState(): Promise<void> {
    if (this.animation !== null) {
      await this.animation;
    }
    this.draggedItem!.style.visibility = '';
    this.draggedItem = null;
    store.dispatch(setOrderedItems(this.orderedItems));
    store.dispatch(setOrderedItemsMap(this.orderedItemsMap));
  }
}
