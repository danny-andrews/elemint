import makeElement from "../src/element/component";
import { map } from "../src/reactive/index";

const Element = makeElement(
  {
    value: { default: "Hey" },
  },
  function* ({ value }, html, { root }) {
    const onChange = (e) => {
      value.set(e.target.value);
    };
    const input = map((el) => el.querySelector("input"), map);
    yield input.subscribe((el) => {
      el.style.color = "green";
    });

    return html`<input value=${value} onchange=${onChange} />`;
  }
);

customElements.define("my-input", Element);
