import { test } from "uvu";
import * as assert from "uvu/assert";
import "../../scripts/test-setup.js";
import makeElement from "../make-element.js";
import { renderElement } from "../test-utils.js";

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
  assert.is(element.getAttribute("count"), "4");
  assert.is(element.count, 4);
  element.count = 87;
  assert.is(element.getAttribute("count"), "87");
  element.shadowRoot.querySelector('[data-test-id="decrement"]').click();
  assert.is(element.getAttribute("count"), "86");
  element.addEventListener("count-changed", (e) => {
    assert.is(e.detail, 87);
  });
  element.shadowRoot.querySelector('[data-test-id="increment"]').click();
  assert.is(element.getAttribute("count"), "87");
});

test.run();
