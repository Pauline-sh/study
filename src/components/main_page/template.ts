export const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
		grid-template-rows: auto 1fr;
	}
</style>

<main-page-header>${'Study room'}</main-page-header>
<todo-list></todo-list>
`;