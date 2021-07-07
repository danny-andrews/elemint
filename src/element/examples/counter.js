import makeElement from "../component.js";

const Element = makeElement({
  props: {
    count: { default: 2 },
  },
  render: ({ count }, html) => {
    return html`
      <button
        onclick=${() => {
          count.update((a) => a - 1);
        }}
      >
        -
      </button>
      <button onclick=${() => count.update((a) => a + 1)}>+</button>
      <div>Count: ${count}</div>
    `;
  },
});

customElements.define("my-counter", Element);
