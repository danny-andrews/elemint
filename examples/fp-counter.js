import * as R from "ramda";
import makeElement from "../src/element/component";
import { combineLatest, map } from "../src/reactive/index";

const Element = makeElement(
  {
    multiplier: { default: 1 },
    count: { default: 0 },
    disabled: { default: false },
  },
  function ({ count, multiplier, disabled }, html, { emit }) {
    // Computed property
    const total = map(([a, b]) => a * b, combineLatest(count, multiplier));
    const increment = () => {
      count.update(R.inc);
      emit("count-changed", count.get());
    };
    const decrement = () => {
      count.update(R.dec);
      emit("count-changed", count.get());
    };
    const toggleDisabled = () => disabled.update(R.not);

    return html`
      <button ?disabled=${disabled} onclick=${decrement}>-</button>
      <button ?disabled=${disabled} onclick=${increment}>+</button>
      <button onclick=${toggleDisabled}>Toggle Disabled</button>
      <div>Count: ${count}</div>
      <div>Multiplier: ${multiplier}</div>
      <div>Total: ${total}</div>
    `;
  }
);

customElements.define("fp-counter", Element);
