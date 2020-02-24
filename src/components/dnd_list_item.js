const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  cursor: grab;
}

#label {
  font-family: var(--text-font);
  width: 200px;
  margin: 4px 4px;
  padding: 8px;

  background-color: var(--color-light);
  border: 1px solid;
  border-color:  var(--color-dark);
  border-radius: 4px;
}
</style>

<div id="label"></div>
`;

export class DnDListItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    this.text = '';
    this.label = this.shadowRoot.querySelector('#label');
    this.label.draggable = true;
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
}

window.customElements.define('dnd-list-item', DnDListItem);
