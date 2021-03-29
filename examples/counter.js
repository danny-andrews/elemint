import Component from "../src/component";

const Class = Component(
  [{ name: "count", default: 0 }],
  ({ count }, { html }) => html`
    <button onclick=${() => count.update((a) => a - 1)}>-</button>
    <button onclick=${() => count.update((a) => a + 1)}>+</button>
    <div>Count: ${count}</div>
  `
);

global.Class = Class;

// customElements.define("my-counter", Class);
