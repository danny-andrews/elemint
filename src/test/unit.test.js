import { expect, test } from "vitest";
import makeElement from "../make-element.js";
import { renderElement } from "./index.js";

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

test("accepts attribute name property name in HTML attribute", () => {
  const Element = makeElement({
    props: {
      maxLength: {
        attr: { name: "max-length" },
      },
    },
  });
  const subject = renderElement(Element, { "max-length": "22" });

  assert.is(subject.maxLength, 22);
});

test.todo("lowercases property name in HTML attribute");

test("defaults attr to true and type to String when given empty prop object", () => {
  const Element = makeElement({
    props: {
      name: {},
    },
  });
  const subject = renderElement(Element);

  subject.name = "stuff";
  expect(subject.getAttribute("name")).toBe("stuff");
});

test("parses attribute to Number when default is a Number", () => {
  const Element = makeElement({
    props: {
      age: { default: 50 },
    },
  });
  const subject = renderElement(Element, { age: "22" });
  expect(subject.age).toBe(22);
});
