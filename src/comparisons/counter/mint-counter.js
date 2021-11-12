import makeElement from "../../element/component.js";

const Element = makeElement({
  props: {
    count: { default: 0 },
    disabled: { default: false },
  },
  render: ({ count, disabled }, html, { emit }) => {
    const emitCountChangedEvent = () => {
      emit("count-changed", count.get());
    };

    const increment = () => {
      count.update((val) => val + 1);
      emitCountChangedEvent();
    };

    const decrement = () => {
      count.update((val) => val - 1);
      emitCountChangedEvent();
    };

    const toggleDisabled = () => {
      disabled.update((val) => !val);
    };

    return html`
      <button ?disabled=${disabled} onclick=${decrement}>-</button>
      <button ?disabled=${disabled} onclick=${increment}>+</button>
      <button onclick=${toggleDisabled}>Toggle Disabled</button>
      <div>Count: ${count}</div>
    `;
  },
});

customElements.define("mint-counter", Element);
