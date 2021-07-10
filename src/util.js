const hasMethod = (method, value) => typeof value[method] === "function";

export const isObservable = (value) => hasMethod("subscribe", value);

export const isCell = (value) =>
  ["get", "set", "update"].every((method) => hasMethod(method, value));

export const last = (arr) => arr[arr.length - 1];

export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

export const generatorToArray = (generator) => {
  let array = [];
  let result;
  while (true) {
    result = generator.next();
    array.push(result.value);
    if (result.done) {
      break;
    }
  }
  return array;
};

export const noop = () => {};

export const supportsAdoptingStyleSheets =
  window.ShadowRoot &&
  "adoptedStyleSheets" in document &&
  "replace" in CSSStyleSheet;

export const pipeline = (arg, ...fns) => fns.reduce((v, fn) => fn(v), arg);
