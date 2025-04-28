# Elemint

![](docs/size-badge.svg)

Elemint is a lightweight, reactive way to build web components. No classes, no compilers, no `this`, no decorators, no dynamic scoping madness. Just plain functions and reactive variables.

## Example

```js
import makeElement from "elemint";

const Counter = makeElement({
  props: {
    count: { default: 0 },
  },
  render: ({ count }, html) => {
    const decrement = () => count.update((a) => a - 1);
    const increment = () => count.update((a) => a + 1);

    return html`
      <button onclick=${decrement}>-</button>
      <button onclick=${increment}>+</button>
      <div>Count: ${count}</div>
    `;
  },
});

customElements.define("my-counter", Counter);
```

```html
<my-counter count="4" />
```

## Under the Hood

This core of this library is a factory function which takes some configuration and a render function, and returns a CustomElement class.

The core idea of this library is embedding reactive variables (or "cells") into HTML tagged template literals (courtesy of [lighterhtml](https://github.com/WebReflection/lighterhtml)).

A `Cell` is a type of `Observable` which has a current value, and who's value can be set from outside its definition. They are analagous to [Svelte stores](https://svelte.dev/docs#svelte_store) and are a variation of a 'Property' or 'Behavior' from Functional Reacttive Programming.

When a `Cell`'s value changes, only the corresponding part of the DOM is updated. So in the counter example above, when the `count` cell is updated by clicking on the increment and decrement buttons, only the text contained in the interpolated tags is updated.

## Prior Art

- [lighterHTML](https://github.com/WebReflection/lighterhtml)
- [calmm-js](https://github.com/calmm-js)

## Runtime Requirements

- ES6 Symbols
- ShadowDOM
- Custom Elements
- Constructable Stylesheets

If your target browser does not support these features, you will need to ship your own polyfills for them.

## Differences to LitElement

1. No classes/multiple inheretence, etc.
1. No polyfills assumed or included.
1. Smaller bundle.

## Aside: Google's Best Practices

Google has a list of [best practices](https://developers.google.com/web/fundamentals/web-components/best-practices) for building web components, almost all of which are automatically handled or simplified by elemint.

### Handled by elemint

1. Create a shadow root to encapsulate styles.
1. Create your shadow root in the constructor.
1. Place any children the element creates into its shadow root.
1. Do not override author-set, global attributes.

### Simplified by elemint

1. Always accept primitive data (strings, numbers, booleans) as either attributes or properties.
1. Aim to keep primitive data attributes and properties in sync, reflecting from property to attribute, and vice versa.
1. Aim to only accept rich data (objects, arrays) as properties.
1. Do not reflect rich data properties to attributes.
1. Dispatch events in response to internal component activity.

### Up to You

1. Consider checking for properties that may have been set before the element upgraded.
1. Do not dispatch events in response to the host setting a property.
1. Add a :host display style that respects the hidden attribute.
1. Use `<slot>` to project light DOM children into your shadow DOM.
1. Set a `:host` display style (e.g. `block`, `inline-block`, `flex`) unless you prefer the default of `inline`.
1. Do not self-apply classes.

## Limitations

No TypeScript support (yet).
