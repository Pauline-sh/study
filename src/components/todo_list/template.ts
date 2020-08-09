export const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
	display: flex;
	align-items: center;
  flex-direction: column;

	height: 100vh;
  width: 100%;

	overflow: auto;
}

.list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  gap: 4px;

  padding: 4px;
  max-width: 226px;
  background-color: var(--color-light-blue);
  border-radius: 4px;
}

.reordering {
  animation: reorder .2s ease-out;
}

@keyframes reorder {
  0% {
    transform: translateY(var(--item-reorder-distance));
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
`;
