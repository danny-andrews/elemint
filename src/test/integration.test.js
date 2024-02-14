import { expect, test } from "vitest";
import makeElement from "../make-element.js";
import { renderElement } from "./index.js";

const Element = makeElement({
  props: {
    count: { default: 0 },
  },
  render: ({ count }, html, { emit }) => {
    const increment = () => {
      count.update((val) => val + 1);
      emit("count-changed", count.get());
    };
    const decrement = () => {
      count.update((val) => val - 1);
      emit("count-changed", count.get());
    };

    return html`
      <button data-test-id="decrement" onclick=${decrement}>-</button>
      <button data-test-id="increment" onclick=${increment}>+</button>
      <div>Count: ${count}</div>
    `;
  },
});

test("renders and stuff", () => {
  const element = renderElement(Element, { count: 4 });
  expect(element.getAttribute("count")).toBe("4");
  expect(element.count).toBe(4);
  element.count = 87;
  expect(element.getAttribute("count")).toBe("87");
  element.shadowRoot.querySelector('[data-test-id="decrement"]').click();
  expect(element.getAttribute("count")).toBe("86");
  element.addEventListener("count-changed", (e) => {
    expect(e.detail).toBe(e.detail);
  });
  element.shadowRoot.querySelector('[data-test-id="increment"]').click();
  expect(element.getAttribute("count")).toBe("87");
});
