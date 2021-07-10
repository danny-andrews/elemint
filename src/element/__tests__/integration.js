import { test } from "uvu";
import * as assert from "uvu/assert";
import "../../../test-setup.js";
import makeElement from "../component.js";
import { render, html } from "../../test/index.js";

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

customElements.define("mint-counter", Element);

test("renders and stuff", () => {
  render(document.body, html`<mint-counter count="4"></mint-counter>`);
  const element = document.querySelector("mint-counter");
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
