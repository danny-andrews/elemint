import * as R from "ramda";
import { pipe, combine, map } from "../src/callbags";
import makeElement from "../src/component";
import Cell from "../src/Cell";

const createRef = () => {
  const ref = Cell(null);
  const refSetter = (el) => {
    ref.set(el);
  };

  return [ref, refSetter];
};

const Element = makeElement(
  {
    multiplier: { default: 1 },
    count: { default: 0 },
    disabled: { default: false },
  },
  function* ({ count, multiplier, disabled }, html, { emit, context }) {
    // Computed property
    const total = pipe(
      combine(count, multiplier),
      map(([a, b]) => a * b)
    );
    const increment = () => {
      count.update(R.inc);
      emit("count-changed", count.get());
    };
    const decrement = () => {
      count.update(R.dec);
      emit("count-changed", count.get());
    };
    console.log(context.querySelector("decrement"));

    return html`
      <button part="decrement" ?disabled=${disabled} onclick=${decrement}>
        -
      </button>
      <button ?disabled=${disabled} onclick=${increment}>+</button>
      <button onclick=${() => disabled.update(R.not)}>Toggle Disabled</button>
      <div>Count: ${count}</div>
      <div>Multiplier: ${multiplier}</div>
      <div>Total: ${total}</div>
    `;
  }
);

customElements.define("fp-counter", Element);
