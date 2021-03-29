import * as R from "ramda";
import { pipe, combine, map, subscribe } from "../src/callbags";
import Component from "../src/component";

const Class = Component(
  [
    { name: "multiplier", default: 1 },
    { name: "count", default: 0 },
    { name: "disabled", default: false },
  ],
  ({ count, multiplier, disabled }, { html, emit }) => {
    // Computed property
    const total = pipe(
      combine(count, multiplier),
      map(([a, b]) => a * b)
    );

    // Subscribe to a property
    const unsubscribe = subscribe((t) => {
      // Emit events
      emit("total-changed", t);
    })(total);

    return {
      template: html`
        <button ?disabled=${disabled} onclick=${() => count.update(R.dec)}>
          -
        </button>
        <button ?disabled=${disabled} onclick=${() => count.update(R.inc)}>
          +
        </button>
        <button onclick=${() => disabled.update(R.not)}>Toggle Disabled</button>
        <div>Count: ${count}</div>
        <div>Multiplier: ${multiplier}</div>
        <div>Total: ${total}</div>
      `,
      destroy: unsubscribe,
    };
  }
);

customElements.define("fp-counter", Class);
