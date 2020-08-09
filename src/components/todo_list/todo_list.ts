import { Unsubscribe } from 'redux';

import {areEqualArrays} from '../../common/utils';
import {ListItemData} from '../../common/types';
import {TodoService} from '../../services/todo_service';
import {TodoListState} from '../../store/state';
import {store} from '../../store/store';

import {ListItem} from '../list_item/list_item';
import {DragAndDrop} from './drag_and_drop';
import {template} from './template';

export class TodoList extends HTMLElement {
  disabled: boolean = false;

  private list: HTMLElement | null = null;
  private orderedItems: ListItemData[] = [];
  private _storeUnsubscribe!: Unsubscribe;
  private dragAndDrop: DragAndDrop | null = null;
  private todoService?: TodoService;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot!.appendChild(content);

    this.todoService = TodoService.getSingleton();
  }

  public connectedCallback() {
    this._storeUnsubscribe = store.subscribe(
        () => this.stateChanged(store.getState()));
    this.stateChanged(store.getState());

    this.list = <HTMLElement>this.shadowRoot!.querySelector('.list');

    this.dragAndDrop = new DragAndDrop(this);
    this.dragAndDrop.enable();
    this.render();
  }

  public disconnectedCallback() {
    this._storeUnsubscribe();

    this.dragAndDrop?.disable();
  }
  
  stateChanged(state: TodoListState) {
    if (areEqualArrays(this.orderedItems, state.orderedItems)) {
      return;
    }

    this.orderedItems = [...state.orderedItems];
    this.render();
  }

  public render() {
    if (this.list) {
      this.list.remove();
    }

    this.list = document.createElement('div');
    this.list.className = 'list';

    for (let item of this.orderedItems) {
      const listItem = new ListItem(item.id.toString(), item.text);
      this.list!.appendChild(listItem);
    }
    this.shadowRoot!.appendChild(this.list);
  }
  
  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback() {
    this.render();
  }
}

window.customElements.define('todo-list', TodoList);
