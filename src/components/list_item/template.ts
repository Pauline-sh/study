export const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  cursor: grab;
}

#label {
  font-family: var(--text-font);
  width: 200px;
  padding: 8px;

  background-color: var(--color-light);
  border: 1px solid;
  border-color:  var(--color-dark);
  border-radius: 4px;
}
</style>

<div id="label"><slot></slot></div>
`;