import './main_page_header';
import './dnd_list';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>

<main-page-header></main-page-header>
<dnd-list></dnd-list>
`;

export class MainPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {}
};

window.customElements.define('main-page', MainPage);
