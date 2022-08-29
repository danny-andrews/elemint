import { custom } from "lighterhtml";
import { isObservable } from "./util.js";

const handleObserver = (callback) => {
  return (node, ...args) => {
    const cb = callback.call({ type: "html" }, node, ...args);
    let oldValue;

    const [attrName] = args;
    return (newValue) => {
      if (!isObservable(newValue)) {
        cb(newValue);
      } else if (oldValue !== newValue) {
        if (newValue) {
          const inputListener = (event) => {
            const Type = newValue.get().constructor;
            newValue.set(Type(event.target.value));
          };
          const isInputValue =
            node.nodeName === "INPUT" && attrName === "value";
          if (isInputValue) {
            node.addEventListener("input", inputListener);
          }
          const subscription = newValue.subscribe(cb);
          newValue._subscription = {
            unsubscribe: () => {
              subscription.unsubscribe();
              if (isInputValue) {
                node.removeEventListener("input", inputListener);
              }
            },
          };

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
