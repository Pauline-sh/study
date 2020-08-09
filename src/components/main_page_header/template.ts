export const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background-color: var(--color-dark);
  }

  :host h1 {
    color: var(--color-light);
    font-family: var(--text-font);
    cursor: pointer;
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
  <h1 id='header'><slot></slot></h1>
</div>`;