const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
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
    this.header.addEventListener('pointerleave', (e) =>
        this.handleHeaderPointerLeave(e));
    this.render();
  }

  disconnectedCallback() {
    this.header.removeEventListener('pointerenter', (e) =>
        this.handleHeaderPointerEnter(e));
    this.header.removeEventListener('pointerleave', (e) =>
        this.handleHeaderPointerLeave(e));

    this.curAnimation.cancel();
    this.curAnimation = null;
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

  createHeaderAnimation() {
    const keyframes = [
      {transform: 'scale(1)', color: 'var(--color-light)'},
      {transform: 'scale(2)', color: 'var(--color-light-blue)'},
    ];
    const options = {
      duration: 600,
      fill: "forwards",
      easing: "cubic-bezier(.2, 1, .2, 1)",
      iterations: 1
    };
    return this.header.animate(keyframes, options);
  }

  handleHeaderPointerEnter() {
    if (!this.curAnimation) {
      this.curAnimation = this.createHeaderAnimation();
      return;
    }

    this.curAnimation.play();
    this.curAnimation.reverse();
  }

  handleHeaderPointerLeave() {
    if (!this.curAnimation) {
      return;
    }

    this.curAnimation.play();
    this.curAnimation.reverse();
  }
};

window.customElements.define('main-page-header', MainPageHeader);
