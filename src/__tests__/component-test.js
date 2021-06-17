import t from "tap";
// Types: Number, Boolean, Object
// attr values: false, true, String

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

t.test('passes', async (is) => {
  is.same(1, 1);
});
