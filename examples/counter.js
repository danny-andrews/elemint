import makeElement from "../src/component";

const Element = makeElement(
  {
    count: { default: 0 },
  },
  ({ count }, html) => html`
    <button onclick=${() => count.update((a) => a - 1)}>-</button>
    <button onclick=${() => count.update((a) => a + 1)}>+</button>
    <div>Count: ${count}</div>
  `
);

customElements.define("my-counter", Element);
