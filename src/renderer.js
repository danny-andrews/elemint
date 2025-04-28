import { custom, Hole } from "lighterhtml";
import { isObservable } from "./util.js";

const handleObserver = (callback) => {
  return (node, ...args) => {
    const cb = callback.call({ type: "html" }, node, ...args);
    let oldValue;

    const [attrName] = args;
    return (newValue) => {
      console.log(newValue, "new value");
      if (!isObservable(newValue)) {
        cb(newValue);
        return;
      }

      if (oldValue !== newValue && newValue) {
        const subscription = newValue.subscribe((val) => {
          if (val instanceof Hole) {
            console.log(val);
            callback.call({ type: "html" }, node, ...args)(val);
          } else {
            cb(val);
          }
        });

        const inputListener = (event) => {
          const Type = newValue.get().constructor;
          newValue.set(Type(event.target.value));
        };
        const isInputValue = node.nodeName === "INPUT" && attrName === "value";
        if (isInputValue) {
          node.addEventListener("input", inputListener);
        }

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
    };
  };
};

export const { html, render } = custom({
  any: handleObserver,
  attribute: handleObserver,
});
