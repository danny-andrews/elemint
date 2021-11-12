import { custom } from "lighterhtml";
import { isObservable } from "./util.js";

const handleObserver = (callback) => {
  return (node, ...args) => {
    const cb = callback.call({ type: "html" }, node, ...args);
    let oldValue;

    return (newValue) => {
      if (!isObservable(newValue)) {
        cb(newValue);
      } else if (oldValue !== newValue) {
        if (newValue) {
          newValue._subscription = newValue.subscribe(cb);
          oldValue = newValue;
        }
      }
    };
  };
};

const { html, render } = custom({
  any: handleObserver,
  attribute: handleObserver,
});

export { html, render };
