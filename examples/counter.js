import makeElement from "../src/element/component";

const Element = makeElement(
  {
    count: { default: 2 },
  },
  ({ count }, html) => {
    return html`
    <button onclick=${() => {
      count.update((a) => a - 1)
    }}>-</button>
    <button onclick=${() => count.update((a) => a + 1)}>+</button>
    <div>Count: ${count}</div>
  `
  });

customElements.define("my-counter", Element);
