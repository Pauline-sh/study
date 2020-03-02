const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background-color: var(--color-dark);
  }

  :host h1 {
    color: var(--color-light);
    font-family: var(--text-font);
  }

  :host h1:hover {
    animation: scale-up 1s cubic-bezier(.2, 1, .2, 1) forwards;
  }

  .animated-scale-down {
    animation: scale-down 1s cubic-bezier(.2, 1, .2, 1) forwards;
  }

  @keyframes scale-up {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }

  @keyframes scale-down {
    0% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>

<div class='container'>
  <h1 id='header'></h1>
</div>`;

export class MainPageHeader extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    this.header = this.shadowRoot.querySelector('#header');
    this.curAnimation = null;
    this.text = 'Study room';
  }

  connectedCallback() {
    this.header.addEventListener('pointerenter', (e) =>
        this.handleHeaderPointerEnter(e));
    this.render();
  }

  disconnectedCallback() {
    this.header.removeEventListener('pointerenter', (e) =>
        this.handleHeaderPointerEnter(e));
  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  set text(text) {
    this.setAttribute('text', text);
  }

  get text() {
    return this.getAttribute('text');
  }

  render() {
    this.header.innerHTML = this.text;
  }

  handleHeaderPointerEnter() {
    if (!this.header.classList.contains('animated-scale-down')) {
      this.header.classList.add('animated-scale-down');
      this.header.removeEventListener('pointerenter', (e) =>
          this.handleHeaderPointerEnter(e));
    }
  }
};

window.customElements.define('main-page-header', MainPageHeader);
