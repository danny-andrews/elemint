import { test } from "uvu";
import * as assert from "uvu/assert";
import makeElement from "../component.js";
import { renderElement } from "../../test/index.js";

// types :: String | Number | Boolean | Object
// attr :: false | true | String

const propCases = {
  // Attr defaults to true, type defaults to String
  name: {},
  // Attr false if type is Object (not Number or Boolean)
  config: { default: {} },
  // Attr true
  name: { attr: true },
  // Attr false
  name: { attr: false },
  // Attr string
  name: { attr: "attr-name" },
  // Number default
  count: { default: 0 },
  // Boolean default
  enabled: { default: false },
};

test("empty prop object defaults attr to true and type to String", () => {
  const Element = makeElement({
    props: {
      name: {},
    },
    render: (_, html) => html`<div></div>`,
  });
  const subject = renderElement(Element);

  subject.name = "stuff";
  assert.is(subject.getAttribute("name"), "stuff");
});

test("number default parses numbers", () => {
  const Element = makeElement({
    props: {
      age: { default: 12 },
    },
    render: (_, html) => html`<div></div>`,
  });
  const subject = renderElement(Element, { age: "22" });
  assert.is(subject.age, 22);
});

test.run();
