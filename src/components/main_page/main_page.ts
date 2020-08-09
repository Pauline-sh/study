import {template} from './template';

import '../main_page_header/main_page_header';
import '../todo_list/todo_list';

export class MainPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot!.appendChild(content);
  }

  connectedCallback() {
    this.render();
  }

  render() {}
};

window.customElements.define('main-page', MainPage);
