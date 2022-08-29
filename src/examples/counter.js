import * as R from "ramda";
import makeElement from "../make-element";
import { combineLatest, map } from "../reactive/index.js";

const Counter = makeElement({
  props: {
    multiplier: { default: 1 },
    count: { default: 0 },
    disabled: { default: false },
    onDelete: { attr: false },
  },
  render: ({ count, multiplier, disabled, onDelete }, html, { root }) => {
    const total = map(([a, b]) => a * b, combineLatest(count, multiplier));
    const increment = () => {
      count.update(R.inc);
    };
    const decrement = () => {
      count.update(R.dec);
    };
    const toggleDisabled = () => {
      disabled.update(R.not);
    };

    root.onMount(() => {
      const timerId = setInterval(() => {
        increment();
      }, 1000);

      return () => {
        clearInterval(timerId);
      };
    });

    const disabledText = map(
      (isDisabled) => (isDisabled ? "Enable" : "Disable"),
      disabled
    );

    return html`
      <div class="counter">
        <button ?disabled=${disabled} onclick=${decrement}>-</button>
        <button ?disabled=${disabled} onclick=${increment}>+</button>
        <button onclick=${onDelete.get()}>X</button>
        <button onclick=${toggleDisabled}>${disabledText}</button>
        <div>Count: ${count}</div>
        <div>Multiplier: ${multiplier}</div>
        <div>Total: ${total}</div>
      </div>
    `;
  },
  css: `
    .counter {
      display: inline-block;
      margin-top: .5rem;
      margin-left: .5rem;
      padding: .5rem;
      border: 1px dashed black;
    }
  `,
});

customElements.define("mint-counter", Counter);
