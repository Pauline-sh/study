// import {anime} from 'animejs/lib/anime.es.js';

import {DnDListItem} from './dnd_list_item';

const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  max-width: 226px;
  background-color: var(--color-light-blue);
  border-radius: 4px;
}
</style>`;

export class DnDList extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    this.itemsTexts = ['one', 'two', 'three'];
    // For storing items in order.
    this.orderedItems = [];
    this.orderedItemsMap = {};

    this.draggedItem = null;
    this.hoveredItem = null;

    this.dropSuccessful = false;

    this.clientCoordinates = {x: 0, y: 0};
  }

  connectedCallback() {
    this.addDragApiListeners();
    this.generateItems();
    this.render();
  }

  disconnectedCallback() {
    this.removeDragApiListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  generateItems() {
    for (let i = 0; i < this.itemsTexts.length; i++) {
      const item = new DnDListItem();
      item.id = i;
      item.text = this.itemsTexts[i];
      this.orderedItems.push(item);
      this.orderedItemsMap[item.id] = i;
    }
  }

  render() {
    for (let item of this.orderedItems) {
      this.shadowRoot.appendChild(item);
    }
  }

  addDragApiListeners() {
    this.addEventListener('dragstart', (e) =>
        this.dragStartHandler(e));
    this.addEventListener('drag', (e) =>
        this.dragHandler(e));
    this.addEventListener('dragover', (e) =>
        this.dragOverHandler(e));
    this.addEventListener('dragleave', (e) =>
        this.dragLeaveHandler(e));
    this.addEventListener('drop', (e) =>
        this.dropHandler(e));
    this.addEventListener('dragend', (e) =>
        this.dragEndHandler(e));
  }

  removeDragApiListeners() {
    this.removeEventListener('dragstart', (e) =>
        this.dragStartHandler(e));
    this.removeEventListener('drag', (e) =>
        this.dragHandler(e));
    this.removeEventListener('dragover', (e) =>
        this.dragOverHandler(e));
    this.removeEventListener('dragleave', (e) =>
        this.dragLeaveHandler(e));
    this.removeEventListener('drop', (e) =>
        this.dropHandler(e));
    this.removeEventListener('dragend', (e) =>
        this.dragEndHandler(e));
  }

  // Workaround for ancient firefox bug
  // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  saveCoordinates(e) {
    this.clientCoordinates.x = e.clientX;
    this.clientCoordinates.y = e.clientY;
  }

  dragStartHandler(e) {
    const item = e.composedPath().find((item) => item instanceof DnDListItem);
    if (item) {
      document.addEventListener('dragover', (e) =>
          this.saveCoordinates(e));
      this.draggedItem = item;
      window.requestAnimationFrame(() => {
        this.draggedItem.style.visibility = 'hidden';
      });
    }
  }

  getItemIndex(item) {
    return this.orderedItemsMap[item.id];
  }

  getItemFromEvent(e) {
    const item = e.composedPath().find((item) => item instanceof DnDListItem);
    return item !== undefined ? item : null;
  }

  async animateReordering(initialHoveredItemBcr, finalHoveredItemBcr) {
    const animatedItem = this.hoveredItem;
    const distance = initialHoveredItemBcr.top - finalHoveredItemBcr.top;
    const duration = 200;
    const keyframes = [
      {transform: `translateY(${distance}px)`},
      {transform: `translateY(${0}px)`},
    ];
    const options = {
      duration,
      iterations: 1,
      easing: 'ease-out',
    };
    animatedItem.animate(keyframes, options);
    await new Promise((resolve) => {
      setTimeout(() => {
        animatedItem.ignoreWhileReordering = false;
        resolve();
      }, duration);
    });
  }

  swapItems(draggedIndex, hoveredIndex) {
    // Initially swap items order.
    const temp = this.orderedItems[draggedIndex];
    this.orderedItems[draggedIndex] = this.orderedItems[hoveredIndex];
    this.orderedItems[hoveredIndex] = temp;
    // Then map their new indices to their ids for future retrieving.
    this.orderedItemsMap[this.draggedItem.id] = hoveredIndex;
    this.orderedItemsMap[this.hoveredItem.id] = draggedIndex;
  }

  getBoundingClientRectObj(object) {
    const {x, y, width, height, top, right, bottom, left} = object.getBoundingClientRect();
    return {x, y, width, height, top, right, bottom, left};
  }

  reorderItems() {
    const initialHoveredItemBcr = this.getBoundingClientRectObj(this.hoveredItem);

    const draggedIndex = this.getItemIndex(this.draggedItem);
    const hoveredIndex = this.getItemIndex(this.hoveredItem);
    this.swapItems(draggedIndex, hoveredIndex);
    this.hoveredItem.ignoreWhileReordering = true;

    this.render();
    const finalHoveredItemBcr = this.getBoundingClientRectObj(this.hoveredItem);
    this.animateReordering(initialHoveredItemBcr, finalHoveredItemBcr);
  }

  dragHandler(e) {
    if (!this.draggedItem || !this.hoveredItem) {
      return;
    }

    const hoveredItemRect = this.hoveredItem.getBoundingClientRect();
    const shouldReoder = hoveredItemRect.top < this.clientCoordinates.y &&
        hoveredItemRect.bottom > this.clientCoordinates.y && !this.hoveredItem.ignoreWhileReordering;

    if (shouldReoder) {
      this.reorderItems();
    }
  }

  dragOverHandler(e) {
    const item = this.getItemFromEvent(e);
    if (item && item.id !== this.draggedItem.id) {
      this.hoveredItem = item;
      e.preventDefault();
    }
  }

  dragLeaveHandler(e) {
    if (!this.hoveredItem) {
      return;
    }

    this.hoveredItem = null;
  }

  dropHandler(e) {
  }

  dragEndHandler(e) {
    window.requestAnimationFrame(() => {
      this.draggedItem.style.visibility = '';
      this.draggedItem = null;
    });

    if (this.hoveredItem) {
      this.hoveredItem = null;
    }

    document.removeEventListener('dragover', (e) =>
        this.saveCoordinates(e));
    this.clientCoordinates.x = 0;
    this.clientCoordinates.y = 0;
  }
}

window.customElements.define('dnd-list', DnDList);
