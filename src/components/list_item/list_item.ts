import {getBoundingClientRectObj} from '../../common/get_bounding_client_rect';
import {BoundingClientRect, direction} from '../../common/types';

import {template} from './template';

const REORDERING_DURATION = 200;
const ITEMS_GAP = 4;

export class ListItem extends HTMLElement {
  public ignoreWhileReordering: boolean;
  public label: HTMLElement;
  public text: string;

  private currentOffset: number = 0;

  constructor(id: string, text: string) {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot!.appendChild(content);

    this.ignoreWhileReordering = false;
    this.label = <HTMLElement>this.shadowRoot!.querySelector('#label')!;
    this.label.draggable = true;
    this.id = id;
    this.text = text;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.label.textContent = this.text;
  }

  async animateReordering(direction: direction): Promise<void> {
    const initialHoveredItemBcr: BoundingClientRect =
        getBoundingClientRectObj(this);
    const distance = initialHoveredItemBcr.height + ITEMS_GAP + this.currentOffset;
    const destination =  direction === 'TOP' ? -distance : distance;

    this.currentOffset === 0 ?
        this.style.setProperty('--item-reorder-distance', `${-destination}px`) :
        this.style.setProperty('--item-reorder-distance', `${this.currentOffset}px`);
    this.currentOffset = destination;
    this.style.translate = `0px ${destination}px`;
    this.classList.add('reordering');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.ignoreWhileReordering = false;
        this.classList.remove('reordering', 'reordering-reversed');
        this.style.removeProperty('--item-reorder-distance');
        resolve();
      }, REORDERING_DURATION);
    });
  }
}

window.customElements.define('list-item', ListItem);
