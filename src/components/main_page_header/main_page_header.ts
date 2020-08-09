import {template} from './template';

export class MainPageHeader extends HTMLElement {
  private header: HTMLElement;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot!.appendChild(content);

    this.header = <HTMLElement>this.shadowRoot!.querySelector('#header')!;
  }

  connectedCallback() {
    this.header.addEventListener('pointerenter', (e: MouseEvent) =>
        this.handleHeaderPointerEnter(e));
    this.render();
  }

  disconnectedCallback() {
    this.header.removeEventListener('pointerenter', (e: MouseEvent) =>
        this.handleHeaderPointerEnter(e));
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {}

  handleHeaderPointerEnter(e: MouseEvent) {
    if (!this.header.classList.contains('animated-scale-down')) {
      this.header.classList.add('animated-scale-down');
      this.header.removeEventListener('pointerenter', (e) =>
          this.handleHeaderPointerEnter(e));
    }
  }
};

window.customElements.define('main-page-header', MainPageHeader);
